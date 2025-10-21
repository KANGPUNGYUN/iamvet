// 비밀번호 재설정 토큰 관리
// 실제 운영 환경에서는 Redis나 데이터베이스를 사용해야 함

interface TokenData {
  email: string;
  expires: Date;
}

// 임시로 메모리에 저장 (실제로는 데이터베이스에 저장해야 함)
const passwordResetTokens = new Map<string, TokenData>();

export function setPasswordResetToken(token: string, email: string, expiresInMinutes: number = 15) {
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  passwordResetTokens.set(token, { email, expires });
}

export function getPasswordResetToken(token: string): TokenData | undefined {
  return passwordResetTokens.get(token);
}

export function deletePasswordResetToken(token: string): boolean {
  return passwordResetTokens.delete(token);
}

export function cleanExpiredTokens() {
  const now = new Date();
  const tokensToDelete: string[] = [];
  
  passwordResetTokens.forEach((data, token) => {
    if (now > data.expires) {
      tokensToDelete.push(token);
    }
  });
  
  tokensToDelete.forEach(token => {
    passwordResetTokens.delete(token);
  });
}