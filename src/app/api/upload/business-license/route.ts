import { uploadFile } from "@/lib/s3";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // 60초 타임아웃
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log("[Business License Upload] Request received");
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    console.log("[Business License Upload] File info:", {
      name: file?.name,
      type: file?.type,
      size: file?.size
    });

    if (!file) {
      return NextResponse.json(
        createErrorResponse("파일이 선택되지 않았습니다"),
        { status: 400 }
      );
    }

    // 파일 크기 검증 (50MB로 증가)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        createErrorResponse("파일 크기는 50MB를 초과할 수 없습니다"),
        { status: 413 }
      );
    }

    // 사업자등록증용 파일 타입 검증 (이미지, PDF, Word)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        createErrorResponse("지원하지 않는 파일 형식입니다. 이미지, PDF, 또는 Word 파일을 업로드해주세요."),
        { status: 400 }
      );
    }

    // 파일 타입 결정
    let fileType = "document";
    if (file.type.startsWith("image/")) {
      fileType = "image";
    } else if (file.type === "application/pdf") {
      fileType = "pdf";
    } else if (file.type.includes("word") || file.type.includes("officedocument")) {
      fileType = "word";
    }

    const fileUrl = await uploadFile(file, "business-licenses");

    return NextResponse.json(
      createApiResponse("success", "사업자등록증 파일 업로드 성공", {
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: fileType,
        mimeType: file.type,
      })
    );
  } catch (error) {
    console.error("Business license upload API error:", error);
    return NextResponse.json(
      createErrorResponse("파일 업로드 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}