// src/app/api/resumes/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { ResumesQueryParams } from "@/lib/types";
import { getResumesWithPagination } from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 사용자 정보 확인 (선택적) - 쿠키 기반 인증 사용
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
    
    // Authorization 헤더가 없으면 쿠키에서 확인 (withAuth 미들웨어와 동일한 방식)
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      console.log("[Resumes API] auth-token 쿠키:", authTokenCookie ? "존재함" : "없음");
      
      if (authTokenCookie) {
        console.log("[Resumes API] auth-token:", authTokenCookie.substring(0, 20) + "...");
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
          console.log("[Resumes API] 토큰 검증 성공, userId:", userId);
        } else {
          console.log("[Resumes API] 토큰 검증 실패");
        }
      }
    }
    
    console.log("[Resumes API] 최종 사용자 ID:", userId);

    const { searchParams } = new URL(request.url);

    const params: ResumesQueryParams = {
      keyword: searchParams.get("keyword") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sort: (searchParams.get("sort") as any) || "latest",
      workType: searchParams.get("workType") || undefined,
      experience: searchParams.get("experience") || undefined,
      region: searchParams.get("region") || undefined,
      license: searchParams.get("license") || undefined,
    };

    const resumesResult = await getResumesWithPagination(params);
    
    // 좋아요 정보 조회 (로그인한 경우에만)
    let userLikes: string[] = [];
    console.log("[Resumes API] 사용자 ID:", userId);
    console.log("[Resumes API] resumesResult.data 개수:", resumesResult.data?.length);
    
    if (userId && resumesResult.data) {
      const resumeIds = resumesResult.data.map((resume: any) => resume.id).filter(Boolean);
      console.log("[Resumes API] 조회할 resume IDs:", resumeIds);
      
      if (resumeIds.length > 0) {
        const likes = await (prisma as any).resumeLike.findMany({
          where: { 
            userId,
            resumeId: { in: resumeIds }
          },
          select: { resumeId: true }
        });
        console.log("[Resumes API] 조회된 좋아요:", likes);
        userLikes = likes.map((like: any) => like.resumeId);
        console.log("[Resumes API] 좋아요된 resume IDs:", userLikes);
      }
    }

    // 좋아요 정보를 포함한 이력서 데이터 변환
    const resumesWithLikes = resumesResult.data ? {
      ...resumesResult,
      data: resumesResult.data.map((resume: any) => ({
        ...resume,
        isLiked: userId ? userLikes.includes(resume.id) : false
      }))
    } : resumesResult;

    return NextResponse.json(
      createApiResponse("success", "인재정보 목록 조회 성공", { resumes: resumesWithLikes })
    );
  } catch (error) {
    console.error("Resumes list error:", error);
    return NextResponse.json(
      createErrorResponse("인재정보 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
