import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getVeterinarianApplications } from "@/lib/database";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "latest";

    const applications = await getVeterinarianApplications(user.userId, sort);

    return NextResponse.json(
      createApiResponse("success", "지원내역 조회 성공", { applications })
    );
  } catch (error) {
    console.error("Applications error:", error);
    return NextResponse.json(
      createErrorResponse("지원내역 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
