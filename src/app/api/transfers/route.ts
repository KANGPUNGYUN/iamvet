import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getTransfersWithPagination, createTransfer } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 사용자 정보 확인 (선택적) - Bearer token과 쿠키 인증 모두 지원
    let userId: string | undefined;

    // Authorization 헤더 확인
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    // Authorization 헤더가 없으면 쿠키에서 확인
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      if (authTokenCookie) {
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
        }
      }
    }

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const keyword = searchParams.get("keyword") || undefined;
    const category = searchParams.get("category") || undefined;

    // 북마크된 게시글만 조회하는 경우
    const bookmarked = searchParams.get("bookmarked") === "true";

    console.log(
      `[Transfers API] GET request - page: ${page}, limit: ${limit}, bookmarked: ${bookmarked}`
    );

    let transfers;
    let total = 0;

    if (bookmarked && userId) {
      // 사용자가 좋아요한 양도양수 ID들을 먼저 조회
      const userLikedTransfers = await (prisma as any).transfer_likes.findMany({
        where: { userId },
        select: { transferId: true },
      });

      const likedTransferIds = userLikedTransfers.map(
        (like: any) => like.transferId
      );

      if (likedTransferIds.length === 0) {
        // 좋아요한 양도양수가 없는 경우
        transfers = [];
        total = 0;
      } else {
        // 좋아요한 양도양수들만 조회
        const offset = (page - 1) * limit;
        const whereClause: any = {
          id: { in: likedTransferIds },
          deletedAt: null,
          status: { not: "DISABLED" },
        };

        // 추가 필터 적용
        if (keyword) {
          whereClause.OR = [
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
            { location: { contains: keyword, mode: "insensitive" } },
          ];
        }
        if (category) {
          const categories = category.split(",");
          whereClause.category = { in: categories };
        }

        total = await (prisma as any).transfers.count({ where: whereClause });

        const result = await (prisma as any).transfers.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          skip: offset,
          take: limit,
          include: {
            users: {
              select: {
                profileImage: true,
              },
            },
          },
        });

        transfers = result.map((transfer: any) => ({
          ...transfer,
          hospitalName: "병원", // 기본값 설정 (hospital 정보는 별도 조회 필요)
          hospitalType: "병원", // 기본값 설정
          categories: transfer.category,
        }));
      }
    } else {
      // 일반 양도양수 목록 조회
      transfers = await getTransfersWithPagination(page, limit);
      total = transfers.length; // TODO: 실제로는 전체 카운트를 가져와야 함
    }

    // 좋아요 정보 조회 (로그인한 경우에만)
    let userLikes: string[] = [];
    if (userId && transfers && transfers.length > 0) {
      const transferIds = transfers
        .map((transfer: any) => transfer.id)
        .filter(Boolean);
      if (transferIds.length > 0) {
        const likes = await (prisma as any).transfer_likes.findMany({
          where: {
            userId,
            transferId: { in: transferIds },
          },
          select: { transferId: true },
        });
        userLikes = likes.map((like: any) => like.transferId);
      }
    }

    // 좋아요 정보를 포함한 양도양수 데이터 변환
    const transfersWithLikes = transfers
      ? transfers.map((transfer: any) => ({
          ...transfer,
          isLiked: userId ? userLikes.includes(transfer.id) : false,
        }))
      : [];

    const totalPages = Math.ceil(total / limit);

    console.log(`[Transfers API] Retrieved ${transfers.length} transfers`);

    return NextResponse.json(
      createApiResponse("success", "양도양수 목록 조회 성공", {
        transfers: transfersWithLikes,
        total,
        totalPages,
        page,
        limit,
      })
    );
  } catch (error) {
    console.error("Transfers list error:", error);
    return NextResponse.json(
      createErrorResponse("양도양수 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const transferData = await request.json();

    // 양도양수 게시글 생성
    const transfer = await createTransfer({
      ...transferData,
      userId: user.userId,
    });

    return NextResponse.json(
      createApiResponse("success", "양도양수 게시글이 등록되었습니다", transfer)
    );
  } catch (error) {
    console.error("Transfer create error:", error);
    return NextResponse.json(
      createErrorResponse("양도양수 게시글 등록 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
