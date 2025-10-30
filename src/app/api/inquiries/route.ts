import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { generateId } from "@/lib/utils/id";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { subject, message, recipientId, jobId, resumeId, type } = body;

    if (!subject || !message || !recipientId) {
      return Response.json(
        { error: "Subject, message, and recipient ID are required" },
        { status: 400 }
      );
    }

    // Skip resume validation since we're using Resume IDs
    // The resumeId field is kept for reference but doesn't enforce FK constraint

    // Validate jobId if provided
    if (jobId) {
      const jobExists = await (prisma as any).jobs.findUnique({
        where: { id: jobId },
      });

      if (!jobExists) {
        console.error(`Job not found with ID: ${jobId}`);
        return Response.json({ error: "Job not found" }, { status: 404 });
      }
    }

    const inquiry = await (prisma as any).contact_inquiries.create({
      data: {
        id: generateId(),
        sender_id: payload.userId,
        recipient_id: recipientId,
        subject,
        message,
        job_id: jobId || null,
        resume_id: resumeId || null,
        type: type || "general",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // 알림 생성 - 수신자 정보 조회
    try {
      const recipient = await (prisma as any).users.findUnique({
        where: { id: recipientId },
        select: { userType: true }
      });

      if (recipient) {
        await (prisma as any).notifications.create({
          data: {
            id: generateId(),
            type: "INQUIRY",
            recipientId: recipientId,
            recipientType: recipient.userType,
            senderId: payload.userId,
            title: type === "reply" ? "문의 답변이 도착했습니다" : "새로운 문의가 도착했습니다",
            content: subject,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    } catch (notificationError) {
      console.error("Notification creation failed:", notificationError);
      // 알림 생성 실패는 전체 프로세스를 중단하지 않음
    }

    return Response.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const type = searchParams.get("type");

    let whereCondition: any = {
      OR: [{ senderId: payload.userId }, { recipientId: payload.userId }],
    };

    if (type === "sent") {
      whereCondition = { sender_id: payload.userId };
    } else if (type === "received") {
      whereCondition = { recipient_id: payload.userId };
    }

    const inquiries = await (prisma as any).contact_inquiries.findMany({
      where: whereCondition,
      include: {
        users_contact_inquiries_sender_idTousers: {
          select: { id: true, nickname: true, email: true, userType: true },
        },
        users_contact_inquiries_recipient_idTousers: {
          select: { id: true, nickname: true, email: true, userType: true },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            users: {
              select: { hospitalName: true },
            },
          },
        },
        resumes: {
          select: { id: true, title: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return Response.json({ inquiries });
  } catch (error) {
    console.error("Error in GET inquiries:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
