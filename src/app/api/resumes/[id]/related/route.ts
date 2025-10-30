import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";
import { sql } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const resumeId = resolvedParams.id;

    // 현재 사용자 정보 확인 (선택적)
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

    // 현재 이력서 정보 가져오기
    const currentResumeResult = await sql`
      SELECT 
        dr.id,
        dr."userId",
        dr.position,
        dr.specialties,
        dr."preferredRegions",
        dr."workTypes",
        dr."expectedSalary"
      FROM resumes dr
      WHERE dr.id = ${resumeId}
    `;

    if (currentResumeResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("이력서를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    const currentResume = currentResumeResult[0];

    // 관련 이력서 찾기 로직
    // 1. 같은 position (직무)
    // 2. 유사한 specialties (전공분야)
    // 3. 겹치는 preferredRegions (선호지역)
    // 4. 비슷한 expectedSalary (급여)
    const relatedResumesResult = await sql`
      WITH current_resume AS (
        SELECT 
          position,
          specialties,
          "preferredRegions",
          "expectedSalary"::numeric
        FROM resumes
        WHERE id = ${resumeId}
      ),
      scored_resumes AS (
        SELECT 
          dr.id,
          dr."userId",
          dr.name,
          dr.photo,
          dr.introduction,
          dr.position,
          dr.specialties,
          dr."preferredRegions",
          dr."expectedSalary",
          dr."createdAt",
          dr."updatedAt",
          -- 점수 계산
          CASE 
            WHEN dr.position = cr.position THEN 3
            ELSE 0
          END +
          CASE 
            WHEN dr.specialties && cr.specialties THEN 2
            ELSE 0
          END +
          CASE 
            WHEN dr."preferredRegions" && cr."preferredRegions" THEN 1
            ELSE 0
          END +
          CASE 
            WHEN dr."expectedSalary" IS NOT NULL AND cr."expectedSalary" IS NOT NULL
            AND ABS(dr."expectedSalary"::numeric - cr."expectedSalary") <= 1000 THEN 1
            ELSE 0
          END as relevance_score
        FROM resumes dr
        CROSS JOIN current_resume cr
        WHERE dr.id != ${resumeId}
          AND dr."deletedAt" IS NULL
      )
      SELECT 
        sr.*,
        -- 경력 기간 계산을 위한 서브쿼리
        COALESCE((
          SELECT 
            CASE 
              WHEN COUNT(*) = 0 THEN '신입'
              ELSE CONCAT(
                '경력 ',
                FLOOR(SUM(
                  EXTRACT(YEAR FROM AGE(
                    COALESCE(re."endDate", NOW()), 
                    re."startDate"
                  ))
                ))::text,
                '년 ',
                FLOOR(SUM(
                  EXTRACT(MONTH FROM AGE(
                    COALESCE(re."endDate", NOW()), 
                    re."startDate"
                  ))
                ) % 12)::text,
                '개월'
              )
            END
          FROM resume_experiences re
          WHERE re."resumeId" = sr.id
        ), '신입') as experience
      FROM scored_resumes sr
      WHERE relevance_score > 0
      ORDER BY relevance_score DESC, sr."createdAt" DESC
      LIMIT 6
    `;

    // 좋아요 여부 확인 (로그인한 경우에만)
    const resumeIds = relatedResumesResult.map(resume => resume.id);
    let likedResumeIds: string[] = [];
    
    if (userId && resumeIds.length > 0) {
      const likes = await (prisma as any).resume_likes.findMany({
        where: {
          userId: userId,
          resumeId: {
            in: resumeIds
          }
        },
        select: {
          resumeId: true
        }
      });
      likedResumeIds = likes.map((like: any) => like.resumeId);
    }

    // 응답 데이터 형식 맞추기
    const relatedResumes = relatedResumesResult.map(resume => {
      // keywords 생성: position + specialties + workTypes
      const keywords: string[] = [];
      
      if (resume.position) {
        keywords.push(getKoreanLabel(resume.position));
      }
      
      if (resume.specialties && Array.isArray(resume.specialties)) {
        keywords.push(...resume.specialties.map((s: string) => getKoreanLabel(s)));
      }

      return {
        id: resume.id,
        name: resume.name,
        experience: resume.experience,
        preferredLocation: resume.preferredRegions && Array.isArray(resume.preferredRegions) 
          ? resume.preferredRegions.map((r: string) => getKoreanLabel(r)).join(', ')
          : '미정',
        keywords: keywords.slice(0, 4), // 최대 4개까지만
        lastAccessDate: new Date(resume.updatedAt).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
        isBookmarked: likedResumeIds.includes(resume.id),
        profileImage: resume.photo // 프로필 이미지 추가
      };
    });

    return NextResponse.json(
      createApiResponse("success", "관련 인재 정보 조회 성공", relatedResumes)
    );
  } catch (error) {
    console.error("Related resumes error:", error);
    return NextResponse.json(
      createErrorResponse("관련 인재 정보 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

// 한국어 라벨 변환 함수 (VeterinarianResumePage에서 실제 사용되는 값들만 매핑)
function getKoreanLabel(keyword: string) {
  const labelMap: { [key: string]: string } = {
    // 진료 분야 (VeterinarianResumePage medicalFieldOptions 기준)
    internal: "내과",
    surgery: "외과",
    dermatology: "피부과",
    orthopedics: "정형외과",

    // 학위 (VeterinarianResumePage degreeOptions 기준)
    bachelor: "학사",
    master: "석사",
    doctor: "박사",

    // 졸업상태 (VeterinarianResumePage graduationStatusOptions 기준)
    graduated: "졸업",
    expected: "졸업예정",
    attending: "재학중",

    // 숙련도 (VeterinarianResumePage proficiencyOptions 기준)
    beginner: "초급",
    intermediate: "중급",
    advanced: "고급",
    expert: "전문가",

    // 자격증 등급 (VeterinarianResumePage gradeOptions 기준)
    "1": "1급",
    "2": "2급", 
    "3": "3급",
    special: "특급",

    // 직무
    veterinarian: "수의사",
    assistant: "수의테크니션",
    manager: "병원장",
    intern: "인턴",
    resident: "전공의",
    
    // 근무 형태
    "full-time": "정규직",
    fulltime: "정규직",
    "part-time": "파트타임",
    parttime: "파트타임",
    contract: "계약직",
    freelance: "프리랜서",
    internship: "인턴십",
    
    // 지역
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
    incheon: "인천",
    gwangju: "광주",
    daejeon: "대전",
    ulsan: "울산",
    gyeonggi: "경기",
    gangwon: "강원",
    chungbuk: "충북",
    chungnam: "충남",
    jeonbuk: "전북",
    jeonnam: "전남",
    gyeongbuk: "경북",
    gyeongnam: "경남",
    jeju: "제주",
    sejong: "세종",
  };
  return labelMap[keyword?.toLowerCase()] || keyword;
}