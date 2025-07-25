// 회원가입/탈퇴 관련 헬퍼 함수들

export async function checkUserExists(email: string, phone: string, username: string) {
  try {
    // 실제 구현에서는 데이터베이스 연결 사용
    // const existingUser = await db.users.findFirst({
    //   where: {
    //     OR: [
    //       { email },
    //       { phone },
    //       { username }
    //     ]
    //   },
    //   select: {
    //     id: true,
    //     email: true,
    //     phone: true,
    //     username: true,
    //     userType: true,
    //     provider: true,
    //     deletedAt: true,
    //     isActive: true,
    //     createdAt: true
    //   }
    // });

    // 임시로 빈 응답 반환 (실제로는 데이터베이스 조회)
    const existingUser = null;

    if (!existingUser) {
      return { exists: false };
    }

    // 탈퇴한 계정인지 확인
    const isDeleted = existingUser.deletedAt !== null;
    
    if (isDeleted) {
      // 3개월 경과 여부 확인
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const isExpired = existingUser.deletedAt < threeMonthsAgo;
      
      if (isExpired) {
        // 3개월이 지난 계정은 완전 삭제 처리
        await permanentDeleteUser(existingUser.id);
        return { exists: false };
      }

      return {
        exists: true,
        isDeleted: true,
        account: {
          id: existingUser.id,
          email: maskEmail(existingUser.email),
          userType: existingUser.userType,
          provider: existingUser.provider,
          deletedAt: existingUser.deletedAt,
          daysUntilExpiry: Math.ceil(
            (existingUser.deletedAt.getTime() + (90 * 24 * 60 * 60 * 1000) - Date.now()) / 
            (24 * 60 * 60 * 1000)
          )
        }
      };
    }

    return {
      exists: true,
      isDeleted: false,
      account: existingUser
    };

  } catch (error) {
    console.error('Error checking user exists:', error);
    throw error;
  }
}

export async function createUser(userData: any) {
  // 실제 구현에서는 데이터베이스 연결 사용
  // return await db.users.create({
  //   data: {
  //     ...userData,
  //     id: generateUserId(),
  //     createdAt: new Date(),
  //     isActive: true
  //   }
  // });

  return {
    id: generateUserId(),
    ...userData,
    createdAt: new Date(),
    isActive: true
  };
}

export async function createVeterinarianProfile(profileData: any) {
  // 실제 구현에서는 데이터베이스 연결 사용
  // return await db.veterinarianProfiles.create({
  //   data: {
  //     ...profileData,
  //     id: generateProfileId(),
  //     createdAt: new Date()
  //   }
  // });

  return {
    id: generateProfileId(),
    ...profileData,
    createdAt: new Date()
  };
}

export async function generateTokens(user: any) {
  // JWT 토큰 생성 로직
  return {
    accessToken: "sample_access_token_" + user.id,
    refreshToken: "sample_refresh_token_" + user.id,
    expiresIn: 3600
  };
}

async function permanentDeleteUser(userId: string) {
  // 3개월이 지난 탈퇴 계정의 완전 삭제
  // await db.users.delete({
  //   where: { id: userId }
  // });
  
  // 관련 데이터도 완전 삭제
  // await db.veterinarianProfiles.deleteMany({
  //   where: { userId }
  // });
}

function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.slice(0, 2) + '*'.repeat(username.length - 2)
    : username;
  return `${maskedUsername}@${domain}`;
}

function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

function generateProfileId(): string {
  return 'profile_' + Math.random().toString(36).substr(2, 9);
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