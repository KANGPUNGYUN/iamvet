import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 사용자 정보 확인 (선택적) - Bearer token과 쿠키 인증 모두 지원
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

    console.log("[Popular Categories API] 사용자 ID:", userId);

    // 카테고리별 조회수 상위 3개 조회
    const topCategories = await prisma.lectures.groupBy({
      by: ['category'],
      where: {
        deletedAt: null,
        category: {
          not: null
        }
      },
      _sum: {
        viewCount: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          viewCount: 'desc'
        }
      },
      take: 3
    });

    // 각 카테고리별로 인기 강의 4개씩 조회
    const categoriesWithLectures = await Promise.all(
      topCategories.map(async (categoryGroup) => {
        const category = categoryGroup.category;
        
        // category가 null인 경우 건너뛰기
        if (!category) {
          return null;
        }
        
        // 해당 카테고리의 인기 강의 4개 조회
        const lectures = await prisma.lectures.findMany({
          where: {
            category: category,
            deletedAt: null
          },
          orderBy: {
            viewCount: 'desc'
          },
          take: 4,
          select: {
            id: true,
            title: true,
            thumbnail: true,
            viewCount: true,
            category: true,
            instructor: true,
            createdAt: true,
            description: true
          }
        });

        // 좋아요 정보 조회 (로그인한 경우에만)
        let userLikes: string[] = [];
        if (userId && lectures.length > 0) {
          const lectureIds = lectures.map(lecture => lecture.id).filter(Boolean);
          
          if (lectureIds.length > 0) {
            const likes = await (prisma as any).lecture_likes.findMany({
              where: { 
                userId,
                lectureId: { in: lectureIds }
              },
              select: { lectureId: true }
            });
            userLikes = likes.map((like: any) => like.lectureId);
            console.log(`[Popular Categories API] ${category} 카테고리 좋아요:`, userLikes);
          }
        }

        // 좋아요 정보를 포함한 강의 데이터 변환
        const lecturesWithLikes = lectures.map(lecture => ({
          ...lecture,
          isLiked: userId ? userLikes.includes(lecture.id) : false
        }));

        // 카테고리 한국어 이름 매핑
        const categoryNameMap: { [key: string]: string } = {
          'emergency': '응급의학',
          'internal': '내과',
          'surgery': '외과', 
          'dermatology': '피부과',
          'orthopedics': '정형외과',
          'cardiology': '심장내과',
          'neurology': '신경과',
          'oncology': '종양학',
          'anesthesia': '마취과',
          'radiology': '영상의학과',
          'pathology': '병리학',
          'laboratory': '임상병리학',
          'dentistry': '치과',
          'ophthalmology': '안과',
          'reproduction': '번식학',
          'nutrition': '영양학',
          'behavior': '행동학',
          'preventive': '예방의학',
          'exotic': '특수동물의학',
          'wildlife': '야생동물의학'
        };

        const categoryDisplayName = categoryNameMap[category] || category;

        // 카테고리 설명 매핑
        const categoryDescriptionMap: { [key: string]: string } = {
          'emergency': '응급 상황 대처부터 응급수술까지\n응급의학 전문 역량을 쌓습니다',
          'internal': '내과 질환 진단부터 치료까지\n내과 전문 지식을 체계적으로 학습합니다',
          'surgery': '수술 기법부터 수술 후 관리까지\n외과 전문 기술을 익힙니다',
          'dermatology': '피부질환 진단부터 치료까지\n피부과 전문 지식을 습득합니다',
          'orthopedics': '정형외과 진단과 치료법을\n체계적으로 학습합니다',
          'cardiology': '심장질환의 진단과 치료를\n전문적으로 다룹니다',
          'neurology': '신경계 질환의 이해와\n진단 방법을 학습합니다',
          'oncology': '종양학의 기초부터 치료까지\n암 치료의 전문 지식을 습득합니다',
          'anesthesia': '마취와 진통 관리의\n전문 기술을 익힙니다',
          'radiology': '영상 진단의 기초부터\n판독까지 체계적 학습',
          'pathology': '병리학적 진단과\n조직검사의 전문 지식',
          'laboratory': '임상검사의 해석과\n진단적 활용법 학습',
          'dentistry': '구강 질환의 진단과\n치료 기법을 익힙니다',
          'ophthalmology': '안과 질환의 진단과\n치료법을 전문적으로 학습',
          'reproduction': '번식과 산과학의\n전문 지식을 습득합니다',
          'nutrition': '동물 영양학과 사료의\n과학적 접근법 학습',
          'behavior': '동물 행동학과 행동치료의\n전문적 이해와 적용',
          'preventive': '예방의학과 공중보건의\n체계적 접근법 학습',
          'exotic': '특수동물의 생리와\n질병 관리법을 익힙니다',
          'wildlife': '야생동물 의학과\n보호 관리법을 학습합니다'
        };

        const categoryDescription = categoryDescriptionMap[category] || `${categoryDisplayName} 전문 지식을 습득합니다`;

        return {
          category: category,
          displayName: categoryDisplayName,
          description: categoryDescription,
          totalViews: categoryGroup._sum.viewCount || 0,
          lectureCount: categoryGroup._count.id,
          lectures: lecturesWithLikes
        };
      })
    );

    // null 값 필터링
    const validCategories = categoriesWithLectures.filter(category => category !== null);

    return NextResponse.json(
      createApiResponse("success", "인기 카테고리 조회 성공", { 
        categories: validCategories 
      })
    );

  } catch (error) {
    console.error("Popular categories API error:", error);
    return NextResponse.json(
      createErrorResponse("인기 카테고리 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}