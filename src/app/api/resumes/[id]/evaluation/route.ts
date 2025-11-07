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

      console.log("[Evaluation API] User check:", {
        userId: user.userId,
        userType: user.userType,
        isHospital: user.userType === "HOSPITAL",
      });

      // Only hospitals can evaluate veterinarians
      if (user.userType !== "HOSPITAL") {
        return NextResponse.json(
          createErrorResponse("병원만 수의사를 평가할 수 있습니다"),
          { status: 403 }
        );
      }

      // Validate evaluation data
      const { ratings, comments } = evaluationData;

      if (!ratings || !comments) {
        return NextResponse.json(
          createErrorResponse("평가 항목과 코멘트가 필요합니다"),
          { status: 400 }
        );
      }

      // Calculate overall rating as average of all ratings
      const ratingValues = Object.values(ratings) as number[];
      const overallRating =
        ratingValues.reduce((sum, rating) => sum + rating, 0) /
        ratingValues.length;

      // Create resume evaluation
      const evaluation = await createResumeEvaluation({
        resumeId,
        evaluatorId: user.userId,
        ratings,
        comments,
        overallRating: Math.round(overallRating * 2) / 2, // Round to nearest 0.5
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
