import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/admin-auth";
import { generateId } from "@/lib/utils/id";
import { AdvertisementType, AdvertisementTargetAudience } from "@prisma/client";

// API Route의 파일 크기 제한 설정
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// GET: 광고 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") as AdvertisementType | null;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;
    const now = new Date();

    // 필터 조건 구성
    const where: any = {
      deletedAt: null,
    };

    if (type && type !== "ALL") {
      where.type = type;
    }

    if (status) {
      switch (status) {
        case "ACTIVE":
          where.isActive = true;
          where.startDate = { lte: now };
          where.endDate = { gte: now };
          break;
        case "INACTIVE":
          where.isActive = false;
          break;
        case "EXPIRED":
          where.endDate = { lt: now };
          break;
        case "SCHEDULED":
          where.startDate = { gt: now };
          break;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // 데이터 조회
    const [advertisements, total] = await Promise.all([
      prisma.advertisements.findMany({
        where,
        include: {
          admin_users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.advertisements.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: advertisements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch advertisements:", error);
    return NextResponse.json(
      { success: false, message: "광고 목록 조회 실패" },
      { status: 500 }
    );
  }
}

// POST: 새 광고 생성
export async function POST(req: NextRequest) {
  try {
    console.log("[POST /api/advertisements] 관리자 인증 시작");
    console.log("[POST /api/advertisements] 쿠키:", req.cookies.get("admin-token")?.value ? "존재함" : "없음");
    
    const admin = await authenticateAdmin(req);
    console.log("[POST /api/advertisements] 인증 결과:", admin ? `성공 (${admin.email})` : "실패");
    
    if (!admin) {
      console.log("[POST /api/advertisements] 관리자 권한 없음");
      return NextResponse.json(
        { success: false, message: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      type,
      imageUrl,
      linkUrl,
      startDate,
      endDate,
      targetAudience,
      buttonText,
      variant,
      isActive = true,
    } = body;

    // 필수 필드 검증
    if (!title || !description || !type || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "필수 정보를 모두 입력해주세요" },
        { status: 400 }
      );
    }

    // 날짜 유효성 검증
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json(
        { success: false, message: "종료일은 시작일 이후여야 합니다" },
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisements.create({
      data: {
        id: generateId("ad"),
        title,
        description,
        type,
        imageUrl,
        linkUrl,
        isActive,
        startDate: start,
        endDate: end,
        targetAudience: targetAudience || "ALL",
        buttonText,
        variant,
        createdBy: admin.id,
        updatedAt: new Date(),
      },
      include: {
        admin_users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    console.error("Failed to create advertisement:", error);
    return NextResponse.json(
      { success: false, message: "광고 생성 실패" },
      { status: 500 }
    );
  }
}