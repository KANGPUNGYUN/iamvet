# 이메일 인증 시스템 설정 가이드

## 개요
이 문서는 아이엠벳의 이메일 인증 시스템을 설정하는 방법을 안내합니다.
Gmail SMTP를 사용하여 무료로 이메일을 전송할 수 있습니다.

## 1. Gmail 앱 비밀번호 생성

### 1.1 2단계 인증 활성화
1. [Google 계정 설정](https://myaccount.google.com/)에 접속
2. 보안 > 2단계 인증 활성화

### 1.2 앱 비밀번호 생성
1. [Google 계정 보안](https://myaccount.google.com/security)에 접속
2. "2단계 인증" 섹션에서 "앱 비밀번호" 클릭
3. 앱 선택: "메일" 선택
4. 기기 선택: "기타(맞춤 이름)" 선택 후 "아이엠벳" 입력
5. "생성" 버튼 클릭
6. 생성된 16자리 앱 비밀번호 복사 (띄어쓰기 제거)

## 2. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가합니다:

```env
# 이메일 설정
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-digit-app-password
```

예시:
```env
EMAIL_USER=iamvet.service@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # 실제로는 띄어쓰기 제거
```

## 3. 데이터베이스 마이그레이션

이메일 인증을 위한 테이블을 생성합니다:

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name add_email_verifications
```

## 4. API 엔드포인트

### 4.1 인증 코드 전송
- **엔드포인트**: `POST /api/auth/email/send-verification`
- **요청 본문**:
  ```json
  {
    "email": "user@example.com",
    "userType": "VETERINARY_STUDENT" // 선택사항
  }
  ```
- **헤더**: `Authorization: Bearer {token}`

### 4.2 인증 코드 확인
- **엔드포인트**: `POST /api/auth/email/verify`
- **요청 본문**:
  ```json
  {
    "verificationId": "verification-id",
    "verificationCode": "123456"
  }
  ```
- **헤더**: `Authorization: Bearer {token}`

### 4.3 인증 상태 확인
- **엔드포인트**: `GET /api/auth/email/verify?verificationId={id}`
- **헤더**: `Authorization: Bearer {token}`

## 5. 프론트엔드 사용법

```tsx
import EmailVerification from '@/components/auth/EmailVerification';

function MyComponent() {
  return (
    <EmailVerification
      email="user@example.com"
      userType="VETERINARY_STUDENT"
      onVerified={(email) => {
        console.log('인증 완료:', email);
      }}
      onCancel={() => {
        console.log('인증 취소');
      }}
    />
  );
}
```

## 6. 수의학과 학생 이메일 규칙

### 개발 환경 (NODE_ENV=development)
- 대학 이메일 (.ac.kr) 허용
- @naver.com 이메일 허용 (테스트용)

### 프로덕션 환경 (NODE_ENV=production)
- 대학 이메일 (.ac.kr)만 허용
- 지원 대학 목록:
  - kangwon.ac.kr (강원대학교)
  - knu.ac.kr (경북대학교)
  - gnu.ac.kr (경상대학교)
  - snu.ac.kr (서울대학교)
  - jnu.ac.kr (전남대학교)
  - jbnu.ac.kr (전북대학교)
  - jejunu.ac.kr (제주대학교)
  - cnu.ac.kr (충남대학교)
  - cbu.ac.kr (충북대학교)
  - konkuk.ac.kr (건국대학교)
  - kyungpook.ac.kr (경북대학교)

## 7. Gmail 일일 전송 제한

- 무료 Gmail 계정: 일일 500개 이메일
- Google Workspace: 일일 2,000개 이메일
- 제한 초과 시 24시간 대기 필요

## 8. 문제 해결

### 이메일이 전송되지 않는 경우
1. Gmail 계정에서 "보안 수준이 낮은 앱" 차단 해제 확인
2. 앱 비밀번호가 올바른지 확인
3. 환경 변수가 올바르게 설정되었는지 확인

### 스팸으로 분류되는 경우
1. SPF/DKIM 레코드 설정 고려
2. 이메일 내용에 스팸 키워드 제거
3. 전송량을 점진적으로 증가

## 9. 프로덕션 권장사항

프로덕션 환경에서는 다음 서비스 사용을 권장합니다:
- SendGrid (월 100개 무료)
- Amazon SES
- Mailgun
- Postmark