import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
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
    const type = searchParams.get("type"); // "notifications", "inquiries", "all"
    const filter = searchParams.get("filter"); // "all", "read", "unread"
    const sort = searchParams.get("sort"); // "recent", "oldest"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const results: any[] = [];

    // 알림 조회
    if (type === "notifications" || type === "all" || !type) {
      let notificationWhere: any = {
        recipientId: payload.userId
      };

      if (filter === "read") {
        notificationWhere.isRead = true;
      } else if (filter === "unread") {
        notificationWhere.isRead = false;
      }

      const notifications = await (prisma as any).notification.findMany({
        where: notificationWhere,
        include: {
          sender: {
            select: { id: true, nickname: true, userType: true }
          }
        },
        orderBy: {
          createdAt: sort === "oldest" ? "asc" : "desc"
        }
      });

      notifications.forEach((notification: any) => {
        results.push({
          id: notification.id,
          type: "notification",
          title: notification.title,
          content: notification.content,
          createdAt: notification.createdAt,
          isRead: notification.isRead,
          senderId: notification.senderId,
          sender: notification.sender,
          notificationType: notification.type
        });
      });
    }

    // 문의 조회
    if (type === "inquiries" || type === "all" || !type) {
      let inquiryWhere: any = {
        recipientId: payload.userId
      };

      if (filter === "read") {
        inquiryWhere.isRead = true;
      } else if (filter === "unread") {
        inquiryWhere.isRead = false;
      }

      const inquiries = await (prisma as any).contactInquiry.findMany({
        where: inquiryWhere,
        include: {
          sender: {
            select: { id: true, nickname: true, userType: true }
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
        },
        orderBy: {
          createdAt: sort === "oldest" ? "asc" : "desc"
        }
      });

      inquiries.forEach((inquiry: any) => {
        results.push({
          id: inquiry.id,
          type: "inquiry",
          title: `${inquiry.sender?.nickname || "사용자"}님으로부터 문의: ${inquiry.subject}`,
          content: inquiry.message,
          createdAt: inquiry.createdAt,
          isRead: inquiry.isRead,
          senderId: inquiry.senderId,
          sender: inquiry.sender,
          subject: inquiry.subject,
          job: inquiry.job ? {
            id: inquiry.job.id,
            title: inquiry.job.title,
            hospitalName: inquiry.job.hospital?.hospitalName || null
          } : null,
          resume: inquiry.resume,
          inquiryType: inquiry.type
        });
      });
    }

    // 통합 정렬
    results.sort((a, b) => {
      // 읽지 않은 것을 먼저
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      
      // 같은 읽음 상태 내에서 날짜 정렬
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    // 페이지네이션
    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return Response.json({
      messages: paginatedResults,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error in GET messages:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}