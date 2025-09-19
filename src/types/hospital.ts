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