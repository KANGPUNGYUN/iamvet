// 공통 회원가입 폼 타입 정의

export interface BaseRegistrationData {
  userId: string;
  password: string;
  passwordConfirm: string;
  realName: string;
  nickname: string;
  phone: string;
  email: string;
  birthDate: string;
  profileImage: string | null;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export interface VeterinarianRegistrationData extends BaseRegistrationData {
  licenseImage: string | null;
}

export interface VeterinaryStudentRegistrationData extends BaseRegistrationData {
  universityEmail: string;
}

export interface DuplicateCheckState {
  checked: boolean;
  available: boolean;
  message: string;
}

export interface InputErrorState {
  userId: string;
  password: string;
  passwordConfirm: string;
  realName: string;
  nickname: string;
  phone: string;
  email: string;
  universityEmail?: string;
  birthDate: string;
}

export type UserRegistrationType = 'veterinarian' | 'veterinary-student';