export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  // 파일 타입 검증
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '지원되는 이미지 형식이 아닙니다. (JPEG, PNG, WebP만 지원)',
    };
  }

  // 파일 크기 검증 (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${Math.round(maxSize / 1024 / 1024)}MB까지 지원됩니다.`,
    };
  }

  // 파일 이름 검증
  if (!file.name || file.name.trim() === '') {
    return {
      isValid: false,
      error: '유효하지 않은 파일명입니다.',
    };
  }

  return { isValid: true };
}

export function getImageFileExtension(filename: string): string | null {
  const extension = filename.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  if (extension && allowedExtensions.includes(extension)) {
    return extension === 'jpeg' ? 'jpg' : extension;
  }
  
  return null;
}