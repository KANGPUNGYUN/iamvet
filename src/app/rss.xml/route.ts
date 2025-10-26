import { NextResponse } from "next/server";

const BASE_URL = "https://www.iam-vet.com";
const SITE_TITLE = "IAMVET - 수의사 커뮤니티";
const SITE_DESCRIPTION =
  "수의사를 위한 채용, 이력서, 포럼, 양도양수, 강의 플랫폼";

// RSS 피드에 포함할 최신 콘텐츠를 가져오는 함수들
async function getLatestForums(): Promise<any[]> {
  // TODO: 실제 API 호출로 최신 포럼 게시글을 가져와야 함
  return [];
}

async function getLatestJobs(): Promise<any[]> {
  // TODO: 실제 API 호출로 최신 채용공고를 가져와야 함
  return [];
}

async function getLatestLectures(): Promise<any[]> {
  // TODO: 실제 API 호출로 최신 강의를 가져와야 함
  return [];
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRssXml(items: any[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${BASE_URL}${item.link}</link>
      <guid isPermaLink="true">${BASE_URL}${item.link}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <category>${escapeXml(item.category)}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;
  return xml;
}

export async function GET() {
  const items = [];

  try {
    // 최신 포럼 게시글 가져오기
    const forums = await getLatestForums();
    for (const forum of forums) {
      items.push({
        title: forum.title,
        link: `/forums/${forum.id}`,
        description: forum.content?.substring(0, 200) + "...",
        pubDate: forum.createdAt,
        category: "포럼",
      });
    }

    // 최신 채용공고 가져오기
    const jobs = await getLatestJobs();
    for (const job of jobs) {
      items.push({
        title: `[채용] ${job.title}`,
        link: `/jobs/${job.id}`,
        description: job.description?.substring(0, 200) + "...",
        pubDate: job.createdAt,
        category: "채용",
      });
    }

    // 최신 강의 가져오기
    const lectures = await getLatestLectures();
    for (const lecture of lectures) {
      items.push({
        title: `[강의] ${lecture.title}`,
        link: `/lectures/${lecture.id}`,
        description: lecture.description?.substring(0, 200) + "...",
        pubDate: lecture.createdAt,
        category: "강의",
      });
    }

    // 날짜 순으로 정렬 (최신순)
    items.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    // 최대 50개 항목만 포함
    const limitedItems = items.slice(0, 50);

    const rss = generateRssXml(limitedItems);

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);

    // 에러 발생 시 빈 RSS 반환
    const emptyRss = generateRssXml([]);
    return new NextResponse(emptyRss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
