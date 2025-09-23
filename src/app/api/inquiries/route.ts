import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

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
    const {
      subject,
      message,
      recipientId,
      jobId,
      resumeId,
      type
    } = body;

    if (!subject || !message || !recipientId) {
      return Response.json(
        { error: "Subject, message, and recipient ID are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        senderId: payload.userId,
        recipientId: recipientId,
        subject,
        message,
        jobId: jobId || null,
        resumeId: resumeId || null,
        type: type || "general",
        isRead: false
      }
    });

    const [senderProfile, recipientProfile] = await Promise.all([
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { nickname: true, userType: true }
      }),
      prisma.user.findUnique({
        where: { id: recipientId },
        select: { userType: true }
      })
    ]);

    const notificationTitle = `${senderProfile?.nickname || "사용자"}님으로부터 문의가 도착했습니다`;
    const notificationUrl = type === "job" 
      ? `/dashboard/messages?inquiry=${inquiry.id}`
      : `/dashboard/messages?inquiry=${inquiry.id}`;

    await prisma.notification.create({
      data: {
        type: "INQUIRY",
        recipientId: recipientId,
        recipientType: recipientProfile?.userType || "HOSPITAL",
        senderId: payload.userId,
        title: notificationTitle,
        content: `${subject}\n\n${message}`,
        isRead: false
      }
    });

    return Response.json({ 
      success: true,
      inquiry 
    });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
      OR: [
        { senderId: payload.userId },
        { recipientId: payload.userId }
      ]
    };

    if (type === "sent") {
      whereCondition = { senderId: payload.userId };
    } else if (type === "received") {
      whereCondition = { recipientId: payload.userId };
    }

    const inquiries = await prisma.contactInquiry.findMany({
      where: whereCondition,
      include: {
        sender: {
          select: { id: true, nickname: true, email: true, userType: true }
        },
        recipient: {
          select: { id: true, nickname: true, email: true, userType: true }
        },
        job: {
          select: { id: true, title: true, hospitalName: true }
        },
        resume: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return Response.json({ inquiries });
  } catch (error) {
    console.error("Error in GET inquiries:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}