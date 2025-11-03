import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { getCurrentUser } from "@/actions/auth";
import { nanoid } from "nanoid";

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
    const announcements = await prisma.notifications.findMany({
      where: {
        type: NotificationType.ANNOUNCEMENT,
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
        announcements: {
          select: {
            priority: true,
            targetUserTypes: true,
            expiresAt: true,
            images: true,
          },
        },
      },
      orderBy: [
        { isRead: "asc" }, // 읽지 않은 것 먼저
        { createdAt: "desc" }, // 최신순
      ],
    });

    // content에서 이미지 정보 파싱하고 데이터 변환
    const transformedAnnouncements = announcements.map((announcement) => {
      // 디버깅: 원본 데이터 로그
      console.log(`Processing announcement ${announcement.id}:`, {
        hasAnnouncements: !!announcement.announcements,
        announcementImages: announcement.announcements?.images || 'no announcements',
        contentPreview: announcement.content.substring(0, 100)
      });

      // content에서 이미지 정보 파싱 (JSON 형태로 저장된 경우)
      let parsedContent = announcement.content;
      let notificationImages: string[] = [];
      
      try {
        const contentData = JSON.parse(announcement.content);
        if (contentData.text && contentData.images) {
          parsedContent = contentData.text;
          notificationImages = contentData.images;
          console.log(`Found ${notificationImages.length} images in notification content for ${announcement.id}`);
        }
      } catch (e) {
        // JSON이 아닌 경우 원본 content 사용
        parsedContent = announcement.content;
      }

      // announcement 이미지와 notification에서 파싱한 이미지 합치기
      const allImages = [
        ...(announcement.announcements?.images || []),
        ...notificationImages
      ].filter(img => img && img.trim() !== '');

      // 중복 제거
      const uniqueImages = Array.from(new Set(allImages));

      const result = {
        ...announcement,
        content: parsedContent,
        announcements: announcement.announcements ? {
          ...announcement.announcements,
          images: uniqueImages
        } : null,
      };

      // 디버깅용 로그
      if (uniqueImages.length > 0) {
        console.log(`Announcement ${announcement.id} has ${uniqueImages.length} images:`, uniqueImages);
      }

      return result;
    });

    // 중복 제거: 같은 제목과 내용을 가진 공지사항 중 최신 것만 유지
    const uniqueAnnouncements = transformedAnnouncements.reduce((acc: any[], current) => {
      const duplicate = acc.find(
        item => item.title === current.title && item.content === current.content
      );
      if (!duplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    // 데이터가 없는 경우 빈 배열 반환
    return NextResponse.json({
      success: true,
      data: uniqueAnnouncements || [],
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
    const adminUser = await prisma.users.findFirst();
    
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
    const allUsers = await prisma.users.findMany({
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
        const notificationId = nanoid();
        const announcementId = nanoid();
        
        // 먼저 notification 생성  
        const notification = await prisma.notifications.create({
          data: {
            id: notificationId,
            type: NotificationType.ANNOUNCEMENT,
            recipientId: user.id,
            recipientType: user.userType,
            senderId: adminUser.id,
            title: announcement.title,
            content: announcement.content,
            updatedAt: new Date(),
          },
        });

        // 그 다음 announcement 생성
        const announcementRecord = await prisma.announcements.create({
          data: {
            id: announcementId,
            notificationId: notificationId,
            targetUserTypes: ["VETERINARIAN", "HOSPITAL", "VETERINARY_STUDENT"],
            priority: announcement.priority,
            createdBy: adminUser.id,
          },
        });

        createdAnnouncements.push({ notification, announcement: announcementRecord });
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