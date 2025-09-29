import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// 포럼 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    // TODO: 임시로 인증 우회 - 나중에 다시 활성화
    // const adminAuth = verifyAdminToken(request);
    // if (!adminAuth.success) {
    //   return NextResponse.json(
    //     { status: 'error', message: '관리자 인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }
    

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // 필터 패턴 구성
    const searchPattern = search ? `%${search}%` : null;

    // 총 개수 조회
    let countResult;
    if (search || category || status) {
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM forum_posts fp
        LEFT JOIN users u ON fp."userId" = u.id
        WHERE 1=1
          ${search ? sql`AND (fp.title ILIKE ${searchPattern} OR fp.content ILIKE ${searchPattern})` : sql``}
          ${category ? sql`AND fp."medicalField" = ${category}` : sql``}
          ${status ? sql`AND (
            (${status} = 'ACTIVE' AND fp."deletedAt" IS NULL) OR
            (${status} = 'INACTIVE' AND fp."deletedAt" IS NOT NULL)
          )` : sql``}
      `;
    } else {
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM forum_posts fp
      `;
    }
    const total = parseInt(countResult[0]?.total || '0');

    // 포럼 목록 조회
    let forumsResult;
    if (search || category || status) {
      forumsResult = await sql`
        SELECT 
          fp.id,
          fp.title,
          fp.content,
          fp."animalType",
          fp."medicalField",
          fp."viewCount",
          fp."createdAt",
          fp."updatedAt",
          fp."deletedAt",
          CASE 
            WHEN u."userType" = 'VETERINARIAN' THEN COALESCE(v.nickname, v."realName")
            WHEN u."userType" = 'VETERINARY_STUDENT' THEN COALESCE(vs.nickname, vs."realName")
            WHEN u."userType" = 'HOSPITAL' THEN h."hospitalName"
            ELSE u.email
          END as author_name,
          u."userType" as author_type,
          u.email as author_email,
          COUNT(DISTINCT fc.id) as comment_count,
          COUNT(DISTINCT fpl.id) as like_count
        FROM forum_posts fp
        LEFT JOIN users u ON fp."userId" = u.id
        LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
        LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
        LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
        LEFT JOIN forum_comments fc ON fp.id = fc.forum_id AND fc."deletedAt" IS NULL
        LEFT JOIN forum_post_likes fpl ON fp.id = fpl."forumPostId"
        WHERE 1=1
          ${search ? sql`AND (fp.title ILIKE ${searchPattern} OR fp.content ILIKE ${searchPattern})` : sql``}
          ${category ? sql`AND fp."medicalField" = ${category}` : sql``}
          ${status ? sql`AND (
            (${status} = 'ACTIVE' AND fp."deletedAt" IS NULL) OR
            (${status} = 'INACTIVE' AND fp."deletedAt" IS NOT NULL)
          )` : sql``}
        GROUP BY fp.id, u.id, u.email, u."userType", v.nickname, v."realName", vs.nickname, vs."realName", h."hospitalName"
        ORDER BY fp."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      forumsResult = await sql`
        SELECT 
          fp.id,
          fp.title,
          fp.content,
          fp."animalType",
          fp."medicalField",
          fp."viewCount",
          fp."createdAt",
          fp."updatedAt",
          fp."deletedAt",
          CASE 
            WHEN u."userType" = 'VETERINARIAN' THEN COALESCE(v.nickname, v."realName")
            WHEN u."userType" = 'VETERINARY_STUDENT' THEN COALESCE(vs.nickname, vs."realName")
            WHEN u."userType" = 'HOSPITAL' THEN h."hospitalName"
            ELSE u.email
          END as author_name,
          u."userType" as author_type,
          u.email as author_email,
          COUNT(DISTINCT fc.id) as comment_count,
          COUNT(DISTINCT fpl.id) as like_count
        FROM forum_posts fp
        LEFT JOIN users u ON fp."userId" = u.id
        LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
        LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
        LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
        LEFT JOIN forum_comments fc ON fp.id = fc.forum_id AND fc."deletedAt" IS NULL
        LEFT JOIN forum_post_likes fpl ON fp.id = fpl."forumPostId"
        GROUP BY fp.id, u.id, u.email, u."userType", v.nickname, v."realName", vs.nickname, vs."realName", h."hospitalName"
        ORDER BY fp."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // 통계 조회
    const statsResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE fp."deletedAt" IS NULL) as active,
        COUNT(*) FILTER (WHERE fp."deletedAt" IS NOT NULL) as inactive,
        SUM(fp."viewCount") as total_views,
        COUNT(DISTINCT fc.id) as total_comments
      FROM forum_posts fp
      LEFT JOIN forum_comments fc ON fp.id = fc.forum_id AND fc."deletedAt" IS NULL
    `;

    // 최근 7일 통계
    const recentStatsResult = await sql`
      SELECT 
        COUNT(*) as recent_posts,
        SUM(fp."viewCount") as recent_views
      FROM forum_posts fp
      WHERE fp."createdAt" >= NOW() - INTERVAL '7 days'
    `;

    // 데이터 변환
    const forums = forumsResult.map(row => {
      // 의료 분야 매핑
      const getMedicalFieldCategory = (field: string) => {
        const fieldMap: { [key: string]: string } = {
          'CLINICAL': 'CLINICAL',
          'TREATMENT': 'TREATMENT', 
          'DIAGNOSIS': 'DIAGNOSIS',
          'MEDICATION': 'MEDICATION',
          'SURGERY': 'SURGERY',
          'GENERAL': 'GENERAL'
        };
        return fieldMap[field] || 'GENERAL';
      };

      // 작성자 타입 매핑
      const getAuthorType = (userType: string) => {
        return userType === 'HOSPITAL' ? 'HOSPITAL' : 'VETERINARIAN';
      };

      // ID는 문자열이므로 그대로 사용
      const safeId = row.id || '';
      const authorId = row.author_email ? Math.abs(row.author_email.split('').reduce((a: number, b: string) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)) || 1 : 1;

      return {
        id: safeId,
        title: row.title || '',
        content: row.content?.substring(0, 200) + (row.content?.length > 200 ? '...' : ''), // 미리보기용 요약
        author: {
          id: authorId,
          name: row.author_name || row.author_email || 'Unknown',
          type: getAuthorType(row.author_type),
          avatar: undefined,
        },
        category: getMedicalFieldCategory(row.medicalField),
        isActive: row.deletedAt === null,
        viewCount: parseInt(row.viewCount) || 0,
        likeCount: parseInt(row.like_count) || 0,
        commentCount: parseInt(row.comment_count) || 0,
        createdAt: row.createdAt?.toISOString().split('T')[0],
        updatedAt: row.updatedAt?.toISOString().split('T')[0],
        tags: [row.animalType, row.medicalField].filter(Boolean), // 임시 태그
      };
    });

    const stats = {
      total: parseInt(statsResult[0]?.total || '0'),
      active: parseInt(statsResult[0]?.active || '0'),
      inactive: parseInt(statsResult[0]?.inactive || '0'),
      totalViews: parseInt(statsResult[0]?.total_views || '0'),
      totalComments: parseInt(statsResult[0]?.total_comments || '0'),
      recentPosts: parseInt(recentStatsResult[0]?.recent_posts || '0'),
      recentViews: parseInt(recentStatsResult[0]?.recent_views || '0'),
    };

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      status: 'success',
      data: {
        forums,
        pagination,
        stats,
      },
    });

  } catch (error) {
    console.error('포럼 목록 조회 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}