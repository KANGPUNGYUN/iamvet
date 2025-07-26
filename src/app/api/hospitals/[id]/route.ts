import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getHospitalById,
  updateHospitalProfile,
  getHospitalJobPostings,
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

    // 병원 정보 조회
    const hospital = await getHospitalById(hospitalId);
    if (!hospital) {
      return NextResponse.json(createErrorResponse("병원을 찾을 수 없습니다"), {
        status: 404,
      });
    }

    // 병원의 채용공고 조회
    const jobPostings = await getHospitalJobPostings(hospitalId);

    const hospitalDetail = {
      ...hospital,
      jobPostings: jobPostings.slice(0, 10), // 최대 10개로 제한
      jobCount: jobPostings.length,
    };

    return NextResponse.json(
      createApiResponse("success", "병원 정보 조회 성공", hospitalDetail)
    );
  } catch (error) {
    console.error("Hospital detail error:", error);
    return NextResponse.json(
      createErrorResponse("병원 정보 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const PUT = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const params = await context.params;
      const hospitalId = params.id;
      const updateData = await request.json();

      if (user.userType !== "hospital") {
        return NextResponse.json(
          createErrorResponse("병원만 병원 정보를 수정할 수 있습니다"),
          { status: 403 }
        );
      }

      // 병원 존재 및 권한 확인
      const hospital = await getHospitalById(hospitalId);
      if (!hospital) {
        return NextResponse.json(
          createErrorResponse("병원을 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      if (hospital.userId !== user.userId) {
        return NextResponse.json(
          createErrorResponse("이 병원 정보를 수정할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 병원 정보 수정
      const updatedHospital = await updateHospitalProfile(
        hospitalId,
        updateData
      );

      return NextResponse.json(
        createApiResponse(
          "success",
          "병원 정보가 수정되었습니다",
          updatedHospital
        )
      );
    } catch (error) {
      console.error("Hospital update error:", error);
      return NextResponse.json(
        createErrorResponse("병원 정보 수정 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
