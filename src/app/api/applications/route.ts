import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "3");

  try {
    // 사용자 정보 확인 - Bearer token과 쿠키 인증 모두 지원
    let userId: string | undefined;
    
    // Authorization 헤더 확인
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // Authorization 헤더가 없으면 쿠키에서 확인
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      if (authTokenCookie) {
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 로그인한 사용자의 지원 내역을 최신순으로 조회
    const applications = await prisma.applications.findMany({
      where: {
        veterinarianId: userId,
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        coverLetter: true,
        jobId: true,
      },
      orderBy: {
        appliedAt: 'desc'
      },
      take: limit,
    });

    // Job과 Hospital 정보를 별도로 조회
    const jobIds = applications.map(app => app.jobId);
    const jobs = await prisma.job.findMany({
      where: {
        id: { in: jobIds }
      },
      select: {
        id: true,
        title: true,
        hospitalId: true,
      }
    });

    const hospitalIds = jobs.map(job => job.hospitalId);
    const hospitals = await prisma.user.findMany({
      where: {
        id: { in: hospitalIds }
      },
      select: {
        id: true,
        hospitalName: true,
        profileImage: true,
      }
    });

    // 프론트엔드에서 기대하는 형태로 데이터 변환
    const formattedApplications = applications.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      const hospital = job ? hospitals.find(h => h.id === job.hospitalId) : null;
      
      return {
        id: parseInt(app.jobId.slice(-8), 16), // jobId의 일부를 숫자로 변환
        applicationDate: app.appliedAt.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\. /g, '.'),
        applicant: hospital?.hospitalName || "병원명 없음",
        position: job?.title || "포지션 정보 없음",
        contact: "-", // 실제 연락처 정보가 있다면 추가
        status: getKoreanStatus(app.status),
        profileImage: hospital?.profileImage,
        jobId: app.jobId,
        applicationId: app.id,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedApplications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// ApplicationStatus enum을 한국어로 변환
function getKoreanStatus(status: string): "서류 합격" | "면접 대기" | "불합격" | "최종합격" {
  switch (status) {
    case 'APPROVED':
      return '서류 합격';
    case 'INTERVIEW':
      return '면접 대기';
    case 'REJECTED':
      return '불합격';
    case 'HIRED':
      return '최종합격';
    case 'PENDING':
    default:
      return '면접 대기';
  }
}