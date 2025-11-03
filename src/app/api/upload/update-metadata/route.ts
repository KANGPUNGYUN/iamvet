import { NextRequest, NextResponse } from "next/server";
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, originalFileName } = await request.json();

    if (!fileUrl || !originalFileName) {
      return NextResponse.json(
        createErrorResponse("파일 URL과 원본 파일명이 필요합니다"),
        { status: 400 }
      );
    }

    // S3 key 추출
    const urlParts = fileUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part.includes(BUCKET_NAME));
    
    if (bucketIndex === -1) {
      return NextResponse.json(
        createErrorResponse("유효하지 않은 파일 URL입니다"),
        { status: 400 }
      );
    }

    const key = urlParts.slice(bucketIndex + 1).join('/');

    // UTF-8로 인코딩된 원본 파일명
    const encodedOriginalFileName = encodeURIComponent(originalFileName);

    // 기존 객체를 복사하면서 메타데이터 추가
    const copyCommand = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${key}`,
      Key: key,
      Metadata: {
        'original-filename': encodedOriginalFileName,
      },
      ContentDisposition: `attachment; filename*=UTF-8''${encodedOriginalFileName}`,
      MetadataDirective: 'REPLACE',
    });

    await s3Client.send(copyCommand);

    return NextResponse.json(
      createApiResponse("success", "메타데이터 업데이트 성공", {
        fileUrl,
        originalFileName,
      })
    );

  } catch (error) {
    console.error("메타데이터 업데이트 오류:", error);
    return NextResponse.json(
      createErrorResponse("메타데이터 업데이트 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}