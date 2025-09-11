import { Pool } from "pg";
import { sql } from "@/lib/db";

// Type definitions
type NotificationType = 
  | 'application_status'
  | 'job_application'
  | 'bookmark_added'
  | 'profile_view'
  | 'message'
  | 'system'
  | 'evaluation_received'
  | 'job_posted'
  | 'interview_scheduled';

type ApplicationStatus = 
  | 'document_pending'
  | 'document_passed'
  | 'document_failed'
  | 'interview_pending'
  | 'interview_passed'
  | 'interview_failed'
  | 'final_pending'
  | 'final_passed'
  | 'final_failed';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const getUserByEmail = async (email: string, userType?: string) => {
  const query = userType
    ? "SELECT * FROM users WHERE email = $1 AND user_type = $2"
    : "SELECT * FROM users WHERE email = $1";

  const params = userType ? [email, userType] : [email];
  const result = await pool.query(query, params);

  return result.rows[0] || null;
};

export const createUser = async (userData: any) => {
  const query = `
    INSERT INTO users (username, email, password_hash, user_type, phone, profile_image, 
                      terms_agreed_at, privacy_agreed_at, marketing_agreed_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    userData.username,
    userData.email,
    userData.passwordHash,
    userData.userType,
    userData.phone,
    userData.profileImage,
    userData.termsAgreedAt,
    userData.privacyAgreedAt,
    userData.marketingAgreedAt,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const createVeterinarianProfile = async (profileData: any) => {
  const query = `
    INSERT INTO veterinarians (user_id, nickname, birth_date, license_image)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    profileData.userId,
    profileData.nickname,
    profileData.birthDate,
    profileData.licenseImage,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const createHospitalProfile = async (profileData: any) => {
  const query = `
    INSERT INTO hospitals (user_id, hospital_name, business_number, address, detail_address,
                          website, logo_image, facility_images, treatable_animals, medical_fields,
                          business_registration, founded_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;

  const values = [
    profileData.userId,
    profileData.hospitalName,
    profileData.businessNumber,
    profileData.address,
    profileData.detailAddress,
    profileData.website,
    profileData.logoImage,
    profileData.facilityImages,
    profileData.treatableAnimals,
    profileData.medicalFields,
    profileData.businessRegistration,
    profileData.foundedDate,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getJobsWithPagination = async (params: any) => {
  let query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.is_active = true AND j.is_public = true
  `;

  const queryParams: any[] = [];
  let paramCount = 0;

  // 키워드 검색
  if (params.keyword) {
    paramCount++;
    query += ` AND (j.title ILIKE ${paramCount} OR j.description ILIKE ${paramCount} OR h.hospital_name ILIKE ${paramCount})`;
    queryParams.push(`%${params.keyword}%`);
  }

  // 근무 형태 필터
  if (params.workType) {
    paramCount++;
    query += ` AND j.work_type = ${paramCount}`;
    queryParams.push(params.workType);
  }

  // 경력 필터
  if (params.experience) {
    paramCount++;
    query += ` AND j.required_experience = ${paramCount}`;
    queryParams.push(params.experience);
  }

  // 지역 필터
  if (params.region) {
    paramCount++;
    query += ` AND h.address ILIKE ${paramCount}`;
    queryParams.push(`%${params.region}%`);
  }

  // 정렬
  switch (params.sort) {
    case "latest":
      query += " ORDER BY j.created_at DESC";
      break;
    case "oldest":
      query += " ORDER BY j.created_at ASC";
      break;
    case "view":
      query += " ORDER BY j.view_count DESC";
      break;
    case "deadline":
      query += " ORDER BY j.deadline ASC NULLS LAST";
      break;
    default:
      query += " ORDER BY j.created_at DESC";
  }

  // 페이지네이션
  const offset = (params.page - 1) * params.limit;
  paramCount += 2;
  query += ` LIMIT ${paramCount - 1} OFFSET ${paramCount}`;
  queryParams.push(params.limit, offset);

  const result = await pool.query(query, queryParams);

  // 전체 개수 조회
  let countQuery = `
    SELECT COUNT(*) as total
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.is_active = true AND j.is_public = true
  `;

  const countParams: any[] = [];
  let countParamCount = 0;

  if (params.keyword) {
    countParamCount++;
    countQuery += ` AND (j.title ILIKE ${countParamCount} OR j.description ILIKE ${countParamCount} OR h.hospital_name ILIKE ${countParamCount})`;
    countParams.push(`%${params.keyword}%`);
  }

  if (params.workType) {
    countParamCount++;
    countQuery += ` AND j.work_type = ${countParamCount}`;
    countParams.push(params.workType);
  }

  const countResult = await pool.query(countQuery, countParams);

  return {
    jobs: result.rows,
    totalCount: parseInt(countResult.rows[0].total),
  };
};

export const getJobById = async (jobId: string) => {
  const query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address, h.detail_address,
           h.website, h.phone as hospital_phone, h.medical_fields as hospital_medical_fields
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.id = $1 AND j.is_active = true
  `;

  const result = await pool.query(query, [jobId]);
  return result.rows[0] || null;
};

// ============================================================================
// 사용자 관련 헬퍼 함수들
// ============================================================================

export const updateLastLogin = async (userId: string): Promise<void> => {
  const query =
    "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1";
  await pool.query(query, [userId]);
};

export const checkUserExists = async (
  email: string,
  phone: string,
  username: string
) => {
  const query = `
    SELECT u.id, u.email, u.phone, u.username, u.deleted_at, u.user_type,
           CASE 
             WHEN u.user_type = 'veterinarian' THEN v.nickname
             WHEN u.user_type = 'hospital' THEN h.hospital_name
           END as display_name
    FROM users u
    LEFT JOIN veterinarians v ON u.id = v.user_id
    LEFT JOIN hospitals h ON u.id = h.user_id
    WHERE u.email = $1 OR u.phone = $2 OR u.username = $3
  `;

  const result = await pool.query(query, [email, phone, username]);

  if (result.rows.length === 0) {
    return { exists: false };
  }

  const user = result.rows[0];
  return {
    exists: true,
    isDeleted: !!user.deleted_at,
    account: user.deleted_at
      ? {
          userType: user.user_type,
          username: user.username,
          email: user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // 이메일 마스킹
          deletedAt: user.deleted_at,
          deletedPeriod: calculatePeriod(user.deleted_at),
          daysUntilPermanentDeletion: calculateDaysUntilPermanentDeletion(
            user.deleted_at
          ),
          newAccountAvailableDate: calculateNewAccountAvailableDate(
            user.deleted_at
          ),
          evaluationSummary: await getEvaluationSummary(
            user.id,
            user.user_type
          ),
        }
      : null,
  };
};

export const checkBusinessNumberExists = async (
  businessNumber: string
): Promise<boolean> => {
  const query =
    "SELECT id FROM hospitals WHERE business_number = $1 AND deleted_at IS NULL";
  const result = await pool.query(query, [businessNumber]);
  return result.rows.length > 0;
};

export const checkPhoneRestriction = async (phone: string) => {
  const query = `
    SELECT deleted_at, deletion_attempt_count
    FROM users 
    WHERE phone = $1 AND deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [phone]);

  if (result.rows.length === 0) {
    return { isRestricted: false };
  }

  const user = result.rows[0];
  const deletedAt = new Date(user.deleted_at);
  const restrictionEndDate = new Date(deletedAt);
  restrictionEndDate.setDate(restrictionEndDate.getDate() + 90); // 3개월 제한

  const now = new Date();
  const isRestricted = now < restrictionEndDate;

  return {
    isRestricted,
    restriction: isRestricted
      ? {
          deletedAt: user.deleted_at,
          daysRemaining: Math.ceil(
            (restrictionEndDate.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          canRecoverInstead: true,
          evaluationsWillBeRestored: true,
        }
      : null,
  };
};

// ============================================================================
// 날짜 및 시간 헬퍼 함수들
// ============================================================================

const calculatePeriod = (deletedAt: string): string => {
  const deleted = new Date(deletedAt);
  const now = new Date();
  const diffTime = now.getTime() - deleted.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    return `${diffHours}시간 전`;
  } else if (diffDays < 30) {
    return `${diffDays}일 전`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}개월 전`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears}년 전`;
  }
};

