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

    // Skip resume validation since we're using DetailedResume IDs
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

    const inquiry = await (prisma as any).contactInquiry.create({
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
        updated_at: new Date(),
      },
    });

    // Inquiry notifications are handled through ContactInquiry table
    // No need to create separate Notification records to avoid duplication

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

    const inquiries = await (prisma as any).contactInquiry.findMany({
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
