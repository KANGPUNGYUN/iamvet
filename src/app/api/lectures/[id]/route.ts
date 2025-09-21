import {
  getLectureById,
  getLectureComments,
  getRecommendedLectures,
  incrementLectureViewCount,
} from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

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

    // 추천 강의 (medicalField가 없으므로 category로 대체)
    const rawRecommendedLectures = await getRecommendedLectures(
      lectureId,
      lecture.category,
      5
    );
    
    // 추천 강의도 프론트엔드 형태로 매핑
    const recommendedLectures = rawRecommendedLectures.map((rec: any) => ({
      id: rec.id,
      title: rec.title,
      uploadDate: rec.createdAt,
      viewCount: rec.viewCount || 0,
      thumbnailUrl: rec.thumbnail,
      category: rec.category,
      isLiked: false // TODO: 좋아요 기능 구현 시 추가
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