const calculateDaysUntilPermanentDeletion = (deletedAt: string): number => {
  const deleted = new Date(deletedAt);
  const permanentDeletionDate = new Date(deleted);
  permanentDeletionDate.setDate(permanentDeletionDate.getDate() + 90); // 3개월 후 영구 삭제

  const now = new Date();
  const diffTime = permanentDeletionDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

const calculateNewAccountAvailableDate = (deletedAt: string): string => {
  const deleted = new Date(deletedAt);
  const availableDate = new Date(deleted);
  availableDate.setDate(availableDate.getDate() + 90); // 3개월 후 새 계정 생성 가능

  return availableDate.toISOString();
};

// ============================================================================
// 평가 관련 헬퍼 함수들
// ============================================================================

const getEvaluationSummary = async (userId: string, userType: string) => {
  if (userType === "veterinarian") {
    const query = `
      SELECT 
        COUNT(*) as total,
        AVG(overall_rating) as average_rating,
        COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive,
        COUNT(CASE WHEN overall_rating <= 2 THEN 1 END) as negative
      FROM veterinarian_evaluations ve
      JOIN veterinarians v ON ve.veterinarian_id = v.id
      WHERE v.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const row = result.rows[0];

    return {
      positive: parseInt(row.positive) || 0,
      negative: parseInt(row.negative) || 0,
      total: parseInt(row.total) || 0,
      averageRating: parseFloat(row.average_rating) || 0,
    };
  } else {
    const query = `
      SELECT 
        COUNT(*) as total,
        AVG(overall_rating) as average_rating,
        COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive,
        COUNT(CASE WHEN overall_rating <= 2 THEN 1 END) as negative
      FROM hospital_evaluations he
      JOIN hospitals h ON he.hospital_id = h.id
      WHERE h.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const row = result.rows[0];

    return {
      positive: parseInt(row.positive) || 0,
      negative: parseInt(row.negative) || 0,
      total: parseInt(row.total) || 0,
      averageRating: parseFloat(row.average_rating) || 0,
    };
  }
};

// ============================================================================
// 해시태그 생성 함수들
// ============================================================================

export const generateHashtags = (profile: any): string[] => {
  const hashtags: string[] = [];

  if (profile.medical_field) {
    const fieldMap: Record<string, string> = {
      internal: "내과",
      surgery: "외과",
      dermatology: "피부과",
      dental: "치과",
      ophthalmology: "안과",
      emergency: "응급의학과",
    };
    hashtags.push(
      `#${fieldMap[profile.medical_field] || profile.medical_field}`
    );
  }

  if (profile.preferred_work_type) {
    const workTypeMap: Record<string, string> = {
      full_time: "정규직",
      part_time: "파트타임",
      contract: "계약직",
      internship: "인턴십",
    };
    hashtags.push(
      `#${
        workTypeMap[profile.preferred_work_type] || profile.preferred_work_type
      }`
    );
  }

  if (profile.total_experience) {
    hashtags.push(`#경력${profile.total_experience}`);
  }

  if (profile.preferred_regions && profile.preferred_regions.length > 0) {
    hashtags.push(`#${profile.preferred_regions[0]}`);
  }

  return hashtags.slice(0, 4); // 최대 4개 해시태그
};

export const generateHospitalHashtags = (hospital: any): string[] => {
  const hashtags: string[] = [];

  if (hospital.medical_fields && hospital.medical_fields.length > 0) {
    const fieldMap: Record<string, string> = {
      internal: "내과",
      surgery: "외과",
      dermatology: "피부과",
      dental: "치과",
      ophthalmology: "안과",
      emergency: "응급의학과",
    };
    hashtags.push(
      `#${fieldMap[hospital.medical_fields[0]] || hospital.medical_fields[0]}`
    );
  }

  if (hospital.treatable_animals && hospital.treatable_animals.length > 0) {
    const animalMap: Record<string, string> = {
      dog: "강아지",
      cat: "고양이",
      special: "특수동물",
      large: "대동물",
    };
    hospital.treatable_animals.forEach((animal: string) => {
      if (hashtags.length < 4) {
        hashtags.push(`#${animalMap[animal] || animal}`);
      }
    });
  }

  if (hospital.address) {
    const region = hospital.address.split(" ")[0];
    hashtags.push(`#${region}`);
  }

  return hashtags.slice(0, 4);
};

// ============================================================================
// 채용공고 관련 헬퍼 함수들
// ============================================================================

export const incrementJobViewCount = async (
  jobId: string,
  userIdentifier: string,
  userId?: string
): Promise<boolean> => {
  return incrementViewCount('job', jobId, userIdentifier, userId);
};

export const incrementJobApplicantCount = async (
  jobId: string
): Promise<void> => {
  const query =
    "UPDATE job_postings SET applicant_count = applicant_count + 1 WHERE id = $1";
  await pool.query(query, [jobId]);
};

export const getRelatedJobs = async (
  jobId: string,
  medicalField?: string,
  limit: number = 5
) => {
  let query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.id != $1 AND j.is_active = true AND j.is_public = true
  `;

  const params = [jobId];

  if (medicalField) {
    query += ` AND j.medical_field = $2`;
    params.push(medicalField);
    query += ` ORDER BY j.created_at DESC LIMIT $3`;
    params.push(limit.toString());
  } else {
    query += ` ORDER BY j.view_count DESC, j.created_at DESC LIMIT $2`;
    params.push(limit.toString());
  }

  const result = await pool.query(query, params);
  return result.rows;
};

export const getPopularJobs = async (limit: number = 10) => {
  const query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.is_active = true AND j.is_public = true
    ORDER BY j.view_count DESC, j.applicant_count DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};

export const getRecentJobs = async (limit: number = 10) => {
  const query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.is_active = true AND j.is_public = true
    ORDER BY j.created_at DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};

// ============================================================================
// 인재정보 관련 헬퍼 함수들
// ============================================================================

export const incrementResumeViewCount = async (
  veterinarianId: string,
  userIdentifier: string,
  userId?: string
): Promise<boolean> => {
  return incrementViewCount('resume', veterinarianId, userIdentifier, userId);
};

export const getResumesWithPagination = async (params: any) => {
  let query = `
    SELECT v.*, u.email, u.phone, u.profile_image, u.last_login_at,
           COUNT(DISTINCT ve.id) as evaluation_count,
           AVG(ve.overall_rating) as average_rating
    FROM veterinarians v
    JOIN users u ON v.user_id = u.id
    LEFT JOIN veterinarian_evaluations ve ON v.id = ve.veterinarian_id
    WHERE v.is_profile_public = true AND u.deleted_at IS NULL
  `;

  const queryParams: any[] = [];
  let paramCount = 0;

  // 키워드 검색
  if (params.keyword) {
    paramCount++;
    query += ` AND (v.nickname ILIKE $${paramCount} OR v.introduction ILIKE $${paramCount} OR v.self_introduction ILIKE $${paramCount})`;
    queryParams.push(`%${params.keyword}%`);
  }

  // 근무 형태 필터
  if (params.workType) {
    paramCount++;
    query += ` AND v.preferred_work_type = $${paramCount}`;
    queryParams.push(params.workType);
  }

  // 경력 필터
  if (params.experience) {
    paramCount++;
    query += ` AND v.total_experience = $${paramCount}`;
    queryParams.push(params.experience);
  }

  // 지역 필터
  if (params.region) {
    paramCount++;
    query += ` AND $${paramCount} = ANY(v.preferred_regions)`;
    queryParams.push(params.region);
  }

  query += " GROUP BY v.id, u.id";

  // 정렬
  switch (params.sort) {
    case "latest":
      query += " ORDER BY v.updated_at DESC";
      break;
    case "oldest":
      query += " ORDER BY v.created_at ASC";
      break;
    case "view":
      query += " ORDER BY evaluation_count DESC, v.updated_at DESC";
      break;
    default:
      query += " ORDER BY v.updated_at DESC";
  }

  // 페이지네이션
  const offset = (params.page - 1) * params.limit;
  paramCount += 2;
  query += ` LIMIT $${paramCount - 1} OFFSET $${paramCount}`;
  queryParams.push(params.limit, offset);

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const getResumeById = async (veterinarianId: string) => {
  const query = `
    SELECT v.*, u.email, u.phone, u.profile_image, u.last_login_at,
           COUNT(DISTINCT ve.id) as evaluation_count,
           AVG(ve.overall_rating) as average_rating
    FROM veterinarians v
    JOIN users u ON v.user_id = u.id
    LEFT JOIN veterinarian_evaluations ve ON v.id = ve.veterinarian_id
    WHERE v.id = $1 AND u.deleted_at IS NULL
    GROUP BY v.id, u.id
  `;

  const result = await pool.query(query, [veterinarianId]);

  if (result.rows.length === 0) {
    return null;
  }

  const resume = result.rows[0];

  // 경력, 학력, 자격증, 기술 정보 조회
  const careers = await getVeterinarianCareers(veterinarianId);
  const educations = await getVeterinarianEducations(veterinarianId);
  const licenses = await getVeterinarianLicenses(veterinarianId);
  const skills = await getVeterinarianSkills(veterinarianId);
  const evaluations = await getVeterinarianEvaluations(veterinarianId);

  return {
    ...resume,
    careers,
    educations,
    licenses,
    skills,
    evaluations,
  };
};

export const getRelatedTalents = async (
  veterinarianId: string,
  medicalField?: string,
  limit: number = 5
) => {
  let query = `
    SELECT v.*, u.profile_image, u.last_login_at
    FROM veterinarians v
    JOIN users u ON v.user_id = u.id
    WHERE v.id != $1 AND v.is_profile_public = true AND u.deleted_at IS NULL
  `;

  const params = [veterinarianId];

  if (medicalField) {
    query += ` AND v.medical_field = $2`;
    params.push(medicalField);
    query += ` ORDER BY v.updated_at DESC LIMIT $3`;
    params.push(limit.toString());
  } else {
    query += ` ORDER BY v.updated_at DESC LIMIT $2`;
    params.push(limit.toString());
  }

  const result = await pool.query(query, params);
  return result.rows;
};

// ============================================================================
// 북마크 관련 헬퍼 함수들
// ============================================================================

export const getJobBookmark = async (userId: string, jobId: string) => {
  const query =
    "SELECT id FROM job_bookmarks WHERE user_id = $1 AND job_id = $2";
  const result = await pool.query(query, [userId, jobId]);
  return result.rows[0] || null;
};

export const createJobBookmark = async (userId: string, jobId: string) => {
  const query =
    "INSERT INTO job_bookmarks (user_id, job_id) VALUES ($1, $2) RETURNING *";
  const result = await pool.query(query, [userId, jobId]);
  return result.rows[0];
};

export const deleteJobBookmark = async (userId: string, jobId: string) => {
  const query = "DELETE FROM job_bookmarks WHERE user_id = $1 AND job_id = $2";
  await pool.query(query, [userId, jobId]);
};

export const getResumeBookmark = async (
  userId: string,
  veterinarianId: string
) => {
  const query =
    "SELECT id FROM resume_bookmarks WHERE user_id = $1 AND veterinarian_id = $2";
  const result = await pool.query(query, [userId, veterinarianId]);
  return result.rows[0] || null;
};

export const createResumeBookmark = async (
  userId: string,
  veterinarianId: string
) => {
  const query =
    "INSERT INTO resume_bookmarks (user_id, veterinarian_id) VALUES ($1, $2) RETURNING *";
  const result = await pool.query(query, [userId, veterinarianId]);
  return result.rows[0];
};

export const deleteResumeBookmark = async (
  userId: string,
  veterinarianId: string
) => {
  const query =
    "DELETE FROM resume_bookmarks WHERE user_id = $1 AND veterinarian_id = $2";
  await pool.query(query, [userId, veterinarianId]);
};

// ============================================================================
// 지원서 관련 헬퍼 함수들
// ============================================================================

export const getApplication = async (jobId: string, veterinarianId: string) => {
  const query = `
    SELECT a.* FROM applications a
    JOIN veterinarians v ON a.veterinarian_id = v.id
    WHERE a.job_id = $1 AND v.user_id = $2
  `;
  const result = await pool.query(query, [jobId, veterinarianId]);
  return result.rows[0] || null;
};

export const createApplication = async (applicationData: any) => {
  const query = `
    INSERT INTO applications (job_id, veterinarian_id, status)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [
    applicationData.jobId,
    applicationData.veterinarianId,
    applicationData.status,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
) => {
  const query =
    "UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2";
  await pool.query(query, [status, applicationId]);
};

export const getApplicationStatus = async (userId: string) => {
  const query = `
    SELECT 
      COUNT(*) as total_applications,
      COUNT(CASE WHEN a.status = 'final_passed' THEN 1 END) as final_passed,
      COUNT(CASE WHEN a.status = 'document_passed' THEN 1 END) as document_passed,
      COUNT(CASE WHEN a.status = 'document_failed' THEN 1 END) as document_failed,
      COUNT(CASE WHEN a.status = 'document_pending' THEN 1 END) as document_pending,
      COUNT(CASE WHEN a.status = 'interview_pending' THEN 1 END) as interview_pending,
      COUNT(CASE WHEN a.status = 'interview_passed' THEN 1 END) as interview_passed,
      COUNT(CASE WHEN a.status = 'interview_failed' THEN 1 END) as interview_failed,
      COUNT(CASE WHEN a.status = 'final_pending' THEN 1 END) as final_pending
    FROM applications a
    JOIN veterinarians v ON a.veterinarian_id = v.id
    WHERE v.user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  const row = result.rows[0];

  return {
    totalApplications: parseInt(row.total_applications) || 0,
    finalPassed: parseInt(row.final_passed) || 0,
    documentPassed: parseInt(row.document_passed) || 0,
    documentFailed: parseInt(row.document_failed) || 0,
    documentPending: parseInt(row.document_pending) || 0,
    interviewPending: parseInt(row.interview_pending) || 0,
    interviewPassed: parseInt(row.interview_passed) || 0,
    interviewFailed: parseInt(row.interview_failed) || 0,
    finalPending: parseInt(row.final_pending) || 0,
  };
};

// ============================================================================
// 알림 관련 헬퍼 함수들
// ============================================================================

export const createNotification = async (notificationData: {
  userId: string;
  type: NotificationType;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  senderId?: string;
  applicationId?: string;
  applicationStatus?: ApplicationStatus;
}) => {
  const query = `
    INSERT INTO notifications (user_id, type, title, description, content, url, sender_id, application_id, application_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    notificationData.userId,
    notificationData.type,
    notificationData.title,
    notificationData.description,
    notificationData.content,
    notificationData.url,
    notificationData.senderId,
    notificationData.applicationId,
    notificationData.applicationStatus,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getNotifications = async (userId: string, limit: number = 20) => {
  const query = `
    SELECT n.*, 
           u.profile_image as sender_profile_image,
           CASE 
             WHEN u.user_type = 'veterinarian' THEN v.nickname
             WHEN u.user_type = 'hospital' THEN h.hospital_name
           END as sender_name
    FROM notifications n
    LEFT JOIN users u ON n.sender_id = u.id
    LEFT JOIN veterinarians v ON u.id = v.user_id
    LEFT JOIN hospitals h ON u.id = h.user_id
    WHERE n.user_id = $1
    ORDER BY n.created_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  const query =
    "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2";
  await pool.query(query, [notificationId, userId]);
};

export const getStatusNotificationTitle = (
  status: ApplicationStatus
): string => {
  const statusMap: Record<ApplicationStatus, string> = {
    document_pending: "서류 심사 중",
    document_passed: "서류 심사 통과",
    document_failed: "서류 심사 불합격",
    interview_pending: "면접 일정 안내",
    interview_passed: "면접 합격",
    interview_failed: "면접 불합격",
    final_pending: "최종 심사 중",
    final_passed: "최종 합격 축하드립니다!",
    final_failed: "최종 불합격",
  };

  return statusMap[status] || "지원 상태 업데이트";
};

// ============================================================================
// 프로필 관련 헬퍼 함수들
// ============================================================================

export const getVeterinarianProfile = async (userId: string) => {
  const query = `
    SELECT v.*, u.email, u.phone, u.profile_image, u.username, u.last_login_at
    FROM veterinarians v
    JOIN users u ON v.user_id = u.id
    WHERE v.user_id = $1 AND u.deleted_at IS NULL
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

export const getHospitalProfile = async (userId: string) => {
  const query = `
    SELECT h.*, u.email, u.phone, u.profile_image, u.username, u.last_login_at
    FROM hospitals h
    JOIN users u ON h.user_id = u.id
    WHERE h.user_id = $1 AND u.deleted_at IS NULL
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

export const getHospitalByUserId = async (userId: string) => {
  const query = "SELECT * FROM hospitals WHERE user_id = $1";
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

export const updateVeterinarianProfile = async (
  userId: string,
  profileData: any
) => {
  try {
    console.log('[DB] updateVeterinarianProfile called with:', { userId, profileData });

    // users 테이블 업데이트 (email, phone, profileImage, realName)
    if (profileData.email !== undefined) {
      await sql`UPDATE users SET email = ${profileData.email}, "updatedAt" = NOW() WHERE id = ${userId}`;
      console.log('[DB] Updated user email');
    }
    if (profileData.phone !== undefined) {
      await sql`UPDATE users SET phone = ${profileData.phone}, "updatedAt" = NOW() WHERE id = ${userId}`;
      console.log('[DB] Updated user phone');
    }
    if (profileData.profileImage !== undefined) {
      await sql`UPDATE users SET "profileImage" = ${profileData.profileImage}, "updatedAt" = NOW() WHERE id = ${userId}`;
      console.log('[DB] Updated user profileImage');
    }
    if (profileData.realName !== undefined) {
      await sql`UPDATE users SET "realName" = ${profileData.realName}, "updatedAt" = NOW() WHERE id = ${userId}`;
      console.log('[DB] Updated user realName');
    }

    // veterinarian_profiles 테이블 업데이트
    if (profileData.nickname !== undefined || profileData.birthDate !== undefined || profileData.licenseImage !== undefined) {
      // First check if profile exists
      const existingProfile = await sql`SELECT id FROM veterinarian_profiles WHERE "userId" = ${userId}`;
      
      if (existingProfile.length > 0) {
        // Update existing profile
        if (profileData.nickname !== undefined) {
          await sql`UPDATE veterinarian_profiles SET nickname = ${profileData.nickname}, "updatedAt" = NOW() WHERE "userId" = ${userId}`;
        }
        if (profileData.birthDate !== undefined) {
          await sql`UPDATE veterinarian_profiles SET "birthDate" = ${profileData.birthDate}, "updatedAt" = NOW() WHERE "userId" = ${userId}`;
        }
        if (profileData.licenseImage !== undefined) {
          await sql`UPDATE veterinarian_profiles SET "licenseImage" = ${profileData.licenseImage}, "updatedAt" = NOW() WHERE "userId" = ${userId}`;
        }
      } else {
        // Create new profile
        await sql`
          INSERT INTO veterinarian_profiles ("userId", nickname, "birthDate", "licenseImage", "createdAt", "updatedAt")
          VALUES (${userId}, ${profileData.nickname || null}, ${profileData.birthDate || null}, ${profileData.licenseImage || null}, NOW(), NOW())
        `;
      }
      console.log('[DB] Updated veterinarian profile');
    }

    return { success: true };
  } catch (error) {
    console.error('[DB] Error updating veterinarian profile:', error);
    throw error;
  }
};

// ============================================================================
// 세부 정보 조회 함수들
// ============================================================================

export const getVeterinarianCareers = async (veterinarianId: string) => {
  const query = `
    SELECT * FROM careers 
    WHERE veterinarian_id = $1 
    ORDER BY start_date DESC
  `;
  const result = await pool.query(query, [veterinarianId]);
  return result.rows;
};

export const getVeterinarianEducations = async (veterinarianId: string) => {
  const query = `
    SELECT * FROM educations 
    WHERE veterinarian_id = $1 
    ORDER BY start_date DESC
  `;
  const result = await pool.query(query, [veterinarianId]);
  return result.rows;
};

export const getVeterinarianLicenses = async (veterinarianId: string) => {
  const query = `
    SELECT * FROM licenses 
    WHERE veterinarian_id = $1 
    ORDER BY acquired_date DESC
  `;
  const result = await pool.query(query, [veterinarianId]);
  return result.rows;
};

export const getVeterinarianSkills = async (veterinarianId: string) => {
  const query = `
    SELECT * FROM skills 
    WHERE veterinarian_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [veterinarianId]);
  return result.rows;
};

export const getVeterinarianEvaluations = async (veterinarianId: string) => {
  const query = `
    SELECT ve.*, h.hospital_name, h.logo_image as hospital_logo
    FROM veterinarian_evaluations ve
    JOIN hospitals h ON ve.hospital_id = h.id
    WHERE ve.veterinarian_id = $1
    ORDER BY ve.created_at DESC
  `;
  const result = await pool.query(query, [veterinarianId]);
  return {
    averageRating:
      result.rows.length > 0
        ? result.rows.reduce(
            (acc, evaluation) => acc + evaluation.overall_rating,
            0
          ) / result.rows.length
        : 0,
    evaluations: result.rows,
  };
};

// ============================================================================
// 대시보드 관련 헬퍼 함수들
// ============================================================================

export const getBookmarkedJobs = async (userId: string, limit?: number) => {
  let query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location,
           jb.created_at as bookmarked_date
    FROM job_bookmarks jb
    JOIN job_postings j ON jb.job_id = j.id
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE jb.user_id = $1 AND j.is_active = true
    ORDER BY jb.created_at DESC
  `;

  const params = [userId];

  if (limit) {
    query += ` LIMIT $2`;
    params.push(limit.toString());
  }

  const result = await pool.query(query, params);
  return result.rows;
};

export const getVeterinarianApplications = async (
  userId: string,
  sort: string = "latest"
) => {
  let orderBy = "a.applied_at DESC";

  if (sort === "oldest") {
    orderBy = "a.applied_at ASC";
  }

  const query = `
    SELECT a.*, j.title as job_title, j.position, h.hospital_name, h.phone as contact_phone, h.email as contact_email
    FROM applications a
    JOIN veterinarians v ON a.veterinarian_id = v.id
    JOIN job_postings j ON a.job_id = j.id
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE v.user_id = $1
    ORDER BY ${orderBy}
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getRecentApplications = async (
  userId: string,
  limit: number = 5
) => {
  const query = `
    SELECT a.*, j.title as job_title, h.hospital_name
    FROM applications a
    JOIN veterinarians v ON a.veterinarian_id = v.id
    JOIN job_postings j ON a.job_id = j.id
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE v.user_id = $1
    ORDER BY a.applied_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

export const getRecruitmentStatus = async (userId: string) => {
  const query = `
    SELECT 
      COUNT(CASE WHEN a.status IN ('document_pending', 'interview_pending', 'final_pending') THEN 1 END) as new_applicants,
      COUNT(CASE WHEN a.status = 'interview_pending' THEN 1 END) as upcoming_interviews,
      COUNT(CASE WHEN a.status = 'final_passed' THEN 1 END) as completed_recruitments
    FROM applications a
    JOIN job_postings j ON a.job_id = j.id
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE h.user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  const row = result.rows[0];

  return {
    newApplicants: parseInt(row.new_applicants) || 0,
    upcomingInterviews: parseInt(row.upcoming_interviews) || 0,
    completedRecruitments: parseInt(row.completed_recruitments) || 0,
  };
};

export const getActiveJobs = async (userId: string, limit?: number) => {
  let query = `
    SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE h.user_id = $1 AND j.is_active = true
    ORDER BY j.created_at DESC
  `;

  const params = [userId];

  if (limit) {
    query += ` LIMIT $2`;
    params.push(limit.toString());
  }

  const result = await pool.query(query, params);
  return result.rows;
};

export const getRecentApplicants = async (
  userId: string,
  limit: number = 5
) => {
  const query = `
    SELECT a.*, v.nickname as veterinarian_name, v.position, u.profile_image, j.title as job_title
    FROM applications a
    JOIN veterinarians v ON a.veterinarian_id = v.id
    JOIN users u ON v.user_id = u.id
    JOIN job_postings j ON a.job_id = j.id
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE h.user_id = $1
    ORDER BY a.applied_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

// ============================================================================
// 채용공고 CRUD 헬퍼 함수들
// ============================================================================

export const createJobPosting = async (jobData: any) => {
  const query = `
    INSERT INTO job_postings (
      hospital_id, title, description, position, medical_field, work_type, required_experience,
      salary, salary_type, work_days, is_days_negotiable, work_start_time, work_end_time, 
      is_time_negotiable, benefits, education_requirements, license_requirements, 
      experience_details, preferences, contact_name, contact_phone, contact_email, 
      contact_department, recruit_count, deadline, is_deadline_unlimited, is_draft, is_public
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
    RETURNING *
  `;

  const values = [
    jobData.hospitalId,
    jobData.title,
    jobData.description,
    jobData.position,
    jobData.medicalField,
    jobData.workType,
    jobData.requiredExperience,
    jobData.salary,
    jobData.salaryType,
    jobData.workDays,
    jobData.isDaysNegotiable,
    jobData.workStartTime,
    jobData.workEndTime,
    jobData.isTimeNegotiable,
    jobData.benefits,
    jobData.educationRequirements,
    jobData.licenseRequirements,
    jobData.experienceDetails,
    jobData.preferences,
    jobData.contactName,
    jobData.contactPhone,
    jobData.contactEmail,
    jobData.contactDepartment,
    jobData.recruitCount,
    jobData.deadline,
    jobData.isDeadlineUnlimited,
    jobData.isDraft,
    jobData.isPublic,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateJobPosting = async (jobId: string, jobData: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 0;

  // 동적으로 업데이트할 필드 구성
  Object.entries(jobData).forEach(([key, value]) => {
    if (value !== undefined) {
      paramCount++;
      fields.push(`${key} = ${paramCount}`);
      values.push(value);
    }
  });

  if (fields.length === 0) return null;

  const query = `
    UPDATE job_postings 
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${paramCount + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, jobId]);
  return result.rows[0];
};

export const getJobByIdWithHospital = async (jobId: string) => {
  const query = `
    SELECT j.*, h.user_id as hospital_user_id, h.hospital_name
    FROM job_postings j
    JOIN hospitals h ON j.hospital_id = h.id
    WHERE j.id = $1
  `;

  const result = await pool.query(query, [jobId]);

  if (result.rows.length === 0) return null;

  const job = result.rows[0];
  return {
    ...job,
    hospital: {
      userId: job.hospital_user_id,
      name: job.hospital_name,
    },
  };
};

export const getApplicationWithJobAndHospital = async (
  applicationId: string
) => {
  const query = `
    SELECT a.*, 
           j.title as job_title, j.hospital_id,
           h.user_id as hospital_user_id, h.hospital_name,
           v.user_id as veterinarian_user_id, v.nickname as veterinarian_name
    FROM applications a
    JOIN job_postings j ON a.job_id = j.id
    JOIN hospitals h ON j.hospital_id = h.id
    JOIN veterinarians v ON a.veterinarian_id = v.id
    WHERE a.id = $1
  `;

  const result = await pool.query(query, [applicationId]);

  if (result.rows.length === 0) return null;

  const app = result.rows[0];
  return {
    ...app,
    job: {
      title: app.job_title,
      hospital: {
        userId: app.hospital_user_id,
        name: app.hospital_name,
      },
    },
    veterinarian: {
      userId: app.veterinarian_user_id,
      name: app.veterinarian_name,
    },
  };
};

// ============================================================================
// 강의영상 관련 헬퍼 함수들
// ============================================================================

export const getLecturesWithPagination = async (params: any) => {
  let query = `
    SELECT * FROM lectures 
    WHERE is_public = true AND is_active = true
  `;

  const queryParams: any[] = [];
  let paramCount = 0;

  // 키워드 검색
  if (params.keyword) {
    paramCount++;
    query += ` AND (title ILIKE ${paramCount} OR description ILIKE ${paramCount} OR instructor ILIKE ${paramCount})`;
    queryParams.push(`%${params.keyword}%`);
  }

  // 의료 분야 필터
  if (params.medicalField) {
    paramCount++;
    query += ` AND medical_field = ${paramCount}`;
    queryParams.push(params.medicalField);
  }

  // 동물 종류 필터
  if (params.animal) {
    paramCount++;
    query += ` AND animal_type = ${paramCount}`;
    queryParams.push(params.animal);
  }

  // 난이도 필터
  if (params.difficulty) {
    paramCount++;
    query += ` AND difficulty = ${paramCount}`;
    queryParams.push(params.difficulty);
  }

  // 정렬
  switch (params.sort) {
    case "latest":
      query += " ORDER BY upload_date DESC";
      break;
    case "oldest":
      query += " ORDER BY upload_date ASC";
      break;
    case "view":
      query += " ORDER BY view_count DESC";
      break;
    case "rating":
      query += " ORDER BY rating DESC";
      break;
    default:
      query += " ORDER BY upload_date DESC";
  }

  // 페이지네이션
  const offset = (params.page - 1) * params.limit;
  paramCount += 2;
  query += ` LIMIT ${paramCount - 1} OFFSET ${paramCount}`;
  queryParams.push(params.limit, offset);

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const getLectureById = async (lectureId: string) => {
  const query = "SELECT * FROM lectures WHERE id = $1 AND is_active = true";
  const result = await pool.query(query, [lectureId]);
  return result.rows[0] || null;
};

export const incrementLectureViewCount = async (
  lectureId: string,
  userIdentifier: string,
  userId?: string
): Promise<boolean> => {
  return incrementViewCount('lecture', lectureId, userIdentifier, userId);
};

export const getRecommendedLectures = async (
  lectureId: string,
  medicalField?: string,
  limit: number = 5
) => {
  let query = `
    SELECT * FROM lectures 
    WHERE id != $1 AND is_public = true AND is_active = true
  `;

  const params = [lectureId];

  if (medicalField) {
    query += ` AND medical_field = $2`;
    params.push(medicalField);
    query += ` ORDER BY view_count DESC, upload_date DESC LIMIT $3`;
    params.push(limit.toString());
  } else {
    query += ` ORDER BY view_count DESC, upload_date DESC LIMIT $2`;
    params.push(limit.toString());
  }

  const result = await pool.query(query, params);
  return result.rows;
};

export const getLectureComments = async (lectureId: string) => {
  const query = `
    SELECT lc.*, u.profile_image, 
           CASE 
             WHEN u.user_type = 'veterinarian' THEN v.nickname
             WHEN u.user_type = 'hospital' THEN h.hospital_name
           END as author_name
    FROM lecture_comments lc
    JOIN users u ON lc.user_id = u.id
    LEFT JOIN veterinarians v ON u.id = v.user_id
    LEFT JOIN hospitals h ON u.id = h.user_id
    WHERE lc.lecture_id = $1 AND lc.is_deleted = false
    ORDER BY lc.created_at DESC
  `;

  const result = await pool.query(query, [lectureId]);

  // 댓글과 대댓글 구조화
  const comments = result.rows.filter((comment) => !comment.parent_comment_id);
  const replies = result.rows.filter((comment) => comment.parent_comment_id);

  return comments.map((comment) => ({
    ...comment,
    replies: replies.filter((reply) => reply.parent_comment_id === comment.id),
  }));
};

export const getPopularLectures = async (limit: number = 10) => {
  const query = `
    SELECT * FROM lectures 
    WHERE is_public = true AND is_active = true
    ORDER BY view_count DESC, rating DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};

// ============================================================================
// 기타 콘텐츠 관련 헬퍼 함수들
// ============================================================================

export const getBanners = async () => {
  const query = `
    SELECT * FROM banners 
    WHERE is_active = true 
    AND (start_date IS NULL OR start_date <= CURRENT_TIMESTAMP)
    AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)
    ORDER BY position ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const getAdvertisements = async (position?: string) => {
  let query = "SELECT * FROM advertisements WHERE is_active = true";
  const params: any[] = [];

  if (position) {
    query += " AND position = $1";
    params.push(position);
  }

  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, params);
  return result.rows;
};

export const getPopularTransfers = async (
  category: string,
  limit: number = 5
) => {
  const query = `
    SELECT * FROM transfers 
    WHERE category = $1 AND is_active = true AND is_public = true
    ORDER BY view_count DESC, created_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [category, limit]);
  return result.rows;
};

// ============================================================================
// 이력서 관련 복합 함수들
// ============================================================================

export const getFullVeterinarianResume = async (userId: string) => {
  const profile = await getVeterinarianProfile(userId);
  if (!profile) return null;

  const careers = await getVeterinarianCareers(profile.id);
  const educations = await getVeterinarianEducations(profile.id);
  const licenses = await getVeterinarianLicenses(profile.id);
  const skills = await getVeterinarianSkills(profile.id);

  return {
    ...profile,
    careers,
    educations,
    licenses,
    skills,
  };
};

export const updateVeterinarianResume = async (
  userId: string,
  resumeData: any
) => {
  await pool.query("BEGIN");

  try {
    // 기본 프로필 업데이트
    await updateVeterinarianProfile(userId, {
      introduction: resumeData.introduction,
      position: resumeData.position,
      medical_field: resumeData.medicalField,
      preferred_regions: resumeData.preferredRegions,
      expected_salary: resumeData.expectedSalary,
      preferred_work_type: resumeData.preferredWorkType,
      available_start_date: resumeData.availableStartDate,
      preferred_work_days: resumeData.preferredWorkDays,
      is_days_negotiable: resumeData.isDaysNegotiable,
      preferred_work_hours: resumeData.preferredWorkHours,
      is_time_negotiable: resumeData.isTimeNegotiable,
      self_introduction: resumeData.selfIntroduction,
      portfolio_files: resumeData.portfolioFiles,
      linkedin_url: resumeData.snsAccounts?.linkedin,
      instagram_url: resumeData.snsAccounts?.instagram,
      blog_url: resumeData.snsAccounts?.blog,
      is_profile_public: resumeData.isPublic,
    });

    // 경력 업데이트 (기존 삭제 후 재생성)
    const veterinarian = await getVeterinarianProfile(userId);
    if (veterinarian) {
      await pool.query("DELETE FROM careers WHERE veterinarian_id = $1", [
        veterinarian.id,
      ]);

      for (const career of resumeData.careers || []) {
        await pool.query(
          "INSERT INTO careers (veterinarian_id, hospital_name, start_date, end_date, main_tasks) VALUES ($1, $2, $3, $4, $5)",
          [
            veterinarian.id,
            career.hospitalName,
            career.startDate,
            career.endDate,
            career.mainTasks,
          ]
        );
      }

      // 학력 업데이트
      await pool.query("DELETE FROM educations WHERE veterinarian_id = $1", [
        veterinarian.id,
      ]);

      for (const education of resumeData.educations || []) {
        await pool.query(
          "INSERT INTO educations (veterinarian_id, degree, is_graduated, school_name, major, gpa, max_gpa, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [
            veterinarian.id,
            education.degree,
            education.isGraduated,
            education.schoolName,
            education.major,
            education.gpa,
            education.maxGpa,
            education.startDate,
            education.endDate,
          ]
        );
      }

      // 자격증 업데이트
      await pool.query("DELETE FROM licenses WHERE veterinarian_id = $1", [
        veterinarian.id,
      ]);

      for (const license of resumeData.licenses || []) {
        await pool.query(
          "INSERT INTO licenses (veterinarian_id, name, level, acquired_date, issuing_organization) VALUES ($1, $2, $3, $4, $5)",
          [
            veterinarian.id,
            license.name,
            license.level,
            license.acquiredDate,
            license.issuingOrganization,
          ]
        );
      }

      // 기술 업데이트
      await pool.query("DELETE FROM skills WHERE veterinarian_id = $1", [
        veterinarian.id,
      ]);

      for (const skill of resumeData.skills || []) {
        await pool.query(
          "INSERT INTO skills (veterinarian_id, field, skill_name, proficiency, description) VALUES ($1, $2, $3, $4, $5)",
          [
            veterinarian.id,
            skill.field,
            skill.skillName,
            skill.proficiency,
            skill.description,
          ]
        );
      }
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

// ============================================================================
// 검증 및 유틸리티 함수들
// ============================================================================

export const isJobDeadlinePassed = (deadline: string | null): boolean => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const calculateApplicationsStats = (applications: any[]) => {
  return {
    total: applications.length,
    pending: applications.filter((app) =>
      ["document_pending", "interview_pending", "final_pending"].includes(
        app.status
      )
    ).length,
    passed: applications.filter((app) =>
      ["document_passed", "interview_passed", "final_passed"].includes(
        app.status
      )
    ).length,
    failed: applications.filter((app) =>
      ["document_failed", "interview_failed", "final_failed"].includes(
        app.status
      )
    ).length,
  };
};

export const sanitizeUserInput = (input: string): string => {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

export const parseWorkDays = (workDays: string[]): string => {
  const dayMap: Record<string, string> = {
    monday: "월",
    tuesday: "화",
    wednesday: "수",
    thursday: "목",
    friday: "금",
    saturday: "토",
    sunday: "일",
  };

  return workDays.map((day) => dayMap[day] || day).join(", ");
};

export const calculateExperienceYears = (
  startDate: string,
  endDate?: string
): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(diffYears * 10) / 10; // 소수점 첫째자리까지
};

// ============================================================================
// 이메일 및 알림 발송 관련 함수들
// ============================================================================

export const sendNotificationEmail = async (
  to: string,
  subject: string,
  content: string,
  type: "application" | "status_update" | "interview" | "general" = "general"
) => {
  // 실제 구현에서는 SendGrid, AWS SES 등을 사용
  try {
    console.log(`Email sent to ${to}: ${subject}`);

    // 개발 환경에서는 콘솔 로그로 대체
    if (process.env.NODE_ENV === "development") {
      console.log("=== EMAIL NOTIFICATION ===");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Type: ${type}`);
      console.log(`Content: ${content}`);
      console.log("========================");
      return true;
    }

    // 프로덕션에서는 실제 이메일 발송 로직
    // await emailService.send({ to, subject, content, type });

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

export const sendSMSNotification = async (
  to: string,
  message: string,
  type: "verification" | "notification" = "notification"
) => {
  try {
    console.log(`SMS sent to ${to}: ${message}`);

    if (process.env.NODE_ENV === "development") {
      console.log("=== SMS NOTIFICATION ===");
      console.log(`To: ${to}`);
      console.log(`Type: ${type}`);
      console.log(`Message: ${message}`);
      console.log("=======================");
      return true;
    }

    // 프로덕션에서는 실제 SMS 발송 로직 (AWS SNS, Twilio 등)
    // await smsService.send({ to, message, type });

    return true;
  } catch (error) {
    console.error("SMS sending failed:", error);
    return false;
  }
};

// ============================================================================
// 캐싱 관련 함수들
// ============================================================================

const cache = new Map<string, { data: any; expiry: number }>();

export const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
};

export const setCachedData = <T>(
  key: string,
  data: T,
  ttlSeconds: number = 300
): void => {
  const expiry = Date.now() + ttlSeconds * 1000;
  cache.set(key, { data, expiry });
};

export const clearCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of Array.from(cache.keys())) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

// ============================================================================
// 로깅 및 모니터링 함수들
// ============================================================================

export const logUserActivity = async (
  userId: string,
  action: string,
  details?: any,
  ipAddress?: string
) => {
  try {
    const query = `
      INSERT INTO user_activity_logs (user_id, action, details, ip_address)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(query, [
      userId,
      action,
      JSON.stringify(details),
      ipAddress,
    ]);
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
};

export const logApiRequest = async (
  method: string,
  endpoint: string,
  userId?: string,
  responseTime?: number,
  statusCode?: number,
  errorMessage?: string
) => {
  try {
    const query = `
      INSERT INTO api_request_logs (method, endpoint, user_id, response_time, status_code, error_message)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [
      method,
      endpoint,
      userId,
      responseTime,
      statusCode,
      errorMessage,
    ]);
  } catch (error) {
    console.error("Failed to log API request:", error);
  }
};

// ============================================================================
// 보안 관련 함수들
// ============================================================================

export const validateFileUpload = (
  file: File,
  allowedTypes: string[],
  maxSize: number
): { isValid: boolean; error?: string } => {
  // 파일 크기 검증
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기가 ${Math.round(maxSize / 1024 / 1024)}MB를 초과합니다`,
    };
  }

  // 파일 타입 검증
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "허용되지 않는 파일 형식입니다",
    };
  }

  // 파일명 검증 (특수문자 제한)
  const fileName = file.name;
  if (!/^[a-zA-Z0-9가-힣._-]+$/.test(fileName)) {
    return {
      isValid: false,
      error: "파일명에 특수문자가 포함되어 있습니다",
    };
  }

  return { isValid: true };
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9가-힣._-]/g, "").substring(0, 100); // 최대 100자
};

export const generateSecureToken = (): string => {
  const crypto = require("crypto");
  return crypto.randomBytes(32).toString("hex");
};

export const hashSensitiveData = (data: string): string => {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(data).digest("hex");
};

// ============================================================================
// 데이터 변환 및 포맷팅 함수들
// ============================================================================

export const formatJobForAPI = (job: any): any => {
  return {
    id: job.id,
    title: job.title,
    hospitalName: job.hospital_name,
    deadline: job.deadline,
    isBookmarked: false, // 실제로는 사용자별로 확인 필요
    position: job.position,
    workType: job.work_type,
    hospitalLocation: job.hospital_location || job.address,
    requiredExperience: job.required_experience,
    hashtags: generateJobHashtags(job),
    isPublic: job.is_public,
    isNew: isNewContent(job.created_at),
    applicantCount: job.applicant_count || 0,
    viewCount: job.view_count || 0,
    // 상세 정보 (상세 조회시에만)
    ...(job.description && {
      description: job.description,
      workConditions: {
        workType: job.work_type,
        workDays: job.work_days || [],
        workHours: formatWorkHours(job.work_start_time, job.work_end_time),
        salary: job.salary,
        benefits: job.benefits,
      },
      requirements: {
        education: job.education_requirements || [],
        licenses: job.license_requirements || [],
        experience: job.required_experience,
      },
      preferences: job.preferences || [],
      hospitalInfo: {
        id: job.hospital_id,
        logo: job.hospital_logo,
        name: job.hospital_name,
        address: job.address,
        detailAddress: job.detail_address,
        website: job.website,
        phone: job.hospital_phone,
      },
    }),
  };
};

export const formatResumeForAPI = (resume: any): any => {
  return {
    id: resume.id,
    name: resume.nickname || resume.name,
    profileImage: resume.profile_image,
    isBookmarked: false, // 실제로는 사용자별로 확인 필요
    preferredPosition: resume.position,
    preferredWorkType: resume.preferred_work_type,
    experienceLevel: resume.total_experience,
    hashtags: generateHashtags(resume),
    isPublic: resume.is_profile_public,
    lastLogin: resume.last_login_at,
    preferredRegions: resume.preferred_regions || [],
    // 상세 정보 (상세 조회시에만)
    ...(resume.introduction !== undefined && {
      introduction: resume.introduction,
      phone: resume.is_phone_public ? resume.phone : null,
      email: resume.is_email_public ? resume.email : null,
      currentHospital: resume.current_hospital,
      totalExperience: resume.total_experience,
      availableStartDate: resume.available_start_date,
      birthDate: resume.birth_date,
      medicalField: resume.medical_field,
      workPreferences: {
        workType: resume.preferred_work_type,
        salary: resume.expected_salary,
        workDays: resume.preferred_work_days || [],
        isDaysNegotiable: resume.is_days_negotiable,
        workHours: resume.preferred_work_hours,
        isTimeNegotiable: resume.is_time_negotiable,
        regions: resume.preferred_regions || [],
        availableStartDate: resume.available_start_date,
      },
      careers: resume.careers || [],
      educations: resume.educations || [],
      licenses: resume.licenses || [],
      skills: resume.skills || [],
      evaluations: resume.evaluations || { averageRating: 0, evaluations: [] },
      selfIntroduction: resume.self_introduction,
    }),
  };
};

const generateJobHashtags = (job: any): string[] => {
  const hashtags: string[] = [];

  if (job.medical_field) {
    const fieldMap: Record<string, string> = {
      internal: "내과",
      surgery: "외과",
      dermatology: "피부과",
      dental: "치과",
    };
    hashtags.push(`#${fieldMap[job.medical_field] || job.medical_field}`);
  }

  if (job.work_type) {
    const workTypeMap: Record<string, string> = {
      full_time: "정규직",
      part_time: "파트타임",
    };
    hashtags.push(`#${workTypeMap[job.work_type] || job.work_type}`);
  }

  if (job.required_experience) {
    hashtags.push(`#${job.required_experience}`);
  }

  return hashtags.slice(0, 3);
};

