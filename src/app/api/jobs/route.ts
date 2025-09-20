import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getJobsWithPagination,
  createJobPosting,
  getHospitalByUserId,
  getAdvertisements,
} from "@/lib/database";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse filters from query parameters
  const parseArrayParam = (param: string | null) => {
    if (!param) return undefined;
    return param.split(',').filter(Boolean);
  };

  const params = {
    keyword: searchParams.get("keyword") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "8"),
    sort: searchParams.get("sort") || "recent",
    workType: parseArrayParam(searchParams.get("workType")),
    experience: parseArrayParam(searchParams.get("experience")),
    region: searchParams.get("region") || undefined,
    major: parseArrayParam(searchParams.get("major")),
  };

  try {

    console.log('Jobs API params:', params);

    const result = await getJobsWithPagination(params);
    console.log('Database result:', { 
      jobsCount: result.jobs.length, 
      totalCount: result.totalCount,
      firstJob: result.jobs[0] ? Object.keys(result.jobs[0]) : 'No jobs'
    });
    
    // Transform the data to match the expected format for JobInfoCard
    const transformedJobs = result.jobs.map((job: any) => ({
      id: job.id,
      hospital: job.hospital_name || '병원명 없음',
      position: job.position,
      title: job.title,
      location: job.hospital_location || '위치 정보 없음',
      workType: Array.isArray(job.workType) ? job.workType[0] : (job.workType || '정규직'),
      experience: Array.isArray(job.experience) ? job.experience[0] : (job.experience || '신입'),
      salary: job.salary || '협의',
      salaryType: job.salaryType || '월급',
      tags: [
        ...(Array.isArray(job.workType) ? job.workType : [job.workType].filter(Boolean)),
        ...(Array.isArray(job.experience) ? job.experience : [job.experience].filter(Boolean)),
        ...(Array.isArray(job.major) ? job.major.slice(0, 2) : []), // Limit to 2 major tags
      ].filter(Boolean),
      isNew: new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if created within 7 days
      isBookmarked: false, // TODO: Check user bookmarks
      dDay: job.recruitEndDate ? Math.ceil((new Date(job.recruitEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      deadline: job.recruitEndDate ? new Date(job.recruitEndDate) : null,
      createdAt: new Date(job.createdAt),
      // Additional fields for detailed view
      jobType: Array.isArray(job.workType) ? job.workType.join(', ') : (job.workType || '정규직'),
      benefits: job.benefits,
      workDays: job.workDays,
      workStartTime: job.workStartTime,
      workEndTime: job.workEndTime,
      isWorkDaysNegotiable: job.isWorkDaysNegotiable,
      isWorkTimeNegotiable: job.isWorkTimeNegotiable,
      managerName: job.managerName,
      managerPhone: job.managerPhone,
      managerEmail: job.managerEmail,
      department: job.department,
    }));

    const totalPages = Math.ceil(result.totalCount / params.limit);

    return NextResponse.json(
      createApiResponse("success", "채용공고 목록 조회 성공", {
        jobs: transformedJobs,
        totalCount: result.totalCount,
        currentPage: params.page,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Jobs list error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params
    });
    
    const errorMessage = error instanceof Error ? 
      `채용공고 목록 조회 중 오류가 발생했습니다: ${error.message}` : 
      "채용공고 목록 조회 중 오류가 발생했습니다";
      
    return NextResponse.json(
      createErrorResponse(errorMessage),
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const jobData = await request.json();

    if (user.userType !== "hospital" && user.userType !== "HOSPITAL") {
      return NextResponse.json(
        createErrorResponse("병원만 채용공고를 등록할 수 있습니다"),
        { status: 403 }
      );
    }

    // 병원 ID 조회
    const hospital = await getHospitalByUserId(user.userId);
    if (!hospital) {
      return NextResponse.json(
        createErrorResponse("병원 정보를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 채용공고 생성
    const job = await createJobPosting({
      ...jobData,
      hospitalId: hospital.id,
    });

    return NextResponse.json(
      createApiResponse("success", "채용공고가 등록되었습니다", job)
    );
  } catch (error) {
    console.error("Job create error:", error);
    return NextResponse.json(
      createErrorResponse("채용공고 등록 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
