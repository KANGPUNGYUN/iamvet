import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("[Test API] Testing database connection...");
    
    // 데이터베이스 연결 테스트
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("[Test API] Database connection successful:", result);
    
    // 환경변수 체크
    console.log("[Test API] Environment variables:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("- JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    return Response.json({
      status: "ok",
      database: "connected",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("[Test API] Error:", error);
    
    return Response.json({
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}