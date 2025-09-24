export interface Hospital {
  id: string;
  name: string;
  address: string;
  detailAddress?: string;
  summary?: string;
  contact?: string;
  email?: string;
  website?: string;
  establishedYear?: string;
  logo?: string;
  introduction?: string;
  businessType?: string;
  specialties?: string[];
  facilityImages?: string[];
}

export interface HospitalDetail extends Hospital {
  jobPostings: JobPosting[];
  jobCount: number;
}

export interface JobPosting {
  id: string;
  title: string;
  position?: string;
  location?: string;
  workType?: string[];
  experience?: string[];
  isUnlimitedRecruit?: boolean;
  recruitEndDate?: string;
  major?: string[];
  salaryType?: string;
  salary?: string;
  workDays?: string[];
  isWorkDaysNegotiable?: boolean;
  workStartTime?: string;
  workEndTime?: string;
  isWorkTimeNegotiable?: boolean;
  benefits?: string;
  education?: string[];
  certifications?: string[];
  experienceDetails?: string[];
  preferences?: string[];
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  department?: string;
  hospitalId?: string;
  hospitalName?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isBookmarked?: boolean;
}

// === 병원 회원가입 관련 타입 ===

// 사업자등록증 파일 정보
export interface BusinessLicenseFile {
  file: File | null;
  url: string | null;
  fileName: string | null;
  fileType: string | null;
  mimeType: string | null;
  fileSize: number | null;
}

// 병원 회원가입 폼 데이터
export interface HospitalRegistrationData {
  // 계정 정보
  loginId: string;
  password: string;
  passwordConfirm: string;
  
  // 기본 정보
  realName: string; // 대표자명
  hospitalName: string;
  establishedDate: string;
  businessNumber: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  detailAddress: string;
  hospitalLogo: string | null;
  
  // 진료 정보
  treatmentAnimals: string[];
  treatmentSpecialties: string[];
  
  // 사업자등록증
  businessLicense: BusinessLicenseFile;
  
  // 약관 동의
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}