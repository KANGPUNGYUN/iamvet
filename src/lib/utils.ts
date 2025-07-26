export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export function createApiResponse(status: string, message: string, data?: any) {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse(message: string, data?: any) {
  return {
    status: "error",
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

// 사용자 식별자 생성 함수
export function generateUserIdentifier(request: any, userId?: string): string {
  // 1. 로그인한 사용자의 경우 userId 사용
  if (userId) {
    return `user_${userId}`;
  }
  
  // 2. 비회원의 경우 IP + User-Agent 조합으로 식별자 생성
  const userIp = 
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";
  
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  // IP와 User-Agent를 해시화하여 식별자 생성
  const identifier = `${userIp}_${userAgent}`;
  return `guest_${Buffer.from(identifier).toString('base64').slice(0, 16)}`;
}

// 쿠키에서 세션 ID 가져오기 또는 생성
export function getOrCreateSessionId(request: any): string {
  const sessionCookie = request.cookies.get('session_id');
  if (sessionCookie?.value) {
    return sessionCookie.value;
  }
  
  // 새로운 세션 ID 생성
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}