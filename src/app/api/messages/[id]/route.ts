import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const notification = await prisma.notification.findUnique({
        where: { id },
        include: {
          sender: {
            select: { id: true, nickname: true, userType: true, profileImage: true }
          }
        }
      });

      if (!notification) {
        return Response.json({ error: "Notification not found" }, { status: 404 });
      }

      if (notification.recipientId !== payload.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      // 읽음 처리
      if (!notification.isRead) {
        await prisma.notification.update({
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
        sender: notification.sender,
        notificationType: notification.type,
        category: getNotificationCategory(notification.type)
      };
    } else if (type === "inquiry") {
      // 문의 조회
      const inquiry = await prisma.contactInquiry.findUnique({
        where: { id },
        include: {
          sender: {
            select: { id: true, nickname: true, userType: true, profileImage: true }
          },
          job: {
            select: { 
              id: true, 
              title: true,
              hospital: {
                select: { hospitalName: true }
              }
            }
          },
          resume: {
            select: { id: true, title: true }
          }
        }
      });

      if (!inquiry) {
        return Response.json({ error: "Inquiry not found" }, { status: 404 });
      }

      if (inquiry.recipientId !== payload.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      // 읽음 처리
      if (!inquiry.isRead) {
        await prisma.contactInquiry.update({
          where: { id },
          data: { isRead: true }
        });
      }

      messageData = {
        id: inquiry.id,
        type: "inquiry",
        title: `${inquiry.sender?.nickname || "사용자"}님으로부터 문의: ${inquiry.subject}`,
        content: inquiry.message,
        createdAt: inquiry.createdAt,
        isRead: true, // 조회 시 읽음 처리됨
        senderId: inquiry.senderId,
        sender: inquiry.sender,
        subject: inquiry.subject,
        job: inquiry.job ? {
          id: inquiry.job.id,
          title: inquiry.job.title,
          hospitalName: inquiry.job.hospital?.hospitalName || null
        } : null,
        resume: inquiry.resume,
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