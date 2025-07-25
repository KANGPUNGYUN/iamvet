import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  createHospitalEvaluation,
  getHospitalEvaluations,
} from "@/lib/database";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const hospitalId = params.id;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const evaluations = await getHospitalEvaluations(hospitalId, {
      page,
      limit,
    });

    return NextResponse.json(
      createApiResponse("success", "병원 평가 목록 조회 성공", evaluations)
    );
  } catch (error) {
    console.error("Hospital evaluations error:", error);
    return NextResponse.json(
      createErrorResponse("병원 평가 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const POST = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const params = await context.params;
      const hospitalId = params.id;
      const evaluationData = await request.json();

      // Only veterinarians can evaluate hospitals
      if (user.userType !== "veterinarian") {
        return NextResponse.json(
          createErrorResponse("수의사만 병원을 평가할 수 있습니다"),
          { status: 403 }
        );
      }

      // Create hospital evaluation
      const evaluation = await createHospitalEvaluation({
        ...evaluationData,
        hospitalId,
        evaluatorId: user.userId,
      });

      return NextResponse.json(
        createApiResponse("success", "병원 평가가 등록되었습니다", evaluation)
      );
    } catch (error) {
      console.error("Hospital evaluation create error:", error);
      return NextResponse.json(
        createErrorResponse("병원 평가 등록 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
