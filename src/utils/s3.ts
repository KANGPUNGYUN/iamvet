// S3 관련 유틸리티 함수들 (클라이언트에서 사용)

// 이미지 URL이 S3 URL인지 확인하는 헬퍼 함수
export function isS3Url(url: string): boolean {
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'iamvet-bucket';
  return url.includes(bucketName) && url.includes('amazonaws.com');
}

// S3 키를 URL에서 추출하는 헬퍼 함수
export function extractS3Key(url: string): string | null {
  try {
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'iamvet-bucket';
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part.includes(bucketName));
    
    if (bucketIndex === -1) {
      return null;
    }

    return urlParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}