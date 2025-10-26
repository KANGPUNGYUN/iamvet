import { NextResponse } from "next/server";

// 사이트의 기본 URL
const BASE_URL = "https://www.iam-vet.com";

// 정적 페이지 목록
const staticPages = [
  "",
  "/jobs",
  "/resumes",
  "/forums",
  "/transfers",
  "/lectures",
];

// 동적 페이지를 가져오는 함수들
async function getJobIds(): Promise<string[]> {
  // TODO: 실제 API 호출로 채용공고 ID들을 가져와야 함
  return [];
}

async function getResumeIds(): Promise<string[]> {
  // TODO: 실제 API 호출로 이력서 ID들을 가져와야 함
  return [];
}

async function getForumIds(): Promise<string[]> {
  // TODO: 실제 API 호출로 포럼 게시글 ID들을 가져와야 함
  return [];
}

async function getTransferIds(): Promise<string[]> {
  // TODO: 실제 API 호출로 양도양수 ID들을 가져와야 함
  return [];
}

async function getLectureIds(): Promise<string[]> {
  // TODO: 실제 API 호출로 강의 ID들을 가져와야 함
  return [];
}

function generateSitemapXML(
  urls: { loc: string; lastmod: string; changefreq: string; priority: string }[]
) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
  return xml;
}

export async function GET() {
  const now = new Date().toISOString();
  const urls = [];

  // 정적 페이지 추가
  for (const page of staticPages) {
    urls.push({
      loc: `${BASE_URL}${page}`,
      lastmod: now,
      changefreq: page === "" ? "daily" : "weekly",
      priority: page === "" ? "1.0" : "0.8",
    });
  }

  // 동적 페이지 추가
  try {
    // 채용공고 상세 페이지
    const jobIds = await getJobIds();
    for (const id of jobIds) {
      urls.push({
        loc: `${BASE_URL}/jobs/${id}`,
        lastmod: now,
        changefreq: "weekly",
        priority: "0.7",
      });
    }

    // 이력서 상세 페이지
    const resumeIds = await getResumeIds();
    for (const id of resumeIds) {
      urls.push({
        loc: `${BASE_URL}/resumes/${id}`,
        lastmod: now,
        changefreq: "weekly",
        priority: "0.7",
      });
    }

    // 포럼 상세 페이지
    const forumIds = await getForumIds();
    for (const id of forumIds) {
      urls.push({
        loc: `${BASE_URL}/forums/${id}`,
        lastmod: now,
        changefreq: "daily",
        priority: "0.6",
      });
    }

    // 양도양수 상세 페이지
    const transferIds = await getTransferIds();
    for (const id of transferIds) {
      urls.push({
        loc: `${BASE_URL}/transfers/${id}`,
        lastmod: now,
        changefreq: "weekly",
        priority: "0.7",
      });
    }

    // 강의 상세 페이지
    const lectureIds = await getLectureIds();
    for (const id of lectureIds) {
      urls.push({
        loc: `${BASE_URL}/lectures/${id}`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.6",
      });
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  const sitemap = generateSitemapXML(urls);

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
