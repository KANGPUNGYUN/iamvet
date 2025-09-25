import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const inquiry = await (prisma as any).contactInquiry.findUnique({
      where: { id },
      include: {
        users_contact_inquiries_sender_idTousers: {
          select: { id: true, nickname: true, email: true, userType: true }
        },
        users_contact_inquiries_recipient_idTousers: {
          select: { id: true, nickname: true, email: true, userType: true }
        },
        jobs: {
          select: { 
            id: true, 
            title: true,
            users: {
              select: { hospitalName: true }
            }
          }
        },
        resumes: {
          select: { id: true, title: true }
        }
      }
    });

    if (!inquiry) {
      return Response.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    if (inquiry.sender_id !== payload.userId && inquiry.recipient_id !== payload.userId) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return Response.json({ inquiry });
  } catch (error) {
    console.error("Error in GET inquiry:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    const { action } = body;

    if (action === "mark_read") {
      const inquiry = await (prisma as any).contactInquiry.findUnique({
        where: { id },
        select: { recipient_id: true }
      });

      if (!inquiry) {
        return Response.json(
          { error: "Inquiry not found" },
          { status: 404 }
        );
      }

      if (inquiry.recipient_id !== payload.userId) {
        return Response.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      await (prisma as any).contactInquiry.update({
        where: { id },
        data: { is_read: true }
      });

      return Response.json({ success: true });
    }

    return Response.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in PUT inquiry:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}