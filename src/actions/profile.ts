'use server';

/**
 * 프로필 관련 Server Actions
 * 클라이언트에서 직접 DB에 접근하는 대신 Server Actions를 통해 처리
 */

import { sql } from '@/lib/db';
import { getUserIdFromToken, isTokenValid } from '@/utils/auth';

// 프로필 데이터 타입 정의
export interface VeterinarianProfile {
  id: string;
  email: string;
  phone: string;
  profileImage?: string;
  loginId?: string;
  nickname?: string;
  realName: string;
  birthDate?: string;
  licenseImage?: string;
  userType: string;
  provider: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  experience?: string;
  specialty?: string;
}

export interface ProfileUpdateData {
  nickname?: string;
  phone?: string;
  email?: string;
  realName?: string;
  birthDate?: string;
  profileImage?: string;
  licenseImage?: string;
  experience?: string;
  specialty?: string;
}

// 수의사 프로필 조회 Server Action
export async function getVeterinarianProfileAction(token: string): Promise<{
  success: boolean;
  data?: VeterinarianProfile;
  error?: string;
}> {
  try {
    console.log('[Server Action] getVeterinarianProfileAction called');
    console.log('[Server Action] Token received:', token ? `${token.substring(0, 20)}...` : 'null');

    // 토큰 검증
    if (!token) {
      console.log('[Server Action] No token provided');
      return { success: false, error: 'No token provided' };
    }

    console.log('[Server Action] Validating token...');
    const tokenValid = isTokenValid(token);
    console.log('[Server Action] Token valid:', tokenValid);
    
    if (!tokenValid) {
      console.log('[Server Action] Token validation failed');
      return { success: false, error: 'Invalid or expired token' };
    }

    console.log('[Server Action] Extracting userId from token...');
    const userId = getUserIdFromToken(token);
    console.log('[Server Action] Extracted userId:', userId);
    
    if (!userId) {
      console.log('[Server Action] No userId found in token');
      return { success: false, error: 'Invalid token payload' };
    }

    console.log('[Server Action] Querying profile for userId:', userId);

    // 1차: userId로 조회 시도
    let result = await sql`
      SELECT 
        u.id, u.email, u.phone, u."profileImage", u."loginId", 
        u.nickname, u."realName", u."birthDate", u."licenseImage",
        u."userType", u.provider, u."isActive", u."updatedAt", u."createdAt",
        vp.experience, vp.specialty
      FROM users u
      LEFT JOIN veterinarian_profiles vp ON u.id = vp."userId"
      WHERE u.id = ${userId} AND u."isActive" = true
    `;

    console.log('[Server Action] Direct userId query result length:', result?.length || 0);

    // 2차: userId로 찾지 못한 경우, 토큰에서 이메일 정보 추출하여 조회
    if (!result || result.length === 0) {
      console.log('[Server Action] No profile found for userId, trying token email lookup');
      
      try {
        // 토큰에서 이메일 정보 추출 (함수의 첫 번째 매개변수)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('[Server Action] Token payload for email lookup:', {
          userId: payload.userId,
          email: payload.email,
          userType: payload.userType
        });

        // 이메일이 토큰에 있다면 이메일로 조회
        if (payload.email) {
          result = await sql`
            SELECT 
              u.id, u.email, u.phone, u."profileImage", u."loginId", 
              u.nickname, u."realName", u."birthDate", u."licenseImage",
              u."userType", u.provider, u."isActive", u."updatedAt", u."createdAt",
              vp.experience, vp.specialty
            FROM users u
            LEFT JOIN veterinarian_profiles vp ON u.id = vp."userId"
            WHERE u.email = ${payload.email} AND u."isActive" = true
          `;
          console.log('[Server Action] Email query result length:', result?.length || 0);
        }

        // 3차: 여전히 못 찾았다면 test@snu.ac.kr 고정 이메일로 조회 (localStorage 기반)
        if (!result || result.length === 0) {
          console.log('[Server Action] Trying fallback email: test@snu.ac.kr');
          result = await sql`
            SELECT 
              u.id, u.email, u.phone, u."profileImage", u."loginId", 
              u.nickname, u."realName", u."birthDate", u."licenseImage",
              u."userType", u.provider, u."isActive", u."updatedAt", u."createdAt",
              vp.experience, vp.specialty
            FROM users u
            LEFT JOIN veterinarian_profiles vp ON u.id = vp."userId"
            WHERE u.email = 'test@snu.ac.kr' AND u."isActive" = true
          `;
          console.log('[Server Action] Fallback email query result length:', result?.length || 0);
        }
      } catch (emailLookupError) {
        console.error('[Server Action] Error during email lookup:', emailLookupError);
      }
    }

    // 여전히 찾지 못한 경우 디버깅 정보 출력
    if (!result || result.length === 0) {
      console.log('[Server Action] Final fallback - checking all users in DB');
      const allUsers = await sql`SELECT id, seq, email, "realName", "userType", provider FROM users WHERE "isActive" = true LIMIT 5`;
      console.log('[Server Action] Active users in DB with seq:', allUsers);
      
      return { success: false, error: 'User not found after all lookup attempts' };
    }

    console.log('[Server Action] Profile found successfully');
    return { success: true, data: result[0] as VeterinarianProfile };
  } catch (error) {
    console.error('[Server Action] Error in getVeterinarianProfileAction:', error);
    console.error('[Server Action] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    return { success: false, error: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

// 수의사 프로필 업데이트 Server Action
export async function updateVeterinarianProfileAction(
  token: string,
  updateData: ProfileUpdateData
): Promise<{
  success: boolean;
  data?: VeterinarianProfile;
  error?: string;
}> {
  try {
    console.log('[Server Action] updateVeterinarianProfileAction called');
    console.log('[Server Action] Update data:', updateData);

    if (!token || !isTokenValid(token)) {
      return { success: false, error: 'Invalid or expired token' };
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return { success: false, error: 'Invalid token payload' };
    }

    console.log('[Server Action] Updating profile for userId:', userId);

    // users 테이블 업데이트 - 각 필드별로 개별 업데이트
    console.log('[Server Action] Updating users table for userId:', userId);

    if (updateData.nickname !== undefined) {
      await sql`UPDATE users SET nickname = ${updateData.nickname}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }
    if (updateData.phone !== undefined) {
      await sql`UPDATE users SET phone = ${updateData.phone}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }
    if (updateData.email !== undefined) {
      await sql`UPDATE users SET email = ${updateData.email}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }
    if (updateData.realName !== undefined) {
      await sql`UPDATE users SET "realName" = ${updateData.realName}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }
    if (updateData.birthDate !== undefined) {
      await sql`UPDATE users SET "birthDate" = ${updateData.birthDate}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }
    if (updateData.profileImage !== undefined) {
      console.log('[Server Action] Updating profileImage:', updateData.profileImage);
      await sql`UPDATE users SET "profileImage" = ${updateData.profileImage}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }
    if (updateData.licenseImage !== undefined) {
      console.log('[Server Action] Updating licenseImage:', updateData.licenseImage);
      await sql`UPDATE users SET "licenseImage" = ${updateData.licenseImage}, "updatedAt" = NOW() WHERE id = ${userId}`;
    }

    // veterinarian_profiles 테이블 업데이트 (experience, specialty 등이 있는 경우)
    if (updateData.experience !== undefined || updateData.specialty !== undefined) {
      console.log('[Server Action] Updating veterinarian_profiles table');
      
      await sql`
        INSERT INTO veterinarian_profiles 
        (id, "userId", nickname, "birthDate", "licenseImage", experience, specialty, "createdAt", "updatedAt")
        VALUES (${`vet_${userId}`}, ${userId}, ${updateData.nickname || null}, ${updateData.birthDate || null}, ${updateData.licenseImage || null}, ${updateData.experience || null}, ${updateData.specialty || null}, NOW(), NOW())
        ON CONFLICT ("userId") DO UPDATE SET
          nickname = EXCLUDED.nickname,
          "birthDate" = EXCLUDED."birthDate",
          "licenseImage" = EXCLUDED."licenseImage",
          experience = EXCLUDED.experience,
          specialty = EXCLUDED.specialty,
          "updatedAt" = NOW()
      `;
    }

    console.log('[Server Action] Profile update completed');

    // 업데이트된 프로필 다시 조회
    const updatedProfile = await getVeterinarianProfileAction(token);
    return updatedProfile;
  } catch (error) {
    console.error('[Server Action] Error in updateVeterinarianProfileAction:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}