const isNewContent = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7; // 7일 이내를 '새 글'로 간주
};

const formatWorkHours = (startTime?: string, endTime?: string): string => {
  if (!startTime || !endTime) return "";
  return `${startTime} - ${endTime}`;
};

// ============================================================================
// 검색 및 필터링 고급 함수들
// ============================================================================

export const buildAdvancedSearchQuery = (
  baseQuery: string,
  filters: Record<string, any>,
  searchableFields: string[]
): { query: string; params: any[] } => {
  let query = baseQuery;
  const params: any[] = [];
  let paramCount = 0;

  // 키워드 검색 (여러 필드에 대해)
  if (filters.keyword && searchableFields.length > 0) {
    paramCount++;
    const searchConditions = searchableFields
      .map((field) => `${field} ILIKE ${paramCount}`)
      .join(" OR ");
    query += ` AND (${searchConditions})`;
    params.push(`%${filters.keyword}%`);
  }

  // 날짜 범위 필터
  if (filters.dateFrom) {
    paramCount++;
    query += ` AND created_at >= ${paramCount}`;
    params.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    paramCount++;
    query += ` AND created_at <= ${paramCount}`;
    params.push(filters.dateTo);
  }

  // 배열 필터 (예: 지역, 기술 등)
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      paramCount++;
      query += ` AND ${key} = ANY(${paramCount})`;
      params.push(value);
    }
  });

  // 범위 필터 (예: 급여, 경력 등)
  if (filters.salaryMin) {
    paramCount++;
    query += ` AND salary_numeric >= ${paramCount}`;
    params.push(filters.salaryMin);
  }

  if (filters.salaryMax) {
    paramCount++;
    query += ` AND salary_numeric <= ${paramCount}`;
    params.push(filters.salaryMax);
  }

  return { query, params };
};

