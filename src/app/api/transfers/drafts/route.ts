import { NextResponse, NextRequest } from "next/server";
import { getDraftTransfersByUserId } from "@/lib/database";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 사용자 정보 확인 - Bearer token과 쿠키 인증 모두 지원
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

    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const drafts = await getDraftTransfersByUserId(userId);

    return NextResponse.json({
      success: true,
      drafts,
      total: drafts.length,
    });
  } catch (error) {
    console.error("임시저장 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "임시저장 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}