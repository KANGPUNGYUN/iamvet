import type { UserForTokenGeneration } from '@/actions/auth';

/**
 * 컴파일 타임 검증을 위한 타입 가드 함수
 * Next.js Server Actions 파일에서는 모든 함수가 async여야 하므로 별도 파일로 분리
 */
export function validateUserForTokenGeneration(user: any): user is UserForTokenGeneration {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    user.id.length > 0 &&
    typeof user.email === 'string' &&
    user.email.includes('@') &&
    typeof user.userType === 'string' &&
    ['VETERINARIAN', 'HOSPITAL', 'VETERINARY_STUDENT'].includes(user.userType)
  );
}