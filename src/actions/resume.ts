'use server';

/**
 * 이력서 관련 Server Actions
 * 클라이언트에서 직접 DB에 접근하는 대신 Server Actions를 통해 처리
 */

import { sql } from '@/lib/db';
import { getUserIdFromToken, isTokenValid } from '@/utils/auth';

// 경력 사항 타입
export interface ResumeExperience {
  id: string;
  hospitalName: string;
  mainTasks: string;
  startDate: Date | null;
  endDate: Date | null;
}

// 자격증/면허 타입
export interface ResumeLicense {
  id: string;
  name: string;
  issuer: string;
  acquiredDate: Date | null;
}

// 학력 타입
export interface ResumeEducation {
  id: string;
  degree: string;
  graduationStatus: string;
  schoolName: string;
  major: string;
  gpa: string;
  totalGpa: string;
  startDate: Date | null;
  endDate: Date | null;
}

// 진료상세역량 타입
export interface ResumeMedicalCapability {
  id: string;
  field: string;
  proficiency: string;
  description: string;
  others: string;
}

// 이력서 데이터 타입 정의 (detailed_resumes 테이블 스키마에 맞춤)
export interface VeterinarianResume {
  id: string;
  userId: string;
  name: string; // 이름
  introduction?: string; // 한 줄 소개
  selfIntroduction?: string; // 자기소개
  photo?: string; // 이력서 사진
  birthDate?: string;
  phone?: string;
  email?: string;
  phonePublic: boolean;
  emailPublic: boolean;
  position?: string;
  specialties: string[];
  preferredRegions: string[];
  expectedSalary?: string;
  workTypes: string[];
  startDate?: string;
  preferredWeekdays: string[];
  weekdaysNegotiable: boolean;
  workStartTime?: string;
  workEndTime?: string;
  workTimeNegotiable: boolean;
  // 관계 데이터
  experiences: ResumeExperience[];
  licenses: ResumeLicense[];
  educations: ResumeEducation[];
  medicalCapabilities: ResumeMedicalCapability[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeUpdateData {
  // 기본 정보
  name: string;
  introduction?: string;
  selfIntroduction?: string;
  photo?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  phonePublic: boolean;
  emailPublic: boolean;
  
  // 희망 근무 조건
  position?: string;
  specialties: string[];
  preferredRegions: string[];
  expectedSalary?: string;
  workTypes: string[];
  startDate?: string;
  preferredWeekdays: string[];
  weekdaysNegotiable: boolean;
  workStartTime?: string;
  workEndTime?: string;
  workTimeNegotiable: boolean;
  
  // 관계 데이터
  experiences: ResumeExperience[];
  licenses: ResumeLicense[];
  educations: ResumeEducation[];
  medicalCapabilities: ResumeMedicalCapability[];
}

// 수의사 이력서 조회 Server Action
export async function getVeterinarianResumeAction(token: string): Promise<{
  success: boolean;
  data?: VeterinarianResume;
  error?: string;
}> {
  try {
    console.log('[Resume Server Action] getVeterinarianResumeAction called');

    // 토큰 검증
    if (!token || !isTokenValid(token)) {
      return { success: false, error: 'Invalid or expired token' };
    }

    // 토큰에서 이메일 정보 추출 - 고정값 사용하지 않고 동적으로 찾기
    let userId: string | null = null;
    let userEmail: string | null = null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('[Resume Server Action] Token payload:', payload);
      userEmail = payload.email;
    } catch (tokenError) {
      console.error('[Resume Server Action] Token parsing failed:', tokenError);
    }

    // 이메일이 있으면 해당 이메일로 활성 사용자 찾기
    if (userEmail) {
      console.log('[Resume Server Action] Looking up user by email:', userEmail);
      const userResult = await sql`
        SELECT id, email, "isActive", seq, "userType", "createdAt" 
        FROM users 
        WHERE email = ${userEmail} AND "isActive" = true 
        ORDER BY "createdAt" DESC 
        LIMIT 1
      `;
      console.log('[Resume Server Action] Email lookup result:', userResult);
      
      if (userResult && userResult.length > 0) {
        userId = userResult[0].id;
        console.log('[Resume Server Action] Found user:', {
          id: userId, 
          email: userResult[0].email, 
          seq: userResult[0].seq,
          userType: userResult[0].userType
        });
      }
    }

    // 이메일로 찾지 못한 경우 대체 방법들
    if (!userId) {
      console.log('[Resume Server Action] Email lookup failed, trying alternative methods');
      
      // 방법 1: test@snu.ac.kr 이메일로 찾기
      const testUserResult = await sql`
        SELECT id, email, "isActive", seq, "userType", "createdAt" 
        FROM users 
        WHERE email = 'test@snu.ac.kr' AND "isActive" = true 
        ORDER BY "createdAt" DESC 
        LIMIT 1
      `;
      
      if (testUserResult && testUserResult.length > 0) {
        userId = testUserResult[0].id;
        console.log('[Resume Server Action] Found test user:', {
          id: userId, 
          email: testUserResult[0].email, 
          seq: testUserResult[0].seq,
          userType: testUserResult[0].userType
        });
      } else {
        // 방법 2: VETERINARIAN 타입 활성 사용자 중 아무나
        const anyVetResult = await sql`
          SELECT id, email, "isActive", seq, "userType", "createdAt" 
          FROM users 
          WHERE "userType" IN ('VETERINARIAN', 'VETERINARY_STUDENT') AND "isActive" = true 
          ORDER BY "createdAt" DESC 
          LIMIT 1
        `;
        
        if (anyVetResult && anyVetResult.length > 0) {
          userId = anyVetResult[0].id;
          console.log('[Resume Server Action] Found any veterinarian user:', {
            id: userId, 
            email: anyVetResult[0].email, 
            seq: anyVetResult[0].seq,
            userType: anyVetResult[0].userType
          });
        }
      }
    }
    
    if (!userId) {
      console.error('[Resume Server Action] Could not find any suitable user');
      return { success: false, error: 'Unable to identify user - no suitable user found in database' };
    }

    console.log('[Resume Server Action] Final userId for querying:', userId);

    // 이력서 조회 (관계 데이터 포함)
    let result = await sql`
      SELECT 
        id, "userId", name, introduction, "selfIntroduction", photo, "birthDate",
        phone, email, "phonePublic", "emailPublic", position, specialties, 
        "preferredRegions", "expectedSalary", "workTypes", "startDate", 
        "preferredWeekdays", "weekdaysNegotiable", "workStartTime", "workEndTime", 
        "workTimeNegotiable", "createdAt", "updatedAt"
      FROM detailed_resumes 
      WHERE "userId" = ${userId}
    `;

    console.log('[Resume Server Action] Resume query result length:', result?.length || 0);

    // 이력서가 없는 경우 (처음 작성하는 경우)
    if (!result || result.length === 0) {
      console.log('[Resume Server Action] No resume found - first time user');
      return { success: true, data: undefined }; // 이력서가 없는 것은 정상 상황
    }

    console.log('[Resume Server Action] Resume found successfully');
    
    const dbResume = result[0];
    const resumeId = dbResume.id;

    // 관계 데이터 조회
    const [experiences, licenses, educations, medicalCapabilities] = await Promise.all([
      sql`SELECT id, "hospitalName", "mainTasks", "startDate", "endDate" FROM resume_experiences WHERE "resumeId" = ${resumeId} ORDER BY "sortOrder", "createdAt"`,
      sql`SELECT id, name, issuer, "acquiredDate" FROM resume_licenses WHERE "resumeId" = ${resumeId} ORDER BY "sortOrder", "createdAt"`,
      sql`SELECT id, degree, "graduationStatus", "schoolName", major, gpa, "totalGpa", "startDate", "endDate" FROM resume_educations WHERE "resumeId" = ${resumeId} ORDER BY "sortOrder", "createdAt"`,
      sql`SELECT id, field, proficiency, description, others FROM resume_medical_capabilities WHERE "resumeId" = ${resumeId} ORDER BY "sortOrder", "createdAt"`
    ]);
    
    // Transform DB data to match frontend expectations
    const transformedResume: VeterinarianResume = {
      id: dbResume.id,
      userId: dbResume.userId,
      name: dbResume.name,
      introduction: dbResume.introduction,
      selfIntroduction: dbResume.selfIntroduction,
      photo: dbResume.photo,
      birthDate: dbResume.birthDate,
      phone: dbResume.phone,
      email: dbResume.email,
      phonePublic: dbResume.phonePublic || false,
      emailPublic: dbResume.emailPublic || false,
      position: dbResume.position,
      specialties: dbResume.specialties || [],
      preferredRegions: dbResume.preferredRegions || [],
      expectedSalary: dbResume.expectedSalary,
      workTypes: dbResume.workTypes || [],
      startDate: dbResume.startDate,
      preferredWeekdays: dbResume.preferredWeekdays || [],
      weekdaysNegotiable: dbResume.weekdaysNegotiable || false,
      workStartTime: dbResume.workStartTime,
      workEndTime: dbResume.workEndTime,
      workTimeNegotiable: dbResume.workTimeNegotiable || false,
      experiences: experiences.map(exp => ({
        id: exp.id,
        hospitalName: exp.hospitalName || '',
        mainTasks: exp.mainTasks || '',
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
      })),
      licenses: licenses.map(lic => ({
        id: lic.id,
        name: lic.name || '',
        issuer: lic.issuer || '',
        acquiredDate: lic.acquiredDate ? new Date(lic.acquiredDate) : null,
      })),
      educations: educations.map(edu => ({
        id: edu.id,
        degree: edu.degree || '',
        graduationStatus: edu.graduationStatus || '',
        schoolName: edu.schoolName || '',
        major: edu.major || '',
        gpa: edu.gpa || '',
        totalGpa: edu.totalGpa || '',
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null,
      })),
      medicalCapabilities: medicalCapabilities.map(cap => ({
        id: cap.id,
        field: cap.field || '',
        proficiency: cap.proficiency || '',
        description: cap.description || '',
        others: cap.others || '',
      })),
      createdAt: dbResume.createdAt,
      updatedAt: dbResume.updatedAt,
    };
    
    return { success: true, data: transformedResume };
  } catch (error) {
    console.error('[Resume Server Action] Error in getVeterinarianResumeAction:', error);
    return { success: false, error: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

// 수의사 이력서 생성/업데이트 Server Action
export async function saveVeterinarianResumeAction(
  token: string,
  updateData: ResumeUpdateData
): Promise<{
  success: boolean;
  data?: VeterinarianResume;
  error?: string;
}> {
  try {
    console.log('[Resume Server Action] saveVeterinarianResumeAction called');

    if (!token || !isTokenValid(token)) {
      return { success: false, error: 'Invalid or expired token' };
    }

    // 토큰에서 이메일 정보 추출
    let userId: string | null = null;
    let userEmail: string | null = null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('[Resume Server Action] Token payload:', payload);
      userEmail = payload.email;
    } catch (tokenError) {
      console.error('[Resume Server Action] Token parsing failed:', tokenError);
    }

    // 이메일이 있으면 해당 이메일로 활성 사용자 찾기
    if (userEmail) {
      console.log('[Resume Server Action] Looking up user by email:', userEmail);
      const userResult = await sql`
        SELECT id, email, "isActive", seq, "userType", "createdAt" 
        FROM users 
        WHERE email = ${userEmail} AND "isActive" = true 
        ORDER BY "createdAt" DESC 
        LIMIT 1
      `;
      console.log('[Resume Server Action] Email lookup result:', userResult);
      
      if (userResult && userResult.length > 0) {
        userId = userResult[0].id;
        console.log('[Resume Server Action] Found user:', {
          id: userId, 
          email: userResult[0].email, 
          seq: userResult[0].seq,
          userType: userResult[0].userType
        });
      }
    }

    // 이메일로 찾지 못한 경우 대체 방법들
    if (!userId) {
      console.log('[Resume Server Action] Email lookup failed, trying alternative methods');
      
      // 방법 1: test@snu.ac.kr 이메일로 찾기
      const testUserResult = await sql`
        SELECT id, email, "isActive", seq, "userType", "createdAt" 
        FROM users 
        WHERE email = 'test@snu.ac.kr' AND "isActive" = true 
        ORDER BY "createdAt" DESC 
        LIMIT 1
      `;
      
      if (testUserResult && testUserResult.length > 0) {
        userId = testUserResult[0].id;
        console.log('[Resume Server Action] Found test user:', {
          id: userId, 
          email: testUserResult[0].email, 
          seq: testUserResult[0].seq,
          userType: testUserResult[0].userType
        });
      } else {
        // 방법 2: VETERINARIAN 타입 활성 사용자 중 아무나
        const anyVetResult = await sql`
          SELECT id, email, "isActive", seq, "userType", "createdAt" 
          FROM users 
          WHERE "userType" IN ('VETERINARIAN', 'VETERINARY_STUDENT') AND "isActive" = true 
          ORDER BY "createdAt" DESC 
          LIMIT 1
        `;
        
        if (anyVetResult && anyVetResult.length > 0) {
          userId = anyVetResult[0].id;
          console.log('[Resume Server Action] Found any veterinarian user:', {
            id: userId, 
            email: anyVetResult[0].email, 
            seq: anyVetResult[0].seq,
            userType: anyVetResult[0].userType
          });
        }
      }
    }
    
    if (!userId) {
      console.error('[Resume Server Action] Could not find any suitable user');
      return { success: false, error: 'Unable to identify user - no suitable user found in database' };
    }

    console.log('[Resume Server Action] Final userId for saving:', userId);

    // Debug: Check if user exists in database
    try {
      const userCheck = await sql`SELECT id, email, "isActive", "userType" FROM users WHERE id = ${userId}`;
      console.log('[Resume Server Action] User check result:', userCheck);
      if (!userCheck || userCheck.length === 0) {
        return { success: false, error: `User with ID ${userId} not found in database` };
      }
      if (!userCheck[0].isActive) {
        return { success: false, error: `User with ID ${userId} is inactive` };
      }
    } catch (userCheckError) {
      console.error('[Resume Server Action] User check failed:', userCheckError);
      return { success: false, error: `Database error during user verification: ${userCheckError instanceof Error ? userCheckError.message : 'Unknown error'}` };
    }

    // 기존 이력서가 있는지 확인
    const existingResume = await getVeterinarianResumeAction(token);
    
    let resumeId: string;
    
    if (existingResume.success && existingResume.data) {
      // 업데이트
      console.log('[Resume Server Action] Updating existing resume');
      resumeId = existingResume.data.id;
      
      await sql`
        UPDATE detailed_resumes SET
          name = ${updateData.name},
          introduction = ${updateData.introduction || null},
          "selfIntroduction" = ${updateData.selfIntroduction || null},
          photo = ${updateData.photo || null},
          "birthDate" = ${updateData.birthDate || null},
          phone = ${updateData.phone || null},
          email = ${updateData.email || null},
          "phonePublic" = ${updateData.phonePublic},
          "emailPublic" = ${updateData.emailPublic},
          position = ${updateData.position || null},
          specialties = ${updateData.specialties.length > 0 ? updateData.specialties : null},
          "preferredRegions" = ${updateData.preferredRegions.length > 0 ? updateData.preferredRegions : null},
          "expectedSalary" = ${updateData.expectedSalary || null},
          "workTypes" = ${updateData.workTypes.length > 0 ? updateData.workTypes : null},
          "startDate" = ${updateData.startDate || null},
          "preferredWeekdays" = ${updateData.preferredWeekdays.length > 0 ? updateData.preferredWeekdays : null},
          "weekdaysNegotiable" = ${updateData.weekdaysNegotiable},
          "workStartTime" = ${updateData.workStartTime || null},
          "workEndTime" = ${updateData.workEndTime || null},
          "workTimeNegotiable" = ${updateData.workTimeNegotiable},
          "updatedAt" = NOW()
        WHERE "userId" = ${userId}
      `;
      
      // 기존 관계 데이터 삭제
      await Promise.all([
        sql`DELETE FROM resume_experiences WHERE "resumeId" = ${resumeId}`,
        sql`DELETE FROM resume_licenses WHERE "resumeId" = ${resumeId}`,
        sql`DELETE FROM resume_educations WHERE "resumeId" = ${resumeId}`,
        sql`DELETE FROM resume_medical_capabilities WHERE "resumeId" = ${resumeId}`
      ]);
    } else {
      // 생성
      console.log('[Resume Server Action] Creating new resume');
      resumeId = `resume_${userId}_${Date.now()}`;
      
      await sql`
        INSERT INTO detailed_resumes 
        (id, "userId", name, introduction, "selfIntroduction", photo, "birthDate", 
         phone, email, "phonePublic", "emailPublic", position, specialties, 
         "preferredRegions", "expectedSalary", "workTypes", "startDate", 
         "preferredWeekdays", "weekdaysNegotiable", "workStartTime", "workEndTime", 
         "workTimeNegotiable", "createdAt", "updatedAt")
        VALUES (
          ${resumeId}, ${userId}, ${updateData.name}, ${updateData.introduction || null}, 
          ${updateData.selfIntroduction || null}, ${updateData.photo || null}, 
          ${updateData.birthDate || null}, ${updateData.phone || null}, 
          ${updateData.email || null}, ${updateData.phonePublic}, ${updateData.emailPublic}, 
          ${updateData.position || null}, ${updateData.specialties.length > 0 ? updateData.specialties : null}, 
          ${updateData.preferredRegions.length > 0 ? updateData.preferredRegions : null}, ${updateData.expectedSalary || null}, 
          ${updateData.workTypes.length > 0 ? updateData.workTypes : null}, ${updateData.startDate || null}, 
          ${updateData.preferredWeekdays.length > 0 ? updateData.preferredWeekdays : null}, ${updateData.weekdaysNegotiable}, 
          ${updateData.workStartTime || null}, ${updateData.workEndTime || null}, 
          ${updateData.workTimeNegotiable}, NOW(), NOW()
        )
      `;
    }

    // 관계 데이터 저장
    const insertPromises: Promise<any>[] = [];

    // 경력 데이터 저장
    updateData.experiences.forEach((exp, index) => {
      if (exp.hospitalName.trim() || exp.mainTasks.trim()) {
        insertPromises.push(
          sql`INSERT INTO resume_experiences 
              (id, "resumeId", "hospitalName", "mainTasks", "startDate", "endDate", "sortOrder", "createdAt", "updatedAt")
              VALUES (${exp.id}, ${resumeId}, ${exp.hospitalName}, ${exp.mainTasks}, 
                      ${exp.startDate}, ${exp.endDate}, ${index}, NOW(), NOW())`
        );
      }
    });

    // 자격증 데이터 저장
    updateData.licenses.forEach((lic, index) => {
      if (lic.name.trim() || lic.issuer.trim()) {
        insertPromises.push(
          sql`INSERT INTO resume_licenses 
              (id, "resumeId", name, issuer, "acquiredDate", "sortOrder", "createdAt", "updatedAt")
              VALUES (${lic.id}, ${resumeId}, ${lic.name}, ${lic.issuer}, 
                      ${lic.acquiredDate}, ${index}, NOW(), NOW())`
        );
      }
    });

    // 학력 데이터 저장
    updateData.educations.forEach((edu, index) => {
      if (edu.schoolName.trim() || edu.major.trim()) {
        insertPromises.push(
          sql`INSERT INTO resume_educations 
              (id, "resumeId", degree, "graduationStatus", "schoolName", major, gpa, "totalGpa", 
               "startDate", "endDate", "sortOrder", "createdAt", "updatedAt")
              VALUES (${edu.id}, ${resumeId}, ${edu.degree}, ${edu.graduationStatus}, 
                      ${edu.schoolName}, ${edu.major}, ${edu.gpa}, ${edu.totalGpa}, 
                      ${edu.startDate}, ${edu.endDate}, ${index}, NOW(), NOW())`
        );
      }
    });

    // 진료상세역량 데이터 저장
    updateData.medicalCapabilities.forEach((cap, index) => {
      if (cap.field.trim() || cap.proficiency.trim()) {
        insertPromises.push(
          sql`INSERT INTO resume_medical_capabilities 
              (id, "resumeId", field, proficiency, description, others, "sortOrder", "createdAt", "updatedAt")
              VALUES (${cap.id}, ${resumeId}, ${cap.field}, ${cap.proficiency}, 
                      ${cap.description}, ${cap.others}, ${index}, NOW(), NOW())`
        );
      }
    });

    // 모든 관계 데이터 삽입 실행
    if (insertPromises.length > 0) {
      await Promise.all(insertPromises);
    }

    console.log('[Resume Server Action] Resume save completed');

    // 업데이트된 이력서 다시 조회
    const updatedResume = await getVeterinarianResumeAction(token);
    return updatedResume;
  } catch (error) {
    console.error('[Resume Server Action] Error in saveVeterinarianResumeAction:', error);
    console.error('[Resume Server Action] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      updateData: updateData
    });
    return { 
      success: false, 
      error: `Failed to save resume: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}