import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType, NotificationPriority, UserType, NotificationBatchStatus } from "@prisma/client";
import { getCurrentUser } from "@/actions/auth";
import { nanoid } from "nanoid";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, priority, targetUsers } = body;
    const announcementId = params.id;

    // 공지사항 수정
    const result = await prisma.$transaction(async (tx) => {
      // 1. announcement 정보 조회
      const announcement = await tx.announcements.findUnique({
        where: { id: announcementId },
        include: { notifications: true },
      });

      if (!announcement) {
        throw new Error("공지사항을 찾을 수 없습니다.");
      }

      // 2. notification 업데이트
      const updatedNotification = await tx.notifications.update({
        where: { id: announcement.notificationId },
        data: {
          title,
          content,
          updatedAt: new Date(),
        },
      });

      // 3. announcement 업데이트
      const updatedAnnouncement = await tx.announcements.update({
        where: { id: announcementId },
        data: {
          targetUserTypes: Array.isArray(targetUsers) ? targetUsers : [targetUsers],
          priority: priority as NotificationPriority,
        },
      });

      return { notification: updatedNotification, announcement: updatedAnnouncement };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.announcement.id,
        title,
        content,
        priority,
        targetUsers: result.announcement.targetUserTypes,
        updatedAt: result.notification.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const announcementId = params.id;

    // 공지사항 삭제 (Cascade로 관련 데이터도 함께 삭제됨)
    await prisma.announcements.delete({
      where: { id: announcementId },
    });

    return NextResponse.json({
      success: true,
      message: "공지사항이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body; // 'publish' 또는 'send'
    const announcementId = params.id;

    if (action === 'publish') {
      // 게시 상태로 변경 (실제 발송은 하지 않음)
      return NextResponse.json({
        success: true,
        message: "공지사항이 게시되었습니다.",
      });
    }

    if (action === 'send') {
      // 실제 사용자들에게 공지사항 발송
      const result = await prisma.$transaction(async (tx) => {
        // 1. 공지사항 정보 조회
        const announcement = await tx.announcements.findUnique({
          where: { id: announcementId },
          include: { notifications: true },
        });

        if (!announcement) {
          throw new Error("공지사항을 찾을 수 없습니다.");
        }

        // 2. 대상 사용자들 조회 (작성자 본인 제외)
        const targetUserTypes = announcement.targetUserTypes as UserType[];
        let whereClause: any = {
          id: {
            not: announcement.createdBy // 작성자 본인 제외
          }
        };

        if (!targetUserTypes.includes('ALL' as any)) {
          whereClause.userType = { in: targetUserTypes };
        }

        const targetUsers = await tx.users.findMany({
          where: whereClause,
          select: { id: true, userType: true },
        });

        // 3. 배치 기록 생성
        const batchId = nanoid();
        await tx.notification_batches.create({
          data: {
            id: batchId,
            announcementId: announcementId,
            totalRecipients: targetUsers.length,
            sentCount: 0,
            status: NotificationBatchStatus.PENDING,
            startedAt: new Date(),
          },
        });

        // 4. 각 대상 사용자에게 개별 알림 생성
        let sentCount = 0;
        const notifications = [];

        for (const user of targetUsers) {
          try {
            const notificationId = nanoid();
            const notification = await tx.notifications.create({
              data: {
                id: notificationId,
                type: NotificationType.ANNOUNCEMENT,
                recipientId: user.id,
                recipientType: user.userType,
                senderId: userResult.user.id,
                title: announcement.notifications.title,
                content: announcement.notifications.content,
                updatedAt: new Date(),
              },
            });
            notifications.push(notification);
            sentCount++;
          } catch (error) {
            console.error(`Failed to send notification to user ${user.id}:`, error);
          }
        }

        // 5. 배치 상태 업데이트
        await tx.notification_batches.update({
          where: { id: batchId },
          data: {
            sentCount,
            status: sentCount === targetUsers.length ? NotificationBatchStatus.COMPLETED : NotificationBatchStatus.FAILED,
            completedAt: new Date(),
          },
        });

        return { sentCount, totalRecipients: targetUsers.length, notifications };
      });

      return NextResponse.json({
        success: true,
        message: `공지사항이 ${result.sentCount}명에게 발송되었습니다.`,
        data: {
          sentCount: result.sentCount,
          totalRecipients: result.totalRecipients,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to process announcement action:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process action" },
      { status: 500 }
    );
  }
}