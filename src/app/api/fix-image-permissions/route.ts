import { NextRequest, NextResponse } from "next/server";
import { makeImagePublic } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

// GET: 모든 광고 이미지를 public으로 변경
export async function GET(req: NextRequest) {
  try {
    console.log('[API] Starting image permission fix...');
    
    // 모든 광고의 이미지 URL 조회
    const advertisements = await (prisma as any).advertisements.findMany({
      where: {
        deletedAt: null,
        imageUrl: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    console.log(`[API] Found ${advertisements.length} advertisements with images`);

    const results = [];
    
    for (const ad of advertisements) {
      if (ad.imageUrl) {
        console.log(`[API] Making image public for ad: ${ad.title}`);
        const result = await makeImagePublic(ad.imageUrl);
        results.push({
          id: ad.id,
          title: ad.title,
          imageUrl: ad.imageUrl,
          success: result.success,
          error: result.error
        });
        
        if (result.success) {
          console.log(`[API] ✅ Success for: ${ad.title}`);
        } else {
          console.log(`[API] ❌ Failed for: ${ad.title} - ${result.error}`);
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `이미지 권한 수정 완료: 성공 ${successCount}개, 실패 ${failCount}개`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount
      }
    });
  } catch (error) {
    console.error("Failed to fix image permissions:", error);
    return NextResponse.json(
      { success: false, message: "이미지 권한 수정 실패", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}