import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { getCurrentUser } from "@/actions/auth";

export async function GET(req: NextRequest) {
  try {
    // 인증 확인
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const user = userResult.user;

    // 해당 사용자의 공지사항 타입 알림만 조회
    const announcements = await prisma.notification.findMany({
      where: {
        type: NotificationType.ANNOUNCEMENT,
        recipientId: user.id,
      },
      include: {
        sender: {
          select: {
            nickname: true,
            realName: true,
          },
        },
        announcement: {
          select: {
            priority: true,
            targetUserTypes: true,
            expiresAt: true,
          },
        },
      },
      orderBy: [
        { isRead: "asc" }, // 읽지 않은 것 먼저
        { createdAt: "desc" }, // 최신순
      ],
    });

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// 임시 공지사항 생성
export async function POST(req: NextRequest) {
  try {
    // 관리자 계정 찾기 (임시로 첫 번째 사용자 사용)
    const adminUser = await prisma.user.findFirst();
    
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "No admin user found" },
        { status: 404 }
      );
    }

    // 임시 공지사항 데이터
    const announcements = [
      {
        title: "[시스템 점검 안내] 2025년 1월 15일 서비스 점검 예정",
        content: "더 나은 서비스 제공을 위해 시스템 점검을 진행합니다. 점검 시간 동안 서비스 이용이 제한될 수 있습니다. 양해 부탁드립니다.\n\n점검 시간: 2025년 1월 15일 오전 2시 ~ 4시 (약 2시간)",
        priority: "HIGH" as const,
      },
      {
        title: "[신규 기능 안내] 채용공고 알림 기능이 추가되었습니다",
        content: "이제 관심있는 병원의 채용공고가 올라오면 실시간으로 알림을 받아볼 수 있습니다. 마이페이지에서 알림 설정을 확인해주세요.",
        priority: "NORMAL" as const,
      },
      {
        title: "[이벤트] 신규 가입 수의사 대상 프리미엄 서비스 1개월 무료",
        content: "IAMVET 서비스에 새롭게 가입하신 수의사 회원님들께 프리미엄 서비스를 1개월간 무료로 제공합니다. 지금 바로 프리미엄 기능을 체험해보세요!",
        priority: "LOW" as const,
      },
    ];

    // 모든 사용자 조회
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        userType: true,
      },
    });

    // 공지사항 생성
    const createdAnnouncements = [];
    for (const announcement of announcements) {
      // 각 사용자에게 알림 생성
      for (const user of allUsers) {
        const notification = await prisma.notification.create({
          data: {
            type: NotificationType.ANNOUNCEMENT,
            recipientId: user.id,
            recipientType: user.userType,
            senderId: adminUser.id,
            title: announcement.title,
            content: announcement.content,
            announcement: {
              create: {
                targetUserTypes: ["VETERINARIAN", "HOSPITAL", "VETERINARY_STUDENT"],
                priority: announcement.priority,
                createdBy: adminUser.id,
              },
            },
          },
          include: {
            announcement: true,
          },
        });
        createdAnnouncements.push(notification);
      }
    }

    return NextResponse.json({
      success: true,
      data: createdAnnouncements,
      message: `Created ${createdAnnouncements.length} announcements`,
    });
  } catch (error) {
    console.error("Failed to create announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create announcements" },
      { status: 500 }
    );
  }
}