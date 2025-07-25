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
    const lectureId = params.id;
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");

    const lecture = await getLectureById(lectureId);
    if (!lecture || !lecture.isPublic) {
      return NextResponse.json(
        createErrorResponse("존재하지 않거나 비공개 강의입니다"),
        { status: 404 }
      );
    }

    // 조회수 증가
    await incrementLectureViewCount(lectureId, userIp);

    // 추천 강의
    const recommendedLectures = await getRecommendedLectures(
      lectureId,
      lecture.medicalField,
      5
    );

    // 댓글 조회
    const comments = await getLectureComments(lectureId);

    const lectureDetail = {
      ...lecture,
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
