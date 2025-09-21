import { getLecturesWithPagination, createLecture } from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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

    const lectures = await getLecturesWithPagination(params);

    return NextResponse.json(
      createApiResponse("success", "강의영상 목록 조회 성공", { lectures })
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

    const { title, instructor, category, youtubeUrl, description, thumbnail } = body;

    if (!title || !instructor || !category) {
      return NextResponse.json(
        createErrorResponse("제목, 강사명, 카테고리는 필수 필드입니다"),
        { status: 400 }
      );
    }

    const lectureData = {
      title,
      description: description || "강의 설명이 입력되지 않았습니다.",
      videoUrl: youtubeUrl,
      category,
      thumbnail,
      tags: [], // 현재는 빈 배열로 설정
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
