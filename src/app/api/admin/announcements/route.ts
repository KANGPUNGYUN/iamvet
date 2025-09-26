import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType, NotificationPriority, UserType } from "@prisma/client";
import { getCurrentUser } from "@/actions/auth";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    // 관리자 인증 확인 (필요시)
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 공지사항 조회 (announcements 테이블에서 직접)
    const announcements = await prisma.announcements.findMany({
      include: {
        users: {
          select: {
            realName: true,
            nickname: true,
          },
        },
        notifications: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        notification_batches: {
          select: {
            totalRecipients: true,
            sentCount: true,
            status: true,
            completedAt: true,
          },
        },
      },
      orderBy: {
        notifications: {
          createdAt: "desc",
        },
      },
    });

    // 데이터 변환
    const transformedAnnouncements = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.notifications.title,
      content: announcement.notifications.content,
      priority: announcement.priority,
      targetUsers: announcement.targetUserTypes,
      status: announcement.notification_batches.length > 0 
        ? announcement.notification_batches[0].status === 'COMPLETED' ? 'SENT' : 'PUBLISHED'
        : 'DRAFT',
      sendCount: announcement.notification_batches[0]?.sentCount || 0,
      totalRecipients: announcement.notification_batches[0]?.totalRecipients || 0,
      readCount: 0, // 추후 구현 필요
      author: announcement.users.realName || announcement.users.nickname || '관리자',
      createdAt: announcement.notifications.createdAt,
      updatedAt: announcement.notifications.updatedAt,
      sentAt: announcement.notification_batches[0]?.completedAt,
    }));

    return NextResponse.json({
      success: true,
      data: transformedAnnouncements,
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
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, priority, targetUsers } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "제목과 내용은 필수입니다." },
        { status: 400 }
      );
    }

    const announcementId = nanoid();
    const draftNotificationId = nanoid();

    // 트랜잭션으로 공지사항 생성 (초안용 단일 notification만 생성)
    const result = await prisma.$transaction(async (tx) => {
      // 1. 초안용 notification 생성 (관리자 본인에게만, 실제 발송 전까지 표시용)
      const notification = await tx.notifications.create({
        data: {
          id: draftNotificationId,
          type: NotificationType.ANNOUNCEMENT,
          recipientId: userResult.user!.id,
          recipientType: userResult.user!.userType as UserType,
          senderId: userResult.user!.id,
          title,
          content,
          updatedAt: new Date(),
          isRead: true, // 작성자는 이미 읽은 것으로 처리
        },
      });

      // 2. announcement 생성
      const announcement = await tx.announcements.create({
        data: {
          id: announcementId,
          notificationId: draftNotificationId,
          targetUserTypes: Array.isArray(targetUsers) ? targetUsers : [targetUsers],
          priority: priority as NotificationPriority,
          createdBy: userResult.user!.id,
        },
      });

      return { notification, announcement };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.announcement.id,
        title,
        content,
        priority,
        targetUsers: result.announcement.targetUserTypes,
        status: 'DRAFT',
        sendCount: 0,
        totalRecipients: 0,
        readCount: 0,
        author: userResult.user!.realName || userResult.user!.nickname || '관리자',
        createdAt: result.notification.createdAt,
        updatedAt: result.notification.updatedAt,
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