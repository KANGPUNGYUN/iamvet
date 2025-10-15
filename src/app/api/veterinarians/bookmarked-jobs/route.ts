import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 토큰에서 사용자 정보 확인
    let userId: string | undefined;
    let userType: string | undefined;
    
    // Authorization 헤더 확인
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
        userType = payload.userType;
      }
    }
    
    // Authorization 헤더가 없으면 쿠키에서 확인
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      
      if (authTokenCookie) {
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
          userType = payload.userType;
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "토큰이 유효하지 않거나 만료되었습니다. 다시 로그인해주세요." },
        { status: 401 }
      );
    }

    if (!userType || !["VETERINARIAN", "VETERINARY_STUDENT", "veterinarian", "veterinary_student"].includes(userType)) {
      return NextResponse.json(
        { error: "수의사 또는 수의학과 학생 계정만 접근 가능합니다." },
        { status: 403 }
      );
    }

    console.log(`[BookmarkedJobs] Querying liked jobs for userId: ${userId}`);
    
    // 좋아요한 공고 확인
    const likeCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM job_likes WHERE "userId" = ${userId}
    `;
    console.log(`[BookmarkedJobs] Total likes for user:`, likeCount);
    
    
    // 수의사가 좋아요한 공고를 최대 2개까지 조회 (최신순) - 실제 북마크 기능은 좋아요로 구현됨
    const likedJobs = await prisma.$queryRaw`
      SELECT 
        j.id,
        j.title as position,
        j.department,
        j."recruitEndDate" as "applicationDeadline",
        j."createdAt",
        j."workType",
        h."hospitalName" as hospital,
        jl."createdAt" as "likeCreatedAt"
      FROM jobs j
      INNER JOIN job_likes jl ON j.id = jl."jobId"
      INNER JOIN users u ON j."hospitalId" = u.id
      INNER JOIN hospitals h ON u.id = h."userId"
      WHERE jl."userId" = ${userId}
      AND j."deletedAt" IS NULL
      AND j."isActive" = true
      ORDER BY jl."createdAt" DESC
      LIMIT 2
    `;
    
    console.log(`[BookmarkedJobs] Query result count: ${(likedJobs as any[]).length}`);
    console.log(`[BookmarkedJobs] Raw query results:`, likedJobs);

    // 데이터 변환
    const transformedJobs = (likedJobs as any[]).map((job: any) => {
      // D-day 계산
      let dDay = "신규";
      if (job.applicationDeadline) {
        const deadline = new Date(job.applicationDeadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
          dDay = `D-${diffDays}`;
        } else if (diffDays === 0) {
          dDay = "D-day";
        } else {
          dDay = "마감";
        }
      }

      // 생성된지 7일 이내면 "신규"로 표시
      const createdDate = new Date(job.createdAt);
      const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCreated <= 7) {
        dDay = "신규";
      }

      // workType 배열을 태그로 사용
      const tags = Array.isArray(job.workType) ? job.workType : (job.workType ? [job.workType] : []);

      return {
        id: job.id,
        hospital: job.hospital || "병원명 미상",
        dDay,
        position: job.position || "채용공고",
        location: job.department || "부서 미상",
        jobType: tags.join(", ") || "채용형태 미상",
        tags: tags,
        isBookmarked: true,
      };
    });

    return NextResponse.json({
      jobs: transformedJobs,
      total: transformedJobs.length
    });
  } catch (error) {
    console.error("북마크한 공고 조회 실패:", error);
    return NextResponse.json(
      { error: "북마크한 공고를 조회하는데 실패했습니다." },
      { status: 500 }
    );
  }
}