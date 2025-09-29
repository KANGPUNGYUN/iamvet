import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// 대시보드 통계 API
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

    // 1. 사용자 통계
    const userStatsResult = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL) as total_active_users,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "userType" = 'VETERINARIAN') as total_veterinarians,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "userType" = 'VETERINARY_STUDENT') as total_students,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "userType" = 'HOSPITAL') as total_hospitals,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "isActive" = false) as pending_verification,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days') as new_users_month,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '7 days') as new_users_week
      FROM users
    `;

    // 2. 채용공고 통계
    const jobStatsResult = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "isActive" = true AND "isDraft" = false) as active_jobs,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "isDraft" = true) as pending_jobs,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "isActive" = false) as closed_jobs,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days') as new_jobs_month
      FROM jobs
    `;

    // 3. 이력서 통계
    const resumeStatsResult = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL) as active_resumes,
        COUNT(*) as total_resumes,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days') as new_resumes_month
      FROM resumes
    `;

    // 4. 양수양도 통계
    const transferStatsResult = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND status = 'ACTIVE') as active_transfers,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND status = 'RESERVED') as pending_transfers,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND status = 'SOLD') as completed_transfers,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days') as new_transfers_month
      FROM transfers
    `;

    // 5. 포럼 통계
    const forumStatsResult = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL) as total_posts,
        SUM("viewCount") FILTER (WHERE "deletedAt" IS NULL) as total_views,
        COUNT(*) FILTER (WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days') as new_posts_month
      FROM forum_posts
    `;

    // 6. 최근 가입한 사용자 (5명)
    const recentUsersResult = await sql`
      SELECT 
        u.id,
        u.email,
        u."userType",
        u."isActive",
        u."createdAt",
        CASE 
          WHEN u."userType" = 'VETERINARIAN' THEN COALESCE(v.nickname, v."realName")
          WHEN u."userType" = 'VETERINARY_STUDENT' THEN COALESCE(vs.nickname, vs."realName")
          WHEN u."userType" = 'HOSPITAL' THEN h."hospitalName"
          ELSE u.email
        END as display_name
      FROM users u
      LEFT JOIN veterinarians v ON u.id = v."userId"
      LEFT JOIN veterinary_students vs ON u.id = vs."userId"
      LEFT JOIN hospitals h ON u.id = h."userId"
      WHERE u."deletedAt" IS NULL
      ORDER BY u."createdAt" DESC
      LIMIT 5
    `;

    // 7. 최근 채용공고 (5개)
    const recentJobsResult = await sql`
      SELECT 
        j.id,
        j.title,
        j."isActive",
        j."isDraft",
        j."createdAt",
        h."hospitalName",
        j.department
      FROM jobs j
      LEFT JOIN hospitals h ON j."hospitalId" = h.id
      WHERE j."deletedAt" IS NULL
      ORDER BY j."createdAt" DESC
      LIMIT 5
    `;

    // 8. 최근 포럼 게시물 (5개)
    const recentForumsResult = await sql`
      SELECT 
        fp.id,
        fp.title,
        fp."viewCount",
        fp."createdAt",
        fp."medicalField",
        CASE 
          WHEN u."userType" = 'VETERINARIAN' THEN COALESCE(v.nickname, v."realName")
          WHEN u."userType" = 'VETERINARY_STUDENT' THEN COALESCE(vs.nickname, vs."realName")
          WHEN u."userType" = 'HOSPITAL' THEN h."hospitalName"
          ELSE u.email
        END as author_name,
        COUNT(fc.id) as comment_count
      FROM forum_posts fp
      LEFT JOIN users u ON fp."userId" = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
      LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
      LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
      LEFT JOIN forum_comments fc ON fp.id = fc.forum_id AND fc."deletedAt" IS NULL
      WHERE fp."deletedAt" IS NULL
      GROUP BY fp.id, u.id, u."userType", v.nickname, v."realName", vs.nickname, vs."realName", h."hospitalName", u.email
      ORDER BY fp."createdAt" DESC
      LIMIT 5
    `;

    // 9. 월별 가입자 추이 (최근 6개월)
    const userTrendResult = await sql`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*) as count
      FROM users
      WHERE "deletedAt" IS NULL
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month
    `;

    // 데이터 변환
    const userStats = userStatsResult[0];
    const jobStats = jobStatsResult[0];
    const resumeStats = resumeStatsResult[0];
    const transferStats = transferStatsResult[0];
    const forumStats = forumStatsResult[0];

    // 전체 통계 계산
    const totalUsers = parseInt(userStats.total_active_users || '0');
    const lastMonthUsers = parseInt(userStats.new_users_month || '0');
    const userGrowthRate = totalUsers > 0 ? Math.round((lastMonthUsers / totalUsers) * 100) : 0;

    const totalJobs = parseInt(jobStats.active_jobs || '0');
    const lastMonthJobs = parseInt(jobStats.new_jobs_month || '0');
    const jobGrowthRate = totalJobs > 0 ? Math.round((lastMonthJobs / totalJobs) * 100) : 0;

    // 응답 데이터 구성
    const dashboardData = {
      stats: {
        users: {
          total: totalUsers,
          veterinarians: parseInt(userStats.total_veterinarians || '0'),
          students: parseInt(userStats.total_students || '0'),
          hospitals: parseInt(userStats.total_hospitals || '0'),
          pendingVerification: parseInt(userStats.pending_verification || '0'),
          newThisMonth: lastMonthUsers,
          newThisWeek: parseInt(userStats.new_users_week || '0'),
          growthRate: userGrowthRate
        },
        jobs: {
          active: totalJobs,
          pending: parseInt(jobStats.pending_jobs || '0'),
          closed: parseInt(jobStats.closed_jobs || '0'),
          newThisMonth: lastMonthJobs,
          growthRate: jobGrowthRate
        },
        resumes: {
          active: parseInt(resumeStats.active_resumes || '0'),
          hidden: 0, // No hidden status in schema
          newThisMonth: parseInt(resumeStats.new_resumes_month || '0')
        },
        transfers: {
          active: parseInt(transferStats.active_transfers || '0'),
          pending: parseInt(transferStats.pending_transfers || '0'),
          completed: parseInt(transferStats.completed_transfers || '0'),
          newThisMonth: parseInt(transferStats.new_transfers_month || '0')
        },
        forums: {
          totalPosts: parseInt(forumStats.total_posts || '0'),
          totalViews: parseInt(forumStats.total_views || '0'),
          newThisMonth: parseInt(forumStats.new_posts_month || '0')
        }
      },
      recentUsers: recentUsersResult.map(user => ({
        id: user.id,
        name: user.display_name || user.email,
        email: user.email,
        type: user.userType,
        status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
        joinDate: user.createdAt?.toISOString().split('T')[0]
      })),
      recentJobs: recentJobsResult.map(job => ({
        id: job.id,
        title: job.title,
        hospitalName: job.hospitalName,
        employmentType: job.department || 'FULL_TIME',
        status: job.isDraft ? 'PENDING' : (job.isActive ? 'ACTIVE' : 'CLOSED'),
        createdAt: job.createdAt?.toISOString().split('T')[0]
      })),
      recentForums: recentForumsResult.map(forum => ({
        id: forum.id,
        title: forum.title,
        author: forum.author_name,
        category: forum.medicalField,
        viewCount: parseInt(forum.viewCount || '0'),
        commentCount: parseInt(forum.comment_count || '0'),
        createdAt: forum.createdAt?.toISOString().split('T')[0]
      })),
      userTrend: userTrendResult.map(item => ({
        month: item.month,
        count: parseInt(item.count || '0')
      }))
    };

    return NextResponse.json({
      status: 'success',
      data: dashboardData
    });

  } catch (error) {
    console.error('대시보드 데이터 조회 실패:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: '서버 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}