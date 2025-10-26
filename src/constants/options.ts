// 전공 분야 / 진료 분야 통일 옵션
export const majorOptions = [
  { value: "내과", label: "내과" },
  { value: "외과", label: "외과" },
  { value: "치과", label: "치과" },
  { value: "피부과", label: "피부과" },
  { value: "안과", label: "안과" },
  { value: "산양의학", label: "산양의학" },
  { value: "정형외과", label: "정형외과" },
  { value: "행동의학", label: "행동의학" },
];

// 근무 형태 옵션
export const workTypeOptions = [
  { value: "정규직", label: "정규직" },
  { value: "계약직", label: "계약직" },
  { value: "인턴", label: "인턴" },
  { value: "파트타임", label: "파트타임" },
];

// 경력 옵션
export const experienceOptions = [
  { value: "신입", label: "신입" },
  { value: "1년차", label: "1년차" },
  { value: "2-3년차", label: "2-3년차" },
  { value: "4-5년차", label: "4-5년차" },
  { value: "5년차 이상", label: "5년차 이상" },
];

// 직무 옵션
export const positionOptions = [
  { value: "수의사", label: "수의사" },
  { value: "간호조무사", label: "간호조무사" },
  { value: "원무과", label: "원무과" },
  { value: "기타", label: "기타" },
];

// 급여 타입 옵션
export const salaryTypeOptions = [
  { value: "연봉", label: "연봉" },
  { value: "월급", label: "월급" },
  { value: "시급", label: "시급" },
];

// 동물 타입 옵션
export const animalTypeOptions = [
  { value: "강아지", label: "강아지" },
  { value: "고양이", label: "고양이" },
  { value: "특수동물", label: "특수동물" },
  { value: "대동물", label: "대동물" },
];

// 전공 분야를 specialtyOptions로도 export (호환성)
export const specialtyOptions = majorOptions;

// 진료 분야를 fieldOptions로도 export (호환성)
export const fieldOptions = majorOptions;