export const applySorting = (
  query: string,
  sortField: string,
  sortDirection: "ASC" | "DESC" = "DESC"
): string => {
  const allowedSortFields = [
    "created_at",
    "updated_at",
    "view_count",
    "applicant_count",
    "rating",
  ];

  if (!allowedSortFields.includes(sortField)) {
    sortField = "created_at";
  }

  return `${query} ORDER BY ${sortField} ${sortDirection}`;
};

export const applyPagination = (
  query: string,
  page: number,
  limit: number
): { query: string; offset: number } => {
  const offset = Math.max(0, (page - 1) * limit);
  const paginatedQuery = `${query} LIMIT ${limit} OFFSET ${offset}`;

  return { query: paginatedQuery, offset };
};

// ============================================================================
// 데이터 검증 및 정제 함수들
// ============================================================================

export const validateJobData = (
  jobData: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 필수 필드 검증
  if (!jobData.title?.trim()) {
    errors.push("제목을 입력해주세요");
  }

  if (!jobData.description?.trim()) {
    errors.push("상세 설명을 입력해주세요");
  }

  if (!jobData.position?.trim()) {
    errors.push("모집 직책을 입력해주세요");
  }

  // 마감일 검증
  if (jobData.deadline) {
    const deadline = new Date(jobData.deadline);
    const now = new Date();

    if (deadline <= now) {
      errors.push("마감일은 현재 시간보다 이후여야 합니다");
    }
  }

  // 모집 인원 검증
  if (
    jobData.recruitCount &&
    (jobData.recruitCount < 1 || jobData.recruitCount > 100)
  ) {
    errors.push("모집 인원은 1명 이상 100명 이하여야 합니다");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+82|0)?[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
};


export const validateResumeData = (
  resumeData: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 필수 필드 검증
  if (!resumeData.name?.trim()) {
    errors.push("이름을 입력해주세요");
  }

  // 이메일 형식 검증
  if (resumeData.email && !validateEmail(resumeData.email)) {
    errors.push("올바른 이메일 형식을 입력해주세요");
  }

  // 전화번호 형식 검증
  if (resumeData.phone && !validatePhone(resumeData.phone)) {
    errors.push("올바른 전화번호 형식을 입력해주세요");
  }

  // 생년월일 검증
  if (resumeData.birthDate) {
    const birthDate = new Date(resumeData.birthDate);
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();

    if (age < 18 || age > 100) {
      errors.push("생년월일을 다시 확인해주세요");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// 통계 및 분석 함수들
// ============================================================================

export const getJobStatistics = async (hospitalId?: string) => {
  let query = `
    SELECT 
      COUNT(*) as total_jobs,
      COUNT(CASE WHEN is_active = true THEN 1 END) as active_jobs,
      AVG(view_count) as avg_view_count,
      AVG(applicant_count) as avg_applicant_count
    FROM job_postings
  `;

  const params: any[] = [];

  if (hospitalId) {
    query += ` WHERE hospital_id = $1`;
    params.push(hospitalId);
  }

  const result = await pool.query(query, params);
  return result.rows[0];
};

export const getUserEngagementStats = async (
  userId: string,
  userType: "veterinarian" | "hospital"
) => {
  const queries = {
    veterinarian: `
      SELECT 
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT jb.id) as total_bookmarks,
        COUNT(DISTINCT vl.id) as total_views
      FROM users u
      LEFT JOIN veterinarians v ON u.id = v.user_id
      LEFT JOIN applications a ON v.id = a.veterinarian_id
      LEFT JOIN job_bookmarks jb ON u.id = jb.user_id
      LEFT JOIN view_logs vl ON u.id = vl.user_id
      WHERE u.id = $1
    `,
    hospital: `
      SELECT 
        COUNT(DISTINCT j.id) as total_jobs,
        COUNT(DISTINCT a.id) as total_applicants,
        COUNT(DISTINCT rb.id) as total_bookmarks
      FROM users u
      LEFT JOIN hospitals h ON u.id = h.user_id
      LEFT JOIN job_postings j ON h.id = j.hospital_id
      LEFT JOIN applications a ON j.id = a.job_id
      LEFT JOIN resume_bookmarks rb ON u.id = rb.user_id
      WHERE u.id = $1
    `,
  };

  const result = await pool.query(queries[userType], [userId]);
  return result.rows[0];
};

export const getTrendingSearchTerms = async (limit: number = 10) => {
  const query = `
    SELECT search_term, COUNT(*) as search_count
    FROM search_logs
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY search_term
    ORDER BY search_count DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};

// ============================================================================
// 클린업 및 유지보수 함수들
// ============================================================================

export const cleanupExpiredSessions = async (): Promise<number> => {
  const query = `
    DELETE FROM user_sessions 
    WHERE expires_at < CURRENT_TIMESTAMP
  `;

  const result = await pool.query(query);
  return result.rowCount || 0;
};

export const cleanupOldLogs = async (
  daysToKeep: number = 30
): Promise<number> => {
  const query = `
    DELETE FROM view_logs 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '${daysToKeep} days'
  `;

  const result = await pool.query(query);
  return result.rowCount || 0;
};

export const updateJobStatistics = async (): Promise<void> => {
  await pool.query(`
    UPDATE job_postings 
    SET applicant_count = (
      SELECT COUNT(*) FROM applications 
      WHERE job_id = job_postings.id
    )
  `);
};

export const archiveOldData = async (
  tableName: string,
  daysToKeep: number = 365
): Promise<number> => {
  // 실제 구현에서는 백업 후 삭제하는 로직
  const query = `
    DELETE FROM ${tableName} 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '${daysToKeep} days'
    AND deleted_at IS NOT NULL
  `;

  const result = await pool.query(query);
  return result.rowCount || 0;
};

// ============================================================================
// 데이터베이스 연결 관리
// ============================================================================

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};

// ============================================================================
// 추천 시스템 헬퍼 함수들
// ============================================================================

export const getRecommendedJobs = async (
  userId?: string,
  limit: number = 5
) => {
  // 실제로는 머신러닝 모델을 사용하여 개인화된 추천
  // 여기서는 간단한 규칙 기반 추천

  if (userId) {
    // 사용자의 프로필 정보를 기반으로 추천
    const userProfile = await getVeterinarianProfile(userId);

    let query = `
      SELECT j.*, h.hospital_name, h.logo_image as hospital_logo, h.address as hospital_location
      FROM job_postings j
      JOIN hospitals h ON j.hospital_id = h.id
      WHERE j.is_active = true AND j.is_public = true
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (userProfile?.medical_field) {
      paramCount++;
      query += ` AND j.medical_field = $${paramCount}`;
      params.push(userProfile.medical_field);
    }

    if (userProfile?.preferred_regions?.length > 0) {
      paramCount++;
      query += ` AND h.address ILIKE ${paramCount}`;
      params.push(`%${userProfile.preferred_regions[0]}%`);
    }

    query += ` ORDER BY j.created_at DESC, j.view_count DESC LIMIT ${
      paramCount + 1
    }`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  } else {
    // 로그인하지 않은 사용자에게는 인기 공고 추천
    return await getPopularJobs(limit);
  }
};

export const getRecommendedTalents = async (
  userId?: string,
  limit: number = 5
) => {
  if (userId) {
    // 병원의 요구사항을 기반으로 추천
    const hospitalProfile = await getHospitalProfile(userId);

    let query = `
      SELECT v.*, u.profile_image, u.last_login_at
      FROM veterinarians v
      JOIN users u ON v.user_id = u.id
      WHERE v.is_profile_public = true AND u.deleted_at IS NULL
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (hospitalProfile?.medical_fields?.length > 0) {
      paramCount++;
      query += ` AND v.medical_field = ANY(${paramCount})`;
      params.push(hospitalProfile.medical_fields);
    }

    query += ` ORDER BY v.updated_at DESC LIMIT ${paramCount + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  } else {
    // 로그인하지 않은 사용자에게는 최신 인재 추천
    return await getRecentTalents(limit);
  }
};

export const getRecentTalents = async (limit: number = 10) => {
  const query = `
    SELECT v.*, u.profile_image, u.last_login_at
    FROM veterinarians v
    JOIN users u ON v.user_id = u.id
    WHERE v.is_profile_public = true AND u.deleted_at IS NULL
    ORDER BY v.updated_at DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};

// ============================================================================
// 내보내기 - 모든 함수들은 individual named exports로 제공됩니다
// ============================================================================

// 누락된 함수들 구현
export const getUserBySocialProvider = async (provider: string, providerId: string) => {
  const query = `
    SELECT u.*, sa.* FROM users u 
    JOIN social_accounts sa ON u.id = sa.user_id 
    WHERE sa.provider = $1 AND sa.provider_id = $2
  `;
  const result = await pool.query(query, [provider, providerId]);
  return result.rows[0] || null;
};

export const linkSocialAccount = async (userId: string, socialData: any) => {
  const query = `
    INSERT INTO social_accounts (user_id, provider, provider_id, access_token, refresh_token)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [userId, socialData.provider, socialData.providerId, socialData.accessToken, socialData.refreshToken];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const createSocialUser = async (userData: any) => {
  return await createUser(userData);
};

export const getSocialUserInfo = async (provider: string, accessToken: string) => {
  // 소셜 로그인 제공자별 사용자 정보 조회 로직
  return { provider, id: "sample_id", email: "sample@email.com" };
};

export const unlinkSocialAccount = async (userId: string, provider: string) => {
  const query = `DELETE FROM social_accounts WHERE user_id = $1 AND provider = $2`;
  const result = await pool.query(query, [userId, provider]);
  return (result.rowCount ?? 0) > 0;
};

export const getUserById = async (userId: string) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

export const getApplicationById = async (applicationId: string) => {
  const query = `SELECT * FROM applications WHERE id = $1`;
  const result = await pool.query(query, [applicationId]);
  return result.rows[0] || null;
};

export const getHospitalApplicants = async (hospitalId: string) => {
  const query = `
    SELECT a.*, u.username, v.nickname 
    FROM applications a
    JOIN users u ON a.veterinarian_id = u.id
    JOIN veterinarian_profiles v ON u.id = v.user_id
    WHERE a.job_id IN (SELECT id FROM jobs WHERE hospital_id = $1)
  `;
  const result = await pool.query(query, [hospitalId]);
  return result.rows;
};

export const getHospitalJobPostings = async (hospitalId: string) => {
  const query = `SELECT * FROM jobs WHERE hospital_id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [hospitalId]);
  return result.rows;
};

export const verifyPassword = async (password: string, hash: string) => {
  // 실제로는 bcrypt.compare 사용
  return password === hash;
};

export const updateUserPassword = async (userId: string, newPasswordHash: string) => {
  const query = `UPDATE users SET password_hash = $1 WHERE id = $2`;
  const result = await pool.query(query, [newPasswordHash, userId]);
  return (result.rowCount ?? 0) > 0;
};

export const getUserBookmarks = async (userId: string) => {
  const query = `
    SELECT 'job' as type, j.* FROM job_bookmarks jb
    JOIN jobs j ON jb.job_id = j.id
    WHERE jb.user_id = $1 AND jb.deleted_at IS NULL
    UNION
    SELECT 'resume' as type, r.* FROM resume_bookmarks rb
    JOIN resumes r ON rb.resume_id = r.id
    WHERE rb.user_id = $1 AND rb.deleted_at IS NULL
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const checkJobBookmarkExists = async (userId: string, jobId: string) => {
  const query = `SELECT id FROM job_bookmarks WHERE user_id = $1 AND job_id = $2 AND deleted_at IS NULL`;
  const result = await pool.query(query, [userId, jobId]);
  return result.rows.length > 0;
};

export const removeJobBookmark = async (userId: string, jobId: string) => {
  const query = `UPDATE job_bookmarks SET deleted_at = NOW() WHERE user_id = $1 AND job_id = $2`;
  const result = await pool.query(query, [userId, jobId]);
  return (result.rowCount ?? 0) > 0;
};

export const checkLectureBookmarkExists = async (userId: string, lectureId: string) => {
  const query = `SELECT id FROM lecture_bookmarks WHERE user_id = $1 AND lecture_id = $2 AND deleted_at IS NULL`;
  const result = await pool.query(query, [userId, lectureId]);
  return result.rows.length > 0;
};

export const createLectureBookmark = async (userId: string, lectureId: string) => {
  const query = `INSERT INTO lecture_bookmarks (user_id, lecture_id) VALUES ($1, $2) RETURNING *`;
  const result = await pool.query(query, [userId, lectureId]);
  return result.rows[0];
};

export const removeLectureBookmark = async (userId: string, lectureId: string) => {
  const query = `UPDATE lecture_bookmarks SET deleted_at = NOW() WHERE user_id = $1 AND lecture_id = $2`;
  const result = await pool.query(query, [userId, lectureId]);
  return (result.rowCount ?? 0) > 0;
};

export const getLectureCommentById = async (commentId: string) => {
  const query = `SELECT * FROM lecture_comments WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [commentId]);
  return result.rows[0] || null;
};

export const getLectureCommentReplies = async (commentId: string) => {
  const query = `SELECT * FROM comment_replies WHERE comment_id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [commentId]);
  return result.rows;
};

export const createLectureComment = async (commentData: any) => {
  const query = `
    INSERT INTO lecture_comments (lecture_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [commentData.lectureId, commentData.userId, commentData.content];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateLectureComment = async (commentId: string, content: string) => {
  const query = `UPDATE lecture_comments SET content = $1 WHERE id = $2`;
  const result = await pool.query(query, [content, commentId]);
  return (result.rowCount ?? 0) > 0;
};

export const deleteLectureComment = async (commentId: string) => {
  const query = `UPDATE lecture_comments SET deleted_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [commentId]);
  return (result.rowCount ?? 0) > 0;
};

export const getForumById = async (forumId: string) => {
  const query = `SELECT * FROM forum_posts WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [forumId]);
  return result.rows[0] || null;
};

// 범용 조회수 증가 함수
export const incrementViewCount = async (
  contentType: 'forum' | 'job' | 'lecture' | 'resume' | 'transfer',
  contentId: string,
  userIdentifier: string,
  userId?: string
) => {
  try {
    // 조회 기록 확인 (24시간 내 중복 조회 방지)
    const checkQuery = `
      SELECT id FROM view_logs 
      WHERE content_type = $1 
      AND content_id = $2 
      AND (user_id = $3 OR user_identifier = $4)
      AND created_at > NOW() - INTERVAL '24 hours'
    `;
    
    const existingView = await pool.query(checkQuery, [
      contentType,
      contentId, 
      userId || null, 
      userIdentifier
    ]);

    // 이미 24시간 내에 조회한 기록이 있으면 조회수 증가하지 않음
    if (existingView.rows.length > 0) {
      return false;
    }

    // 트랜잭션 시작
    await pool.query('BEGIN');

    // 콘텐츠 유형에 따른 테이블명과 컬럼명 매핑
    const tableMap = {
      forum: 'forum_posts',
      job: 'job_postings', 
      lecture: 'lectures',
      resume: 'veterinarian_profiles',
      transfer: 'transfers'
    };

    const tableName = tableMap[contentType];
    
    // 조회수 증가
    const updateQuery = `UPDATE ${tableName} SET view_count = view_count + 1 WHERE id = $1`;
    await pool.query(updateQuery, [contentId]);

    // 조회 기록 저장
    const logQuery = `
      INSERT INTO view_logs (content_type, content_id, user_id, user_identifier, ip_address, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    await pool.query(logQuery, [contentType, contentId, userId || null, userIdentifier, userIdentifier]);

    await pool.query('COMMIT');
    return true;
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`Error incrementing ${contentType} view count:`, error);
    return false;
  }
};

// 기존 함수들은 새로운 범용 함수를 사용하도록 수정
export const incrementForumViewCount = async (
  forumId: string, 
  userIdentifier: string,
  userId?: string
) => {
  return incrementViewCount('forum', forumId, userIdentifier, userId);
};

export const getForumComments = async (forumId: string) => {
  const query = `SELECT * FROM forum_comments WHERE forum_id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [forumId]);
  return result.rows;
};

export const updateForum = async (forumId: string, updateData: any) => {
  const query = `UPDATE forum_posts SET title = $1, content = $2 WHERE id = $3`;
  const result = await pool.query(query, [updateData.title, updateData.content, forumId]);
  return (result.rowCount ?? 0) > 0;
};

export const deleteForum = async (forumId: string) => {
  const query = `UPDATE forum_posts SET deleted_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [forumId]);
  return (result.rowCount ?? 0) > 0;
};

export const getForumsWithPagination = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM forum_posts 
    WHERE deleted_at IS NULL 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

export const createForum = async (forumData: any) => {
  const query = `
    INSERT INTO forum_posts (user_id, title, content, category, tags)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [forumData.userId, forumData.title, forumData.content, forumData.category, forumData.tags];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getRecentLectures = async (limit = 5) => {
  const query = `SELECT * FROM lectures WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1`;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

export const getRecentResumes = async (limit = 5) => {
  const query = `SELECT * FROM resumes WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1`;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

export const getRecentTransfers = async (limit = 5) => {
  const query = `SELECT * FROM transfers WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1`;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

export const getHomepageBanners = async () => {
  return []; // 배너 데이터 반환
};

export const getHospitalEvaluationById = async (evaluationId: string) => {
  const query = `SELECT * FROM hospital_evaluations WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [evaluationId]);
  return result.rows[0] || null;
};

export const updateHospitalEvaluation = async (evaluationId: string, updateData: any) => {
  const query = `UPDATE hospital_evaluations SET rating = $1, comment = $2 WHERE id = $3`;
  const result = await pool.query(query, [updateData.rating, updateData.comment, evaluationId]);
  return (result.rowCount ?? 0) > 0;
};

export const deleteHospitalEvaluation = async (evaluationId: string) => {
  const query = `UPDATE hospital_evaluations SET deleted_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [evaluationId]);
  return (result.rowCount ?? 0) > 0;
};

export const getHospitalEvaluations = async (hospitalId: string) => {
  const query = `SELECT * FROM hospital_evaluations WHERE hospital_id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [hospitalId]);
  return result.rows;
};

