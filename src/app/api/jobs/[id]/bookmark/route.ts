import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { 
  createJobBookmark, 
  removeJobBookmark, 
  checkJobBookmarkExists,
  getJobById 
} from "@/lib/database";

interface RouteContext {
  params: {
    id: string;
  };
}

export const POST = withAuth(async (request: NextRequest, { params }: RouteContext) => {
  try {
    const user = (request as any).user;
    const jobId = params.id;

    // 채용공고 존재 확인
    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        createErrorResponse("채용공고를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 이미 북마크한 경우 확인
    const exists = await checkJobBookmarkExists(user.userId, jobId);
    if (exists) {
      return NextResponse.json(
        createErrorResponse("이미 북마크한 채용공고입니다"),
        { status: 409 }
      );
    }

    // 북마크 생성
    await createJobBookmark(user.userId, jobId);

    return NextResponse.json(
      createApiResponse("success", "북마크가 추가되었습니다")
    );
  } catch (error) {
    console.error("Job bookmark create error:", error);
    return NextResponse.json(
      createErrorResponse("북마크 추가 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request: NextRequest, { params }: RouteContext) => {
  try {
    const user = (request as any).user;
    const jobId = params.id;

    // 북마크 존재 확인
    const exists = await checkJobBookmarkExists(user.userId, jobId);
    if (!exists) {
      return NextResponse.json(
        createErrorResponse("북마크가 존재하지 않습니다"),
        { status: 404 }
      );
    }

    // 북마크 삭제
    await removeJobBookmark(user.userId, jobId);

    return NextResponse.json(
      createApiResponse("success", "북마크가 제거되었습니다")
    );
  } catch (error) {
    console.error("Job bookmark delete error:", error);
    return NextResponse.json(
      createErrorResponse("북마크 제거 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});