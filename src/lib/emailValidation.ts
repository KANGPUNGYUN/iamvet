// 클라이언트 사이드에서 사용할 수 있는 이메일 검증 함수들

// 수의학과 학생 이메일 검증 (개발 환경에서는 @naver.com 허용)
export function validateStudentEmail(email: string): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 수의과대학 도메인 목록
  const veterinarySchoolDomains = [
    'kangwon.ac.kr',
    'konkuk.ac.kr', 
    'knu.ac.kr',
    'gnu.ac.kr',
    'snu.ac.kr',
    'jnu.ac.kr',
    'jbnu.ac.kr',
    'stu.jejunu.ac.kr',
    'o.cnu.ac.kr',
    'chungbuk.ac.kr',
  ];
  
  // 대학 이메일 검증
  const isUniversityEmail = veterinarySchoolDomains.some(domain => email.endsWith(`@${domain}`));
  
  if (isDevelopment) {
    // 개발 환경에서는 @naver.com도 허용
    return isUniversityEmail || email.endsWith('@naver.com');
  }
  
  // 프로덕션 환경에서는 대학 이메일만 허용
  return isUniversityEmail;
}