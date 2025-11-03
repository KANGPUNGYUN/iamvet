import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 토큰에서 사용자 정보 가져오기
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // "notification" or "inquiry"

    let messageData = null;

    if (type === "notification") {
      // 알림 조회
      const notification = await (prisma as any).notifications.findUnique({
        where: { id },
        include: {
          users_notifications_senderIdTousers: {
            select: { id: true, userType: true, profileImage: true }
          },
          announcements: {
            select: { images: true }
          }
        }
      });

      if (!notification) {
        return Response.json({ error: "Notification not found" }, { status: 404 });
      }

      if (notification.recipientId !== payload.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      // INQUIRY 타입 알림의 경우 연결된 문의 찾기
      let relatedInquiry = null;
      if (notification.type === "INQUIRY" && notification.senderId) {
        relatedInquiry = await (prisma as any).contact_inquiries.findFirst({
          where: {
            sender_id: notification.senderId,
            recipient_id: notification.recipientId,
            subject: notification.content // 알림 content가 문의 subject와 같다고 가정
          },
          include: {
            jobs: {
              select: { id: true, title: true }
            },
            resumes: {
              select: { id: true, title: true }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        });
      }

      // 읽음 처리
      if (!notification.isRead) {
        await (prisma as any).notifications.update({
          where: { id },
          data: { 
            isRead: true,
            readAt: new Date()
          }
        });
      }

      messageData = {
        id: notification.id,
        type: "notification",
        title: notification.title,
        content: notification.content,
        createdAt: notification.createdAt,
        isRead: true, // 조회 시 읽음 처리됨
        senderId: notification.senderId,
        sender: notification.users_notifications_senderIdTousers ? {
          id: notification.users_notifications_senderIdTousers.id,
          nickname: null, // nickname은 users 테이블에 없으므로 별도로 가져와야 함
          userType: notification.users_notifications_senderIdTousers.userType,
          profileImage: notification.users_notifications_senderIdTousers.profileImage
        } : null,
        notificationType: notification.type,
        category: getNotificationCategory(notification.type),
        images: notification.announcements?.images || [],
        // INQUIRY 타입인 경우 관련 문의 정보 포함
        ...(relatedInquiry && {
          subject: relatedInquiry.subject,
          job: relatedInquiry.jobs ? {
            id: relatedInquiry.jobs.id,
            title: relatedInquiry.jobs.title,
            hospitalName: null
          } : null,
          resume: relatedInquiry.resumes,
          inquiryType: relatedInquiry.type
        })
      };
    } else if (type === "inquiry") {
      // 문의 조회
      const inquiry = await (prisma as any).contact_inquiries.findUnique({
        where: { id },
        include: {
          users_contact_inquiries_sender_idTousers: {
            select: { id: true, userType: true, profileImage: true }
          },
          jobs: {
            select: { 
              id: true, 
              title: true
            }
          },
          resumes: {
            select: { id: true, title: true }
          }
        }
      });

      if (!inquiry) {
        return Response.json({ error: "Inquiry not found" }, { status: 404 });
      }

      if (inquiry.recipient_id !== payload.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      // 읽음 처리
      if (!inquiry.is_read) {
        await (prisma as any).contact_inquiries.update({
          where: { id },
          data: { is_read: true }
        });
      }

      messageData = {
        id: inquiry.id,
        type: "inquiry",
        title: `사용자님으로부터 문의: ${inquiry.subject}`,
        content: inquiry.message,
        createdAt: inquiry.created_at,
        isRead: true, // 조회 시 읽음 처리됨
        senderId: inquiry.sender_id,
        sender: inquiry.users_contact_inquiries_sender_idTousers ? {
          id: inquiry.users_contact_inquiries_sender_idTousers.id,
          nickname: null,
          userType: inquiry.users_contact_inquiries_sender_idTousers.userType,
          profileImage: inquiry.users_contact_inquiries_sender_idTousers.profileImage
        } : null,
        subject: inquiry.subject,
        job: inquiry.jobs ? {
          id: inquiry.jobs.id,
          title: inquiry.jobs.title,
          hospitalName: null
        } : null,
        resume: inquiry.resumes,
        inquiryType: inquiry.type,
        category: getInquiryCategory(inquiry.type)
      };
    } else {
      return Response.json({ error: "Type parameter is required" }, { status: 400 });
    }

    return Response.json({ message: messageData });
  } catch (error) {
    console.error("Error in GET message detail:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getNotificationCategory(type: string): string {
  switch (type) {
    case 'ANNOUNCEMENT':
      return '공지사항';
    case 'INQUIRY':
      return '문의 알림';
    case 'COMMENT':
      return '댓글 알림';
    case 'REPLY':
      return '답글 알림';
    case 'APPLICATION_STATUS':
      return '지원 결과';
    case 'APPLICATION_NEW':
      return '새 지원';
    default:
      return '일반 알림';
  }
}

function getInquiryCategory(type: string): string {
  switch (type) {
    case 'job':
      return '채용 문의';
    case 'resume':
      return '이력서 문의';
    default:
      return '일반 문의';
  }
}