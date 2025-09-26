import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const notificationId = resolvedParams.id;
    const user = userResult.user;

    // 해당 공지사항이 현재 사용자의 것인지 확인
    const notification = await prisma.notifications.findFirst({
      where: {
        id: notificationId,
        recipientId: user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { success: false, error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 읽은 경우
    if (notification.isRead) {
      return NextResponse.json({
        success: true,
        message: "이미 읽은 공지사항입니다.",
        data: notification,
      });
    }

    // 읽음 처리
    const updatedNotification = await prisma.notifications.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "공지사항을 읽음 처리했습니다.",
      data: updatedNotification,
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return NextResponse.json(
      { success: false, error: "읽음 처리에 실패했습니다." },
      { status: 500 }
    );
  }
}