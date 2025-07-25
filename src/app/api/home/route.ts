import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getRecentJobs,
  getRecentLectures,
  getRecentResumes,
  getRecentTransfers,
  getHomepageBanners,
  getNotifications,
} from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // 병렬로 모든 데이터 조회
    const [
      recentJobs,
      recentLectures,
      recentResumes,
      recentTransfers,
      banners,
      notifications,
    ] = await Promise.all([
      getRecentJobs(8), // 최근 채용공고 8개
      getRecentLectures(6), // 최근 강의 6개
      getRecentResumes(6), // 최근 인재정보 6개
      getRecentTransfers(6), // 최근 양도양수 6개
      getHomepageBanners(), // 홈페이지 배너
      getNotifications(5), // 공지사항 5개
    ]);

    const homepageData = {
      banners,
      notifications,
      recentJobs,
      recentLectures,
      recentResumes,
      recentTransfers,
      stats: {
        totalJobs: recentJobs.length,
        totalResumes: recentResumes.length,
        totalLectures: recentLectures.length,
        totalTransfers: recentTransfers.length,
      },
    };

    return NextResponse.json(
      createApiResponse("success", "홈페이지 데이터 조회 성공", homepageData)
    );
  } catch (error) {
    console.error("Homepage data error:", error);
    return NextResponse.json(
      createErrorResponse("홈페이지 데이터 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
