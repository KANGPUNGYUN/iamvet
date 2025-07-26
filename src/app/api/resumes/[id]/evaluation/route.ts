import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { createResumeEvaluation, getResumeEvaluations } from "@/lib/database";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const resumeId = params.id;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const evaluations = await getResumeEvaluations(resumeId);

    return NextResponse.json(
      createApiResponse("success", "인재 평가 목록 조회 성공", evaluations)
    );
  } catch (error) {
    console.error("Resume evaluations error:", error);
    return NextResponse.json(
      createErrorResponse("인재 평가 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const POST = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const params = await context.params;
      const resumeId = params.id;
      const evaluationData = await request.json();

      // Only hospitals can evaluate veterinarians
      if (user.userType !== "hospital") {
        return NextResponse.json(
          createErrorResponse("병원만 수의사를 평가할 수 있습니다"),
          { status: 403 }
        );
      }

      // Create resume evaluation
      const evaluation = await createResumeEvaluation({
        ...evaluationData,
        resumeId,
        evaluatorId: user.userId,
      });

      return NextResponse.json(
        createApiResponse("success", "인재 평가가 등록되었습니다", evaluation)
      );
    } catch (error) {
      console.error("Resume evaluation create error:", error);
      return NextResponse.json(
        createErrorResponse("인재 평가 등록 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
