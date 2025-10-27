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

    // 북마크된 이력서만 조회하는 경우
    const bookmarked = searchParams.get("bookmarked") === "true";

    let resumesResult;
    
    if (bookmarked && userId) {
      // 사용자가 좋아요한 이력서 ID들을 먼저 조회
      const userLikedResumes = await (prisma as any).resume_likes.findMany({
        where: { userId },
        select: { resumeId: true }
      });
      
      const likedResumeIds = userLikedResumes.map((like: any) => like.resumeId);
      
      if (likedResumeIds.length === 0) {
        // 좋아요한 이력서가 없는 경우
        resumesResult = {
          data: [],
          total: 0,
          page: params.page,
          limit: params.limit,
          totalPages: 0
        };
      } else {
        // 좋아요한 이력서들만 조회
        const offset = ((params.page || 1) - 1) * (params.limit || 10);
        
        // DetailedResume 모델 기준으로 직접 쿼리
        let orderBy: any = {};
        switch (params.sort) {
          case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
          case 'popular':
            orderBy = { users: { veterinarian_profiles: { viewCount: 'desc' } } };
            break;
          default:
            orderBy = { createdAt: 'desc' };
        }
        
        const total = await (prisma as any).detailed_resumes.count({ 
          where: { 
            id: { in: likedResumeIds },
            users: { deletedAt: null, userType: 'VETERINARIAN' }
          } 
        });
        
        const resumes = await (prisma as any).detailed_resumes.findMany({
          where: { 
            id: { in: likedResumeIds },
            users: { deletedAt: null, userType: 'VETERINARIAN' }
          },
          orderBy,
          skip: offset,
          take: params.limit,
          include: {
            users: {
              include: {
                veterinarians: true,
                veterinary_students: true,
                veterinarian_profiles: true
              }
            }
          }
        });
        
        // getResumesWithPagination과 동일한 형태로 데이터 변환
        const resumeData = resumes.map((resume: any) => ({
          id: resume.id, // Resume ID를 반환 (상세 페이지 URL용)
          userId: resume.users.id, // User ID도 포함 (좋아요 체크용)
          name: resume.users.veterinarians?.realName || resume.users.veterinary_students?.realName || '익명',
          profileImage: resume.photo || null, // 이력서 사진만 사용
          experience: resume.users.veterinarian_profiles?.experienceType || '신규',
          preferredLocation: resume.users.veterinarian_profiles?.preferredLocation || '전국',
          keywords: [resume.users.veterinarian_profiles?.specialty || '일반진료'],
          lastAccessDate: resume.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          lastLoginAt: resume.users.lastLoginAt, // 최근 로그인 정보 추가
          isNew: false,
          isBookmarked: true, // 북마크된 항목이므로 true
          viewCount: resume.users.veterinarian_profiles?.viewCount || 0,
          workTypes: resume.workTypes || [], // 근무형태 정보 추가
          expectedSalary: resume.expectedSalary || null, // 희망 급여 정보 추가
          startDate: resume.startDate || null, // 입사 가능일 정보 추가
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt
        }));
        
        resumesResult = {
          data: resumeData,
          total,
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(total / (params.limit || 20))
        };
      }
    } else {
      // 일반 이력서 목록 조회
      resumesResult = await getResumesWithPagination(params);
    }
    
    // 좋아요 정보 조회 (로그인한 경우에만)
    let userLikes: string[] = [];
    console.log("[Resumes API] 사용자 ID:", userId);
    console.log("[Resumes API] resumesResult.data 개수:", resumesResult.data?.length);
    
    if (userId && resumesResult.data) {
      if (!bookmarked) {
        // 일반 조회의 경우 getResumesWithPagination에서 반환한 ID는 이미 detailed_resume의 ID
        const resumeIds = resumesResult.data.map((resume: any) => resume.id).filter(Boolean);
        console.log("[Resumes API] 조회할 resume IDs:", resumeIds);
        
        if (resumeIds.length > 0) {
          const likes = await (prisma as any).resume_likes.findMany({
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
      } else {
        // 북마크 조회의 경우 이미 resumeId로 조회했으므로 다시 매핑 필요
        const userIds = resumesResult.data.map((resume: any) => resume.userId).filter(Boolean);
        console.log("[Resumes API] 북마크 조회 - user IDs:", userIds);
        userLikes = userIds; // 북마크된 항목들은 모두 좋아요 상태
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

    // bookmarked 요청인 경우 다른 형태로 반환
    if (bookmarked) {
      return NextResponse.json(
        createApiResponse("success", "북마크한 이력서 목록 조회 성공", {
          data: resumesWithLikes.data || [],
          total: resumesWithLikes.total || 0,
          totalPages: resumesWithLikes.totalPages || 0,
          page: resumesWithLikes.page || params.page,
          limit: resumesWithLikes.limit || params.limit
        })
      );
    }

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
