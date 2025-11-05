import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationType, NotificationPriority } from "@prisma/client";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const adminAuth = verifyAdminToken(req);
    if (!adminAuth.success) {
      return NextResponse.json(
        { success: false, error: adminAuth.error || "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 공지사항 조회 (Prisma 사용)
    const announcements = await prisma.announcements.findMany({
      include: {
        notifications: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            veterinarians: {
              select: {
                realName: true,
              },
            },
            veterinary_students: {
              select: {
                realName: true,
              },
            },
            hospitals: {
              select: {
                representativeName: true,
              },
            },
          },
        },
        notification_batches: {
          select: {
            totalRecipients: true,
            sentCount: true,
            status: true,
            completedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        notifications: {
          createdAt: "desc",
        },
      },
    });

    // 읽음 수 계산
    const notificationIdentifiers = announcements
      .map((announcement: any) => ({
        title: announcement.notifications?.title,
        senderId: announcement.users?.id,
      }))
      .filter((id) => id.title && id.senderId);

    if (notificationIdentifiers.length > 0) {
      const readCounts = await prisma.notifications.groupBy({
        by: ["title", "senderId"],
        where: {
          type: "ANNOUNCEMENT",
          isRead: true,
          OR: notificationIdentifiers.map((id) => ({
            title: id.title,
            senderId: id.senderId,
          })),
        },
        _count: {
          id: true,
        },
      });

      const countsMap = new Map<string, number>();
      readCounts.forEach((group) => {
        if (group.title && group.senderId) {
          const key = `${group.title}:${group.senderId}`;
          countsMap.set(key, group._count.id);
        }
      });

      // 데이터 변환
      const transformedAnnouncements = announcements.map((announcement: any) => {
        const latestBatch = announcement.notification_batches?.[0];
        const authorName =
          announcement.users?.veterinarians?.realName ||
          announcement.users?.veterinary_students?.realName ||
          announcement.users?.hospitals?.representativeName ||
          "관리자";

        const key = `${announcement.notifications?.title}:${announcement.users?.id}`;
        const readCount = countsMap.get(key) || 0;

        return {
          id: announcement.id,
          title: announcement.notifications?.title || "",
          content: announcement.notifications?.content || "",
          images: (announcement as any).images || [],
          priority: announcement.priority || "NORMAL",
          status: latestBatch?.status === "COMPLETED" ? "SENT" : "DRAFT",
          sendCount: latestBatch?.sentCount || 0,
          totalRecipients: latestBatch?.totalRecipients || 0,
          readCount: readCount,
          author: authorName,
          createdAt: announcement.notifications?.createdAt || new Date(),
          updatedAt: announcement.notifications?.updatedAt || new Date(),
          sentAt: latestBatch?.completedAt || null,
          targetUsers: announcement.targetUserTypes || [],
        };
      });

      return NextResponse.json({
        success: true,
        data: transformedAnnouncements,
      });
    } else {
      // 데이터 변환 (읽음 수를 0으로)
      const transformedAnnouncements = announcements.map((announcement: any) => {
        const latestBatch = announcement.notification_batches?.[0];
        const authorName =
          announcement.users?.veterinarians?.realName ||
          announcement.users?.veterinary_students?.realName ||
          announcement.users?.hospitals?.representativeName ||
          "관리자";

        return {
          id: announcement.id,
          title: announcement.notifications?.title || "",
          content: announcement.notifications?.content || "",
          images: (announcement as any).images || [],
          priority: announcement.priority || "NORMAL",
          status: latestBatch?.status === "COMPLETED" ? "SENT" : "DRAFT",
          sendCount: latestBatch?.sentCount || 0,
          totalRecipients: latestBatch?.totalRecipients || 0,
          readCount: 0,
          author: authorName,
          createdAt: announcement.notifications?.createdAt || new Date(),
          updatedAt: announcement.notifications?.updatedAt || new Date(),
          sentAt: latestBatch?.completedAt || null,
          targetUsers: announcement.targetUserTypes || [],
        };
      });
      return NextResponse.json({
        success: true,
        data: transformedAnnouncements,
      });
    }
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const adminAuth = verifyAdminToken(req);
    if (!adminAuth.success) {
      return NextResponse.json(
        { success: false, error: adminAuth.error || "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, images, priority, targetUsers } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "제목과 내용은 필수입니다." },
        { status: 400 }
      );
    }

    // 관리자 사용자 찾기 (임시로 첫 번째 사용자 사용)
    const adminUser = await prisma.users.findFirst();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "관리자 사용자를 찾을 수 없습니다." },
        { status: 500 }
      );
    }

    const notificationId = nanoid();
    const announcementId = nanoid();

    // 공지사항 드래프트 생성 (트랜잭션 사용)
    const result = await prisma.$transaction(async (tx) => {
      // 1. 먼저 notification 생성 (드래프트로, 실제 수신자는 관리자 자신)
      const notification = await tx.notifications.create({
        data: {
          id: notificationId,
          type: NotificationType.ANNOUNCEMENT,
          recipientId: adminUser.id,
          recipientType: adminUser.userType,
          senderId: adminUser.id,
          title,
          content,
          updatedAt: new Date(),
        },
      });

      // 2. announcement 생성
      const announcement = await tx.announcements.create({
        data: {
          id: announcementId,
          notificationId: notificationId,
          targetUserTypes: Array.isArray(targetUsers)
            ? targetUsers
            : targetUsers
            ? [targetUsers]
            : ["VETERINARIAN", "HOSPITAL", "VETERINARY_STUDENT"],
          priority:
            (priority as NotificationPriority) || NotificationPriority.NORMAL,
          images: Array.isArray(images) ? images.filter(img => img !== null && img !== undefined) : [],
          contentType: "text",
          createdBy: adminUser.id,
        } as any,
      });

      return { notification, announcement };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.announcement.id,
        title,
        content,
        images: (result.announcement as any).images || [],
        priority: result.announcement.priority,
        targetUsers: result.announcement.targetUserTypes,
        status: "DRAFT",
        sendCount: 0,
        totalRecipients: 0,
        readCount: 0,
        author: "관리자",
        createdAt: result.notification.createdAt,
        updatedAt: result.notification.updatedAt,
        sentAt: null,
      },
    });
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
