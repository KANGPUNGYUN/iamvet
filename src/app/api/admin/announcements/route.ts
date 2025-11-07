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
      },
      orderBy: {
        notifications: {
          createdAt: "desc",
        },
      },
    });

    const announcementDetails = await Promise.all(
      announcements.map(async (announcement: any) => {
        const authorName =
          announcement.users?.veterinarians?.realName ||
          announcement.users?.veterinary_students?.realName ||
          announcement.users?.hospitals?.representativeName ||
          "관리자";

        // Count all individual notifications sent for this announcement
        const totalSentNotifications = await prisma.notifications.count({
          where: {
            type: NotificationType.ANNOUNCEMENT,
            senderId: announcement.createdBy,
            title: announcement.notifications.title,
          },
        });

        // Count read notifications for this announcement
        const totalReadNotifications = await prisma.notifications.count({
          where: {
            type: NotificationType.ANNOUNCEMENT,
            senderId: announcement.createdBy,
            title: announcement.notifications.title,
            isRead: true,
          },
        });

        // Determine status based on whether any notifications were sent
        const status = totalSentNotifications > 0 ? "SENT" : "DRAFT";

        return {
          id: announcement.id,
          title: announcement.notifications?.title || "",
          content: announcement.notifications?.content || "",
          images: (announcement as any).images || [],
          priority: announcement.priority || "NORMAL",
          status: status,
          sendCount: totalSentNotifications,
          totalRecipients: totalSentNotifications,
          readCount: totalReadNotifications,
          author: authorName,
          createdAt: announcement.notifications?.createdAt || new Date(),
          updatedAt: announcement.notifications?.updatedAt || new Date(),
          sentAt: totalSentNotifications > 0 ? announcement.notifications?.createdAt : null,
          targetUsers: announcement.targetUserTypes || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: announcementDetails,
    });
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
