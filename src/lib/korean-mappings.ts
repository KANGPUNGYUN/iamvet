// 한국어 매핑 상수들
export const KOREAN_MAPPINGS = {
  // 직업/포지션 매핑
  position: {
    veterinarian: "수의사",
    "veterinary-student": "수의대생",
    hospital: "병원",
    nurse: "간호사",
    assistant: "보조직",
    technician: "기술자",
    manager: "관리자",
    doctor: "수의사",
    intern: "인턴",
    resident: "레지던트",
    specialist: "전문의",
    general: "일반수의사",
    emergency: "응급수의사",
    surgery: "외과수의사",
    internal: "내과수의사",
    dental: "치과수의사",
    clinical: "임상수의사",
  } as Record<string, string>,

  // 학력 수준 매핑
  degree: {
    bachelor: "학사",
    master: "석사",
    doctorate: "박사",
    phd: "박사",
    associate: "전문학사",
    diploma: "디플로마",
    certificate: "수료증",
    highschool: "고등학교",
    college: "대학교",
    graduate: "대학원",
    undergraduate: "학부",
  } as Record<string, string>,

  // 졸업 상태 매핑
  graduationStatus: {
    graduated: "졸업",
    attending: "재학",
    dropout: "중퇴",
    leave: "휴학",
    expected: "졸업예정",
    completed: "수료",
    ongoing: "재학중",
    finished: "졸업",
    current: "재학중",
    enrolled: "재학중",
  } as Record<string, string>,

  // 진료 분야 매핑
  specialties: {
    // 일반 진료분야
    internal: "내과",
    "internal-medicine": "내과",
    internal_medicine: "내과",
    INTERNAL_MEDICINE: "내과",
    surgery: "외과",
    SURGERY: "외과",
    dermatology: "피부과",
    DERMATOLOGY: "피부과",
    dentistry: "치과",
    DENTISTRY: "치과",
    dental: "치과",
    ophthalmology: "안과",
    OPHTHALMOLOGY: "안과",
    neurology: "신경과",
    NEUROLOGY: "신경과",
    orthopedics: "정형외과",
    ORTHOPEDICS: "정형외과",
    cardiology: "심장내과",
    CARDIOLOGY: "심장내과",
    oncology: "종양학",
    ONCOLOGY: "종양학",
    radiology: "영상의학과",
    RADIOLOGY: "영상의학과",
    anesthesia: "마취과",
    ANESTHESIA: "마취과",
    emergency: "응급의학과",
    EMERGENCY: "응급의학과",
    pathology: "병리학과",
    PATHOLOGY: "병리학과",
    laboratory: "임상병리과",
    LABORATORY: "임상병리과",
    reproduction: "번식학과",
    REPRODUCTION: "번식학과",
    exotic: "특수동물의학과",
    EXOTIC: "특수동물의학과",
    wildlife: "야생동물의학과",
    WILDLIFE: "야생동물의학과",

    // 한국어 진료분야 (그대로 유지)
    소동물내과: "소동물내과",
    대동물내과: "대동물내과",
    영상진단: "영상진단",
    병리학: "병리학",
    응급처치: "응급처치",
  } as Record<string, string>,

  // 숙련도 레벨 매핑
  proficiency: {
    beginner: "초급",
    intermediate: "중급",
    advanced: "고급",
    expert: "전문가",
    basic: "기초",
    proficient: "숙련",
    master: "마스터",
    novice: "초보",
    skilled: "숙련됨",
    excellent: "우수",
  } as Record<string, string>,

  // 동물 유형 매핑
  animalType: {
    DOG: "강아지",
    CAT: "고양이",
    EXOTIC: "특수동물",
    LARGE_ANIMAL: "대동물",
    BIRD: "조류",
    REPTILE: "파충류",
    FISH: "어류",
    SMALL_ANIMAL: "소동물",
    HORSE: "말",
    COW: "소",
    PIG: "돼지",
    SHEEP: "양",
    GOAT: "염소",
    RABBIT: "토끼",
    HAMSTER: "햄스터",
    GUINEA_PIG: "기니피그",
    FERRET: "페럿",
  } as Record<string, string>,

  // 근무 형태 매핑
  workType: {
    "full-time": "정규직",
    "part-time": "파트타임",
    contract: "계약직",
    temporary: "임시직",
    internship: "인턴십",
    freelance: "프리랜서",
    consultant: "컨설턴트",
    volunteer: "자원봉사",
    정규직: "정규직", // 이미 한국어인 경우 그대로
    파트타임: "파트타임",
    계약직: "계약직",
  } as Record<string, string>,

  // 유저 타입 매핑
  userType: {
    VETERINARIAN: "수의사",
    HOSPITAL: "병원",
    VETERINARY_STUDENT: "수의대생",
    veterinarian: "수의사",
    hospital: "병원",
    "veterinary-student": "수의대생",
    student: "학생",
  } as Record<string, string>,

  // 상태 매핑
  status: {
    ACTIVE: "활성",
    INACTIVE: "비활성",
    PENDING: "승인대기",
    SUSPENDED: "정지",
    APPROVED: "승인됨",
    REJECTED: "거부됨",
    DRAFT: "임시저장",
    PUBLISHED: "게시됨",
    DELETED: "삭제됨",
  } as Record<string, string>,
} as const;

// 매핑 헬퍼 함수들
export function mapToKorean(
  category: keyof typeof KOREAN_MAPPINGS,
  value: string | undefined | null
): string {
  if (!value) return "";

  const mapping = KOREAN_MAPPINGS[category];
  return mapping[value] || value; // 매핑이 없으면 원본 값 반환
}

// 배열 매핑 함수
export function mapArrayToKorean(
  category: keyof typeof KOREAN_MAPPINGS,
  values: string[]
): string[] {
  return values.map((value) => mapToKorean(category, value));
}

// 여러 카테고리를 한번에 매핑하는 함수
export function mapMultipleToKorean(
  mappings: Record<
    string,
    { category: keyof typeof KOREAN_MAPPINGS; value: string }
  >
): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(mappings).forEach(([key, { category, value }]) => {
    result[key] = mapToKorean(category, value);
  });

  return result;
}

// 특정 매핑 함수들 (자주 사용되는 것들)
export const mapPosition = (value: string | undefined | null) =>
  mapToKorean("position", value);
export const mapDegree = (value: string | undefined | null) =>
  mapToKorean("degree", value);
export const mapGraduationStatus = (value: string | undefined | null) =>
  mapToKorean("graduationStatus", value);
export const mapSpecialty = (value: string | undefined | null) =>
  mapToKorean("specialties", value);
export const mapSpecialties = (values: string[]) =>
  mapArrayToKorean("specialties", values);
export const mapProficiency = (value: string | undefined | null) =>
  mapToKorean("proficiency", value);
export const mapAnimalType = (value: string | undefined | null) =>
  mapToKorean("animalType", value);
export const mapWorkType = (value: string | undefined | null) =>
  mapToKorean("workType", value);
export const mapUserType = (value: string | undefined | null) =>
  mapToKorean("userType", value);
export const mapStatus = (value: string | undefined | null) =>
  mapToKorean("status", value);
