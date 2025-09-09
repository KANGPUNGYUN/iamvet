"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 버킷 이름에서 ARN 부분 제거
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME?.replace('arn:aws:s3:::', '') || 'iamvet-bucket';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// 이미지 업로드
export async function uploadImage(
  file: File,
  folder: 'profiles' | 'licenses' | 'hospitals' | 'resumes' = 'profiles'
): Promise<UploadResult> {
  try {
    // 파일 확장자 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: '지원되는 이미지 형식이 아닙니다. (JPEG, PNG, WebP만 지원)',
      };
    }

    // 파일 크기 확인 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: '파일 크기가 너무 큽니다. (5MB 이하만 지원)',
      };
    }

    // 고유한 파일명 생성
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folder}/${createId()}.${fileExtension}`;

    // 파일을 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer());

    // S3에 업로드
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // 공개 읽기 권한
    });

    await s3Client.send(command);

    // S3 URL 생성
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다.',
    };
  }
}

// 이미지 업로드 (Base64 문자열로부터)
export async function uploadImageFromBase64(
  base64Data: string,
  folder: 'profiles' | 'licenses' | 'hospitals' | 'resumes' = 'profiles',
  fileName?: string
): Promise<UploadResult> {
  try {
    // base64 데이터에서 MIME 타입과 데이터 분리
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return {
        success: false,
        error: '잘못된 base64 이미지 데이터입니다.',
      };
    }

    const mimeType = matches[1];
    const base64 = matches[2];

    // 지원되는 이미지 타입 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      return {
        success: false,
        error: '지원되는 이미지 형식이 아닙니다. (JPEG, PNG, WebP만 지원)',
      };
    }

    // Buffer로 변환
    const buffer = Buffer.from(base64, 'base64');

    // 파일 크기 확인 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (buffer.length > maxSize) {
      return {
        success: false,
        error: '파일 크기가 너무 큽니다. (5MB 이하만 지원)',
      };
    }

    // 파일 확장자 결정
    const extension = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
    const generatedFileName = fileName || `${folder}/${createId()}.${extension}`;

    // S3에 업로드
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: generatedFileName,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read', // 공개 읽기 권한
    });

    await s3Client.send(command);

    // S3 URL 생성
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${generatedFileName}`;

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('S3 upload from base64 error:', error);
    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다.',
    };
  }
}

// 이미지 삭제
export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // URL에서 키 추출
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part.includes(BUCKET_NAME));
    
    if (bucketIndex === -1) {
      return {
        success: false,
        error: '잘못된 이미지 URL입니다.',
      };
    }

    // 키는 버킷명 다음부터의 모든 부분
    const key = urlParts.slice(bucketIndex + 1).join('/');

    if (!key) {
      return {
        success: false,
        error: '이미지 키를 찾을 수 없습니다.',
      };
    }

    // S3에서 삭제
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: '이미지 삭제 중 오류가 발생했습니다.',
    };
  }
}

// 서명된 URL 생성 (private 파일 접근 시 사용)
export async function getSignedImageUrl(
  key: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      url: signedUrl,
    };
  } catch (error) {
    console.error('Get signed URL error:', error);
    return {
      success: false,
      error: '서명된 URL 생성 중 오류가 발생했습니다.',
    };
  }
}

// 이미지 URL이 S3 URL인지 확인하는 헬퍼 함수
export function isS3Url(url: string): boolean {
  return url.includes(BUCKET_NAME) && url.includes('amazonaws.com');
}

// S3 키를 URL에서 추출하는 헬퍼 함수
export function extractS3Key(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part.includes(BUCKET_NAME));
    
    if (bucketIndex === -1) {
      return null;
    }

    return urlParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}