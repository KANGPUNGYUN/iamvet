import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
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

    const body = await request.json();
    const { type } = body; // "notification" or "inquiry"

    if (type === "notification") {
      // 알림 읽음 처리
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { recipientId: true }
      });

      if (!notification) {
        return Response.json({ error: "Notification not found" }, { status: 404 });
      }

      if (notification.recipientId !== payload.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      await prisma.notification.update({
        where: { id },
        data: { 
          isRead: true,
          readAt: new Date()
        }
      });
    } else if (type === "inquiry") {
      // 문의 읽음 처리
      const inquiry = await prisma.contactInquiry.findUnique({
        where: { id },
        select: { recipientId: true }
      });

      if (!inquiry) {
        return Response.json({ error: "Inquiry not found" }, { status: 404 });
      }

      if (inquiry.recipientId !== payload.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      await prisma.contactInquiry.update({
        where: { id },
        data: { isRead: true }
      });
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error marking as read:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}