export const createHospitalEvaluation = async (evaluationData: any) => {
  const query = `
    INSERT INTO hospital_evaluations (hospital_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [evaluationData.hospitalId, evaluationData.userId, evaluationData.rating, evaluationData.comment];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getHospitalById = async (hospitalId: string) => {
  const query = `
    SELECT u.*, hp.* FROM users u
    JOIN hospital_profiles hp ON u.id = hp.user_id
    WHERE u.id = $1 AND u.deleted_at IS NULL
  `;
  const result = await pool.query(query, [hospitalId]);
  return result.rows[0] || null;
};

export const updateHospitalProfile = async (hospitalId: string, updateData: any) => {
  const query = `UPDATE hospital_profiles SET hospital_name = $1, description = $2 WHERE user_id = $3`;
  const result = await pool.query(query, [updateData.hospitalName, updateData.description, hospitalId]);
  return (result.rowCount ?? 0) > 0;
};

export const getHospitalsWithPagination = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT u.*, hp.* FROM users u
    JOIN hospital_profiles hp ON u.id = hp.user_id
    WHERE u.deleted_at IS NULL
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

export const deleteJobPosting = async (jobId: string) => {
  const query = `UPDATE jobs SET deleted_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [jobId]);
  return (result.rowCount ?? 0) > 0;
};

