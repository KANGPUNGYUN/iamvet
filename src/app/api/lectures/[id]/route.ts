import {
  getLectureById,
  getLectureComments,
  getRecommendedLectures,
  incrementLectureViewCount,
} from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin auth function
async function verifyAdminAuth(request: NextRequest) {
  try {
    // Check for admin session from cookie
    const isAdminLoggedIn = request.cookies.get("isAdminLoggedIn")?.value === "true";
    const adminEmail = request.cookies.get("adminEmail")?.value;
    
    if (!isAdminLoggedIn || !adminEmail) {
      return { isValid: false, admin: null };
    }
    
    // Additional verification can be added here if needed
    return { isValid: true, admin: { email: adminEmail } };
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return { isValid: false, admin: null };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const lectureId = resolvedParams.id;
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

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
      console.log("[LectureDetail API] auth-token 쿠키:", authTokenCookie ? "존재함" : "없음");
      
      if (authTokenCookie) {
        console.log("[LectureDetail API] auth-token:", authTokenCookie.substring(0, 20) + "...");
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
          console.log("[LectureDetail API] 토큰 검증 성공, userId:", userId);
        } else {
          console.log("[LectureDetail API] 토큰 검증 실패");
        }
      }
    }
    
    console.log("[LectureDetail API] 최종 사용자 ID:", userId);

    const lecture = await getLectureById(lectureId);
    
    if (!lecture) {
      return NextResponse.json(
        createErrorResponse("존재하지 않거나 비공개 강의입니다"),
        { status: 404 }
      );
    }

    // 조회수 증가 (view_logs 테이블이 없으므로 일시적으로 비활성화)
    try {
      await incrementLectureViewCount(lectureId, userIp);
    } catch (error) {
      console.log("View count increment failed (table not exists):", error instanceof Error ? error.message : error);
    }

    // 좋아요 여부 확인 (로그인한 경우에만)
    let isLiked = false;
    if (userId) {
      const likeCheck = await (prisma as any).lectureLike.findUnique({
        where: {
          userId_lectureId: {
            userId: userId,
            lectureId: lectureId
          }
        }
      });
      isLiked = !!likeCheck;
    }

    // 추천 강의 (medicalField가 없으므로 category로 대체)
    const rawRecommendedLectures = await getRecommendedLectures(
      lectureId,
      lecture.category,
      5
    );
    
    // 추천 강의 좋아요 정보 조회 (로그인한 경우에만)
    let recommendedLikes: string[] = [];
    if (userId && rawRecommendedLectures.length > 0) {
      const recommendedIds = rawRecommendedLectures.map((rec: any) => rec.id);
      const likes = await (prisma as any).lectureLike.findMany({
        where: {
          userId,
          lectureId: { in: recommendedIds }
        },
        select: { lectureId: true }
      });
      recommendedLikes = likes.map((like: any) => like.lectureId);
    }
    
    // 추천 강의도 프론트엔드 형태로 매핑
    const recommendedLectures = rawRecommendedLectures.map((rec: any) => ({
      id: rec.id,
      title: rec.title,
      uploadDate: rec.createdAt,
      viewCount: rec.viewCount || 0,
      thumbnailUrl: rec.thumbnail,
      category: rec.category,
      isLiked: userId ? recommendedLikes.includes(rec.id) : false
    }));

    // 댓글 조회
    const comments = await getLectureComments(lectureId);

    // 데이터베이스 필드를 프론트엔드 형태로 매핑
    const lectureDetail = {
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      category: lecture.category,
      instructor: "강사명", // TODO: 강사 정보 추가 필요
      instructorTitle: "강사직함", // TODO: 강사 정보 추가 필요
      uploadDate: lecture.createdAt,
      viewCount: lecture.viewCount || 0,
      youtubeUrl: lecture.videoUrl,
      thumbnailUrl: lecture.thumbnail,
      medicalField: lecture.category, // category를 medicalField로 사용
      referenceFiles: [], // TODO: 참고자료 테이블 연결 필요
      recommendedLectures,
      isLiked: isLiked,
      comments: {
        totalCount: comments.length,
        comments,
      },
    };

    return NextResponse.json(
      createApiResponse("success", "강의영상 조회 성공", lectureDetail)
    );
  } catch (error) {
    console.error("Lecture detail error:", error);
    return NextResponse.json(
      createErrorResponse("강의영상 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

// 강의 수정 (어드민만)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 어드민 인증 확인
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        createErrorResponse("관리자 권한이 필요합니다"),
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const { title, description, category, videoUrl, thumbnail, tags } = body;

    // 기존 강의 확인
    const existingLecture = await (prisma as any).lectures.findUnique({
      where: { id }
    });

    if (!existingLecture) {
      return NextResponse.json(
        createErrorResponse("강의를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 강의 업데이트
    const updatedLecture = await (prisma as any).lectures.update({
      where: { id },
      data: {
        title: title || existingLecture.title,
        description: description || existingLecture.description,
        category: category || existingLecture.category,
        videoUrl: videoUrl || existingLecture.videoUrl,
        thumbnail: thumbnail || existingLecture.thumbnail,
        tags: tags || existingLecture.tags,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json(
      createApiResponse("success", "강의가 성공적으로 수정되었습니다", {
        lecture: updatedLecture
      })
    );
  } catch (error) {
    console.error("Lecture update error:", error);
    return NextResponse.json(
      createErrorResponse("강의 수정 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

// 강의 삭제 (어드민만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 어드민 인증 확인
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        createErrorResponse("관리자 권한이 필요합니다"),
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 기존 강의 확인
    const existingLecture = await (prisma as any).lectures.findUnique({
      where: { id }
    });

    if (!existingLecture) {
      return NextResponse.json(
        createErrorResponse("강의를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // Soft delete 사용
    await (prisma as any).lectures.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      createApiResponse("success", "강의가 성공적으로 삭제되었습니다", null)
    );
  } catch (error) {
    console.error("Lecture delete error:", error);
    return NextResponse.json(
      createErrorResponse("강의 삭제 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
