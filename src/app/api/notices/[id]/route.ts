import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";

export async function GET(
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

    const { id } = await params;
    const user = userResult.user;

    // 해당 사용자의 특정 공지사항 조회
    const notification = await prisma.notifications.findFirst({
      where: {
        id: id,
        recipientId: user.id,
      },
      include: {
        users_notifications_senderIdTousers: {
          include: {
            veterinarians: {
              select: {
                realName: true,
                nickname: true,
              },
            },
            veterinary_students: {
              select: {
                realName: true,
                nickname: true,
              },
            },
            hospitals: {
              select: {
                representativeName: true,
                hospitalName: true,
              },
            },
          },
        },
        announcements: true,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { success: false, error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    
    // content에서 이미지 정보 파싱 (JSON 형태로 저장된 경우)
    let parsedContent = notification.content;
    let images: string[] = [];
    
    try {
      const contentData = JSON.parse(notification.content);
      if (contentData.text && contentData.images) {
        parsedContent = contentData.text;
        images = contentData.images;
      }
    } catch (e) {
      // JSON이 아닌 경우 원본 content 사용
      parsedContent = notification.content;
    }

    // announcement에서 이미지가 있으면 그것도 포함
    if (notification.announcements?.images) {
      images = [...images, ...notification.announcements.images];
    }

    // 빈 이미지 필터링 및 중복 제거
    images = Array.from(new Set(images.filter(img => img && img.trim() !== '')));

    return NextResponse.json({
      success: true,
      data: {
        ...notification,
        content: parsedContent,
        announcements: notification.announcements ? {
          ...notification.announcements,
          images: images
        } : {
          priority: 'NORMAL',
          targetUserTypes: [],
          expiresAt: null,
          images: images
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch announcement detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcement detail" },
      { status: 500 }
    );
  }
}
