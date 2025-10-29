import { getLecturesWithPagination, createLecture } from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
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
    
    // Authorization 헤더가 없으면 쿠키에서 확인 (withAuth 미들웨어와 동일한 방식)
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      console.log("[Lectures API] auth-token 쿠키:", authTokenCookie ? "존재함" : "없음");
      
      if (authTokenCookie) {
        console.log("[Lectures API] auth-token:", authTokenCookie.substring(0, 20) + "...");
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
          console.log("[Lectures API] 토큰 검증 성공, userId:", userId);
        } else {
          console.log("[Lectures API] 토큰 검증 실패");
        }
      }
    }
    
    console.log("[Lectures API] 최종 사용자 ID:", userId);

    const { searchParams } = new URL(request.url);

    const params = {
      keyword: searchParams.get("keyword") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sort: searchParams.get("sort") || "latest",
      medicalField: searchParams.get("medicalField") || undefined,
      animal: searchParams.get("animal") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
    };

    // 북마크된 강의만 조회하는 경우
    const bookmarked = searchParams.get("bookmarked") === "true";
    
    let lecturesResult;
    
    if (bookmarked && userId) {
      // 사용자가 좋아요한 강의 ID들을 먼저 조회
      const userLikedLectures = await (prisma as any).lecture_likes.findMany({
        where: { userId },
        select: { lectureId: true }
      });
      
      const likedLectureIds = userLikedLectures.map((like: any) => like.lectureId);
      
      if (likedLectureIds.length === 0) {
        // 좋아요한 강의가 없는 경우
        lecturesResult = {
          data: [],
          total: 0,
          page: params.page,
          limit: params.limit,
          totalPages: 0
        };
      } else {
        // 좋아요한 강의들만 조회
        const whereClause: any = { id: { in: likedLectureIds } };
        
        // 추가 필터 적용
        if (params.keyword) {
          whereClause.OR = [
            { title: { contains: params.keyword, mode: 'insensitive' } },
            { description: { contains: params.keyword, mode: 'insensitive' } }
          ];
        }
        if (params.medicalField) {
          // 다중 카테고리 지원 (콤마로 구분된 문자열을 배열로 변환)
          const categories = params.medicalField.split(',').map(cat => cat.trim()).filter(Boolean);
          if (categories.length === 1) {
            whereClause.category = categories[0];
          } else if (categories.length > 1) {
            whereClause.category = { in: categories };
          }
        }
        if (params.difficulty) {
          whereClause.difficulty = params.difficulty;
        }
        
        // 정렬 옵션
        let orderBy: any = {};
        switch (params.sort) {
          case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
          case 'view':
            orderBy = { viewCount: 'desc' };
            break;
          case 'rating':
            orderBy = { averageRating: 'desc' };
            break;
          default:
            orderBy = { createdAt: 'desc' };
        }
        
        const total = await (prisma as any).lectures.count({ where: whereClause });
        const lectures = await (prisma as any).lectures.findMany({
          where: whereClause,
          orderBy,
          skip: (params.page - 1) * params.limit,
          take: params.limit
        });
        
        lecturesResult = {
          data: lectures,
          total,
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(total / params.limit)
        };
      }
    } else {
      // 일반 강의 목록 조회
      lecturesResult = await getLecturesWithPagination(params);
    }
    
    // 좋아요 정보 조회 (로그인한 경우에만)
    let userLikes: string[] = [];
    console.log("[Lectures API] 사용자 ID:", userId);
    console.log("[Lectures API] lecturesResult.data 개수:", lecturesResult.data?.length);
    
    if (userId && lecturesResult.data) {
      const lectureIds = lecturesResult.data.map((lecture: any) => lecture.id).filter(Boolean);
      console.log("[Lectures API] 조회할 lecture IDs:", lectureIds);
      
      if (lectureIds.length > 0) {
        const likes = await (prisma as any).lecture_likes.findMany({
          where: { 
            userId,
            lectureId: { in: lectureIds }
          },
          select: { lectureId: true }
        });
        console.log("[Lectures API] 조회된 좋아요:", likes);
        userLikes = likes.map((like: any) => like.lectureId);
        console.log("[Lectures API] 좋아요된 lecture IDs:", userLikes);
      }
    }

    // 좋아요 정보를 포함한 강의 데이터 변환
    const lecturesWithLikes = lecturesResult.data ? {
      ...lecturesResult,
      data: lecturesResult.data.map((lecture: any) => ({
        ...lecture,
        isLiked: userId ? userLikes.includes(lecture.id) : false
      }))
    } : lecturesResult;

    return NextResponse.json(
      createApiResponse("success", "강의영상 목록 조회 성공", { lectures: lecturesWithLikes })
    );
  } catch (error) {
    console.error("Lectures list error:", error);
    return NextResponse.json(
      createErrorResponse("강의영상 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, instructor, category, youtubeUrl, description, thumbnail, referenceMaterials } = body;

    if (!title || !instructor || !category) {
      return NextResponse.json(
        createErrorResponse("제목, 강사명, 카테고리는 필수 필드입니다"),
        { status: 400 }
      );
    }

    const lectureData = {
      title,
      instructor,
      description: description || "강의 설명이 입력되지 않았습니다.",
      videoUrl: youtubeUrl,
      category,
      thumbnail,
      tags: [], // 현재는 빈 배열로 설정
      referenceMaterials: referenceMaterials || [], // 참고자료 추가
    };

    const newLecture = await createLecture(lectureData);

    return NextResponse.json(
      createApiResponse("success", "강의가 성공적으로 생성되었습니다", {
        lecture: newLecture,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Lecture creation error:", error);
    return NextResponse.json(
      createErrorResponse("강의 생성 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
