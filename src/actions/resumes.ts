"use server";

import { getResumesWithPagination } from "@/lib/database";
import { sql } from "@/lib/db";

export async function getResumesAction(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  try {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 5,
      sort: params?.sort || "latest",
    };

    console.log("[getResumesAction] 요청 파라미터:", queryParams);

    // 데이터베이스에서 직접 조회
    const result = await getResumesWithPagination(queryParams);
    console.log("[getResumesAction] DB 조회 결과:", result);
    
    // 데이터 구조를 프론트엔드가 기대하는 형태로 변환
    return {
      data: result.data || [],
      total: result.total || 0,
      currentPage: result.currentPage || 1,
      totalPages: result.totalPages || 1
    };
  } catch (error) {
    console.error("[getResumesAction] 에러 발생:", error);
    return { data: [], total: 0, currentPage: 1, totalPages: 1 };
  }
}

export async function getResumeByIdAction(id: string) {
  try {
    console.log("[getResumeByIdAction] 이력서 ID:", id);

    // detailed_resumes 테이블에서 해당 ID의 이력서 조회
    const result = await sql`
      SELECT 
        dr.id,
        dr."userId",
        dr.name,
        dr.photo,
        dr.introduction,
        dr."selfIntroduction",
        dr.position,
        dr.specialties,
        dr."preferredRegions",
        dr."expectedSalary",
        dr."workTypes",
        dr."startDate",
        dr."preferredWeekdays",
        dr."weekdaysNegotiable",
        dr."workStartTime",
        dr."workEndTime",
        dr."workTimeNegotiable",
        dr.phone,
        dr.email,
        dr."phonePublic",
        dr."emailPublic",
        dr."birthDate",
        dr."createdAt",
        dr."updatedAt"
      FROM detailed_resumes dr
      WHERE dr.id = ${id}
    `;
    console.log("[getResumeByIdAction] 조회 결과:", result.length);
    
    if (result.length === 0) {
      return null;
    }

    const resumeData = result[0];
    console.log("[getResumeByIdAction] 이력서 데이터:", resumeData);

    return resumeData;
  } catch (error) {
    console.error("[getResumeByIdAction] 에러 발생:", error);
    return null;
  }
}

export async function deleteResumeAction(id: string) {
  try {
    console.log("[deleteResumeAction] 이력서 삭제 ID:", id);

    // detailed_resumes 테이블에서 해당 ID의 이력서 삭제
    const result = await sql`
      DELETE FROM detailed_resumes
      WHERE id = ${id}
    `;
    
    console.log("[deleteResumeAction] 삭제 결과:", result);
    
    return {
      success: true,
      message: "이력서가 성공적으로 삭제되었습니다."
    };
  } catch (error) {
    console.error("[deleteResumeAction] 에러 발생:", error);
    return {
      success: false,
      message: "이력서 삭제 중 오류가 발생했습니다."
    };
  }
}