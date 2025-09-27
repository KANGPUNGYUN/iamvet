import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG INFO ===");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Prisma client:", !!prisma);
    
    // Prisma 객체의 속성 확인
    const prismaKeys = prisma ? Object.keys(prisma) : [];
    console.log("Prisma keys:", prismaKeys);
    
    // 테이블 목록 확인
    let tables: string[] = [];
    try {
      const result = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `;
      tables = (result as any[]).map(r => r.table_name);
    } catch (error) {
      console.error("Failed to get tables:", error);
    }
    
    return NextResponse.json({
      status: "ok",
      debug: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        hasPrisma: !!prisma,
        prismaKeys: prismaKeys.slice(0, 10), // 첫 10개만
        tables: tables,
        prismaModels: prisma ? Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')) : []
      }
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}