import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `# *
User-agent: *
Allow: /
Allow: /jobs
Allow: /resumes
Allow: /forums
Allow: /transfers
Allow: /lectures

# 어드민 페이지 제외
Disallow: /admin/*

# 대시보드 페이지 제외
Disallow: /dashboard/*

# 회원가입 페이지 제외
Disallow: /register/*

# 로그인 페이지 제외
Disallow: /login

# API 라우트 제외
Disallow: /api/*

# 검색엔진별 크롤러 설정
# Google
User-agent: Googlebot
Allow: /
Disallow: /admin/*
Disallow: /dashboard/*
Disallow: /register/*
Disallow: /login
Disallow: /api/*

# Naver
User-agent: Yeti
Allow: /
Disallow: /admin/*
Disallow: /dashboard/*
Disallow: /register/*
Disallow: /login
Disallow: /api/*

# 사이트맵 위치
Sitemap: https://www.iam-vet.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