export const getResumeEvaluationById = async (evaluationId: string) => {
  const query = `SELECT * FROM resume_evaluations WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [evaluationId]);
  return result.rows[0] || null;
};

export const updateResumeEvaluation = async (evaluationId: string, updateData: any) => {
  const query = `UPDATE resume_evaluations SET rating = $1, comment = $2 WHERE id = $3`;
  const result = await pool.query(query, [updateData.rating, updateData.comment, evaluationId]);
  return (result.rowCount ?? 0) > 0;
};

export const deleteResumeEvaluation = async (evaluationId: string) => {
  const query = `UPDATE resume_evaluations SET deleted_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [evaluationId]);
  return (result.rowCount ?? 0) > 0;
};

export const getResumeEvaluations = async (resumeId: string) => {
  const query = `SELECT * FROM resume_evaluations WHERE resume_id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [resumeId]);
  return result.rows;
};

export const createResumeEvaluation = async (evaluationData: any) => {
  const query = `
    INSERT INTO resume_evaluations (resume_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [evaluationData.resumeId, evaluationData.userId, evaluationData.rating, evaluationData.comment];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getTransferById = async (transferId: string) => {
  const query = `SELECT * FROM transfers WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [transferId]);
  return result.rows[0] || null;
};

export const checkTransferBookmarkExists = async (userId: string, transferId: string) => {
  const query = `SELECT id FROM transfer_bookmarks WHERE user_id = $1 AND transfer_id = $2 AND deleted_at IS NULL`;
  const result = await pool.query(query, [userId, transferId]);
  return result.rows.length > 0;
};

export const createTransferBookmark = async (userId: string, transferId: string) => {
  const query = `INSERT INTO transfer_bookmarks (user_id, transfer_id) VALUES ($1, $2) RETURNING *`;
  const result = await pool.query(query, [userId, transferId]);
  return result.rows[0];
};

export const removeTransferBookmark = async (userId: string, transferId: string) => {
  const query = `UPDATE transfer_bookmarks SET deleted_at = NOW() WHERE user_id = $1 AND transfer_id = $2`;
  const result = await pool.query(query, [userId, transferId]);
  return (result.rowCount ?? 0) > 0;
};

export const incrementTransferViewCount = async (transferId: string) => {
  const query = `UPDATE transfers SET view_count = view_count + 1 WHERE id = $1`;
  const result = await pool.query(query, [transferId]);
  return (result.rowCount ?? 0) > 0;
};

export const getRelatedTransfers = async (transferId: string, limit = 5) => {
  const query = `
    SELECT * FROM transfers 
    WHERE id != $1 AND deleted_at IS NULL 
    ORDER BY created_at DESC 
    LIMIT $2
  `;
  const result = await pool.query(query, [transferId, limit]);
  return result.rows;
};

export const updateTransfer = async (transferId: string, updateData: any) => {
  const query = `UPDATE transfers SET title = $1, description = $2, price = $3 WHERE id = $4`;
  const result = await pool.query(query, [updateData.title, updateData.description, updateData.price, transferId]);
  return (result.rowCount ?? 0) > 0;
};

export const deleteTransfer = async (transferId: string) => {
  const query = `UPDATE transfers SET deleted_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [transferId]);
  return (result.rowCount ?? 0) > 0;
};

export const getTransfersWithPagination = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM transfers 
    WHERE deleted_at IS NULL 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

export const createTransfer = async (transferData: any) => {
  const query = `
    INSERT INTO transfers (user_id, title, description, location, price, category, images, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [
    transferData.userId,
    transferData.title,
    transferData.description,
    transferData.location,
    transferData.price,
    transferData.category,
    transferData.images,
    transferData.status
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// ============================================================================
// 회원 탈퇴 및 복구 관련 함수들
// ============================================================================

export const softDeleteUser = async (userId: string, reason?: string) => {
  const deletedAt = new Date();
  
  const query = `
    UPDATE users 
    SET deleted_at = $1, withdraw_reason = $2, is_active = false
    WHERE id = $3
    RETURNING *
  `;
  
  const result = await pool.query(query, [deletedAt, reason, userId]);
  return result.rows[0];
};

export const softDeleteUserData = async (userId: string) => {
  const deletedAt = new Date();
  
  await pool.query("BEGIN");
  
  try {
    // 수의사 프로필 관련 데이터 soft delete
    await pool.query(`
      UPDATE veterinarians 
      SET deleted_at = $1 
      WHERE user_id = $2
    `, [deletedAt, userId]);
    
    // 병원 프로필 관련 데이터 soft delete
    await pool.query(`
      UPDATE hospitals 
      SET deleted_at = $1 
      WHERE user_id = $2
    `, [deletedAt, userId]);
    
    // 채용공고 soft delete
    await pool.query(`
      UPDATE job_postings 
      SET deleted_at = $1 
      WHERE hospital_id IN (SELECT id FROM hospitals WHERE user_id = $2)
    `, [deletedAt, userId]);
    
    // 북마크 soft delete
    await pool.query(`
      UPDATE job_bookmarks 
      SET deleted_at = $1 
      WHERE user_id = $2
    `, [deletedAt, userId]);
    
    await pool.query(`
      UPDATE resume_bookmarks 
      SET deleted_at = $1 
      WHERE user_id = $2
    `, [deletedAt, userId]);
    
    // 지원서 soft delete
    await pool.query(`
      UPDATE applications 
      SET deleted_at = $1 
      WHERE veterinarian_id IN (SELECT id FROM veterinarians WHERE user_id = $2)
    `, [deletedAt, userId]);
    
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

export const findDeletedAccount = async (phone: string) => {
  const query = `
    SELECT * FROM users 
    WHERE phone = $1 AND deleted_at IS NOT NULL AND is_active = false
    ORDER BY deleted_at DESC
    LIMIT 1
  `;
  
  const result = await pool.query(query, [phone]);
  return result.rows[0] || null;
};

export const restoreAccount = async (userId: string) => {
  const restoredAt = new Date();
  
  const query = `
    UPDATE users 
    SET deleted_at = NULL, withdraw_reason = NULL, is_active = true, restored_at = $1
    WHERE id = $2
    RETURNING *
  `;
  
  const result = await pool.query(query, [restoredAt, userId]);
  return result.rows[0];
};

export const restoreUserData = async (userId: string) => {
  await pool.query("BEGIN");
  
  try {
    // 수의사 프로필 복구
    await pool.query(`
      UPDATE veterinarians 
      SET deleted_at = NULL 
      WHERE user_id = $1 AND deleted_at IS NOT NULL
    `, [userId]);
    
    // 병원 프로필 복구
    await pool.query(`
      UPDATE hospitals 
      SET deleted_at = NULL 
      WHERE user_id = $1 AND deleted_at IS NOT NULL
    `, [userId]);
    
    // 채용공고 복구
    await pool.query(`
      UPDATE job_postings 
      SET deleted_at = NULL 
      WHERE hospital_id IN (SELECT id FROM hospitals WHERE user_id = $1) 
      AND deleted_at IS NOT NULL
    `, [userId]);
    
    // 북마크 복구
    await pool.query(`
      UPDATE job_bookmarks 
      SET deleted_at = NULL 
      WHERE user_id = $1 AND deleted_at IS NOT NULL
    `, [userId]);
    
    await pool.query(`
      UPDATE resume_bookmarks 
      SET deleted_at = NULL 
      WHERE user_id = $1 AND deleted_at IS NOT NULL
    `, [userId]);
    
    // 지원서 복구
    await pool.query(`
      UPDATE applications 
      SET deleted_at = NULL 
      WHERE veterinarian_id IN (SELECT id FROM veterinarians WHERE user_id = $1) 
      AND deleted_at IS NOT NULL
    `, [userId]);
    
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

export const generateTokens = async (user: any) => {
  // 실제 구현에서는 JWT 라이브러리 사용
  return {
    accessToken: `access_${user.id}_${Date.now()}`,
    refreshToken: `refresh_${user.id}_${Date.now()}`,
  };
};
