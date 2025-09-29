import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize, folder = 'uploads' } = await request.json();

    // 파일 크기 검증 (50MB)
    if (fileSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        createErrorResponse("파일 크기는 50MB를 초과할 수 없습니다"),
        { status: 400 }
      );
    }

    // 허용된 파일 타입 검증
    const allowedTypes = [
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        createErrorResponse("지원하지 않는 파일 형식입니다"),
        { status: 400 }
      );
    }

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    // Presigned URL 생성
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1시간
    });

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json(
      createApiResponse("success", "Presigned URL 생성 성공", {
        presignedUrl,
        fileUrl,
        fileName: uniqueFileName,
        originalFileName: fileName,
      })
    );
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    return NextResponse.json(
      createErrorResponse("Presigned URL 생성 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}