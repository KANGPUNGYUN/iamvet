"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { SelectBox } from "@/components/ui/SelectBox";
import { FilterBox } from "@/components/ui/FilterBox";
import { Radio } from "@/components/ui/Input/Radio";
import { DatePicker } from "@/components/ui/DatePicker";
import { Textarea } from "@/components/ui/Input/Textarea";
import { Button } from "@/components/ui/Button";
import { ResumeImageUpload } from "@/components/features/resume/ResumeImageUpload";
import { WeekdaySelector } from "@/components/features/resume/WeekdaySelector";
import {
  PlusIcon,
  MinusIcon,
  DownloadIcon,
  PdfIcon,
  WordIcon,
  ExcelIcon,
} from "public/icons";
import { DocumentUpload } from "@/components/features/profile/DocumentUpload";
import {
  formatPhoneNumber,
  formatBirthDate,
  validatePhoneNumber,
  validateBirthDate,
  validateEmail,
} from "@/utils/validation";
import {
  useVeterinarianResume,
  useSaveVeterinarianResume,
  type ResumeUpdateData,
  type VeterinarianResume,
} from "@/hooks/useResume";
import { useAuthStore } from "@/stores/authStore";
import { majorOptions, workTypeOptions } from "@/constants/options";

// ID 생성 유틸리티
const generateResumeId = (
  type: "exp" | "lic" | "edu" | "cap",
  timestamp: number = Date.now()
) => {
  const typeMap = {
    exp: "experience",
    lic: "license",
    edu: "education",
    cap: "capability",
  };
  return `resume_${typeMap[type]}_${timestamp}`;
};

// 타입 정의
interface Experience {
  id: string;
  hospitalName: string;
  mainTasks: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface License {
  id: string;
  name: string;
  issuer: string;
  acquiredDate: Date | null;
}

interface Education {
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

interface MedicalCapability {
  id: string;
  field: string;
  proficiency: string;
  description: string;
  others: string;
}

interface PortfolioFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}

interface ResumeData {
  photo: string | null;
  name: string;
  birthDate: string;
  introduction: string;
  phone: string;
  email: string;
  phonePublic: boolean;
  emailPublic: boolean;
  position: string;
  specialties: string[];
  preferredRegions: string[];
  expectedSalary: string;
  workTypes: string[];
  startDate: string;
  preferredWeekdays: string[];
  weekdaysNegotiable: boolean;
  workStartTime: string;
  workEndTime: string;
  workTimeNegotiable: boolean;
  experiences: Experience[];
  licenses: License[];
  educations: Education[];
  medicalCapabilities: MedicalCapability[];
  selfIntroduction: string;
  portfolioFiles: PortfolioFile[];
}

// IconButton 컴포넌트
const IconButton = ({
  isFirst,
  onClick,
}: {
  isFirst: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-[52px] h-[52px] rounded-[8px] flex items-center justify-center ${
      isFirst ? "bg-[#FBFBFB]" : "bg-[#3B394D]"
    }`}
  >
    {isFirst ? (
      <PlusIcon size="28" currentColor="#3B394D" />
    ) : (
      <MinusIcon currentColor="#EFEFF0" />
    )}
  </button>
);

// 옵션 데이터
const positionOptions = [
  { value: "veterinarian", label: "수의사" },
  { value: "assistant", label: "수의테크니션" },
  { value: "manager", label: "병원장" },
];

// specialtyOptions는 majorOptions로 대체
const specialtyOptions = majorOptions;

const regionOptions = [
  { value: "seoul", label: "서울" },
  { value: "busan", label: "부산" },
  { value: "daegu", label: "대구" },
  { value: "incheon", label: "인천" },
  { value: "gwangju", label: "광주" },
  { value: "daejeon", label: "대전" },
  { value: "ulsan", label: "울산" },
  { value: "gyeonggi", label: "경기" },
  { value: "gangwon", label: "강원" },
  { value: "chungbuk", label: "충북" },
  { value: "chungnam", label: "충남" },
  { value: "jeonbuk", label: "전북" },
  { value: "jeonnam", label: "전남" },
  { value: "gyeongbuk", label: "경북" },
  { value: "gyeongnam", label: "경남" },
  { value: "jeju", label: "제주" },
];

// workTypeOptions는 constants에서 import

const startDateOptions = [
  { value: "immediate", label: "즉시 가능" },
  { value: "1month", label: "1개월 후" },
  { value: "2month", label: "2개월 후" },
  { value: "3month", label: "3개월 후" },
  { value: "negotiable", label: "협의 가능" },
];

const timeOptions = [
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
];

const degreeOptions = [
  { value: "bachelor", label: "학사" },
  { value: "master", label: "석사" },
  { value: "doctor", label: "박사" },
];

const graduationStatusOptions = [
  { value: "graduated", label: "졸업" },
  { value: "expected", label: "졸업예정" },
  { value: "attending", label: "재학중" },
];

// medicalFieldOptions는 majorOptions로 대체
const medicalFieldOptions = majorOptions;

const proficiencyOptions = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
  { value: "expert", label: "전문가" },
];

export default function ResumePage() {
  const router = useRouter();

  // 회원정보를 기본값으로 사용하지 않음
  const {
    data: existingResume,
    isLoading: resumeLoading,
    error: resumeError,
  } = useVeterinarianResume();
  const saveResumeMutation = useSaveVeterinarianResume();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    birthDate: "",
    email: "",
  });

  const [resumeData, setResumeData] = useState<ResumeData>({
    photo: null,
    name: "",
    birthDate: "",
    introduction: "",
    phone: "",
    email: "",
    phonePublic: false,
    emailPublic: false,
    position: "",
    specialties: [],
    preferredRegions: [],
    expectedSalary: "",
    workTypes: [],
    startDate: "",
    preferredWeekdays: [],
    weekdaysNegotiable: false,
    workStartTime: "",
    workEndTime: "",
    workTimeNegotiable: false,
    experiences: [
      {
        id: generateResumeId("exp"),
        hospitalName: "",
        mainTasks: "",
        startDate: null,
        endDate: null,
      },
    ],
    licenses: [
      {
        id: generateResumeId("lic"),
        name: "",
        issuer: "",
        acquiredDate: null,
      },
    ],
    educations: [
      {
        id: generateResumeId("edu"),
        degree: "",
        graduationStatus: "",
        schoolName: "",
        major: "",
        gpa: "",
        totalGpa: "",
        startDate: null,
        endDate: null,
      },
    ],
    medicalCapabilities: [
      {
        id: generateResumeId("cap"),
        field: "",
        proficiency: "",
        description: "",
        others: "",
      },
    ],
    selfIntroduction: "",
    portfolioFiles: [],
  });

  // 기존 이력서 데이터가 있으면 폼에 반영
  useEffect(() => {
    if (existingResume) {
      // 기존 이력서가 있는 경우 - 모든 필드 설정
      setResumeData((prev) => ({
        ...prev,
        photo: existingResume.photo || null,
        name: existingResume.name || "",
        birthDate: existingResume.birthDate || "",
        introduction: existingResume.introduction || "",
        phone: existingResume.phone || "",
        email: existingResume.email || "",
        phonePublic: existingResume.phonePublic || false,
        emailPublic: existingResume.emailPublic || false,
        position: existingResume.position || "",
        specialties: existingResume.specialties || [],
        preferredRegions: existingResume.preferredRegions || [],
        expectedSalary: existingResume.expectedSalary || "",
        workTypes: existingResume.workTypes || [],
        startDate: existingResume.startDate || "",
        preferredWeekdays: existingResume.preferredWeekdays || [],
        weekdaysNegotiable: existingResume.weekdaysNegotiable || false,
        workStartTime: existingResume.workStartTime || "",
        workEndTime: existingResume.workEndTime || "",
        workTimeNegotiable: existingResume.workTimeNegotiable || false,
        experiences:
          existingResume.experiences?.length > 0
            ? existingResume.experiences
            : [
                {
                  id: "default-1",
                  hospitalName: "",
                  mainTasks: "",
                  startDate: null,
                  endDate: null,
                },
              ],
        licenses:
          existingResume.licenses?.length > 0
            ? existingResume.licenses
            : [
                {
                  id: "default-1",
                  name: "",
                  issuer: "",
                  acquiredDate: null,
                },
              ],
        educations:
          existingResume.educations?.length > 0
            ? existingResume.educations
            : [
                {
                  id: "default-1",
                  degree: "",
                  graduationStatus: "",
                  schoolName: "",
                  major: "",
                  gpa: "",
                  totalGpa: "",
                  startDate: null,
                  endDate: null,
                },
              ],
        medicalCapabilities:
          existingResume.medicalCapabilities?.length > 0
            ? existingResume.medicalCapabilities
            : [
                {
                  id: "default-1",
                  field: "",
                  proficiency: "",
                  description: "",
                  others: "",
                },
              ],
        selfIntroduction: existingResume.selfIntroduction || "",
        portfolioFiles: existingResume.portfolioFiles || [],
      }));
    }
    // 회원정보를 기본값으로 사용하지 않음 - 빈 값으로 시작
  }, [existingResume]);

  // 총 경력 계산 함수
  const calculateTotalExperience = (experiences: Experience[]) => {
    let totalMonths = 0;

    experiences.forEach((exp) => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        totalMonths += months;
      }
    });

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    return `${years}년 ${remainingMonths}개월`;
  };

  // 경력사항 추가
  const addExperience = () => {
    const newExperience: Experience = {
      id: generateResumeId("exp"),
      hospitalName: "",
      mainTasks: "",
      startDate: null,
      endDate: null,
    };
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  };

  // 경력사항 삭제 (최소 1개는 유지)
  const removeExperience = (id: string) => {
    if (resumeData.experiences.length > 1) {
      setResumeData((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((exp) => exp.id !== id),
      }));
    }
  };

  // 자격증 추가
  const addLicense = () => {
    const newLicense: License = {
      id: generateResumeId("lic"),
      name: "",
      issuer: "",
      acquiredDate: null,
    };
    setResumeData((prev) => ({
      ...prev,
      licenses: [...prev.licenses, newLicense],
    }));
  };

  // 자격증 삭제 (최소 1개는 유지)
  const removeLicense = (id: string) => {
    if (resumeData.licenses.length > 1) {
      setResumeData((prev) => ({
        ...prev,
        licenses: prev.licenses.filter((license) => license.id !== id),
      }));
    }
  };

  // 학력 추가
  const addEducation = () => {
    const newEducation: Education = {
      id: generateResumeId("edu"),
      degree: "",
      graduationStatus: "",
      schoolName: "",
      major: "",
      gpa: "",
      totalGpa: "",
      startDate: null,
      endDate: null,
    };
    setResumeData((prev) => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }));
  };

  // 학력 삭제 (최소 1개는 유지)
  const removeEducation = (id: string) => {
    if (resumeData.educations.length > 1) {
      setResumeData((prev) => ({
        ...prev,
        educations: prev.educations.filter((edu) => edu.id !== id),
      }));
    }
  };

  // 진료상세역량 추가
  const addMedicalCapability = () => {
    const newCapability: MedicalCapability = {
      id: generateResumeId("cap"),
      field: "",
      proficiency: "",
      description: "",
      others: "",
    };
    setResumeData((prev) => ({
      ...prev,
      medicalCapabilities: [...prev.medicalCapabilities, newCapability],
    }));
  };

  // 진료상세역량 삭제 (최소 1개는 유지)
  const removeMedicalCapability = (id: string) => {
    if (resumeData.medicalCapabilities.length > 1) {
      setResumeData((prev) => ({
        ...prev,
        medicalCapabilities: prev.medicalCapabilities.filter(
          (cap) => cap.id !== id
        ),
      }));
    }
  };

  // Validation helper functions
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setResumeData((prev) => ({ ...prev, phone: formatted }));

    const validation = validatePhoneNumber(formatted);
    setValidationErrors((prev) => ({
      ...prev,
      phone: validation.isValid ? "" : validation.message || "",
    }));
  };

  const handleBirthDateChange = (value: string) => {
    const formatted = formatBirthDate(value);
    setResumeData((prev) => ({ ...prev, birthDate: formatted }));

    const validation = validateBirthDate(formatted);
    setValidationErrors((prev) => ({
      ...prev,
      birthDate: validation.isValid ? "" : validation.message || "",
    }));
  };

  const handleEmailChange = (value: string) => {
    setResumeData((prev) => ({ ...prev, email: value }));

    const validation = validateEmail(value);
    setValidationErrors((prev) => ({
      ...prev,
      email: validation.isValid ? "" : validation.message || "",
    }));
  };

  // 포트폴리오 파일 추가 (DocumentUpload 컴포넌트와 연동)
  const handlePortfolioUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "portfolios");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("파일 업로드 실패");
        }

        const result = await response.json();
        return {
          id: `portfolio_${Date.now()}_${Math.random()}`,
          fileName: file.name,
          fileUrl: result.url,
          fileType: file.type,
          fileSize: file.size,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      setResumeData((prev) => ({
        ...prev,
        portfolioFiles: uploadedFiles,
      }));
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      alert("파일 업로드에 실패했습니다.");
    }
  };

  // 파일 아이콘 반환 함수
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) {
      return <PdfIcon currentColor="#EF4444" />;
    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      return <WordIcon currentColor="#3B82F6" />;
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      return <ExcelIcon currentColor="#22C55E" />;
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="1" width="10" height="14" rx="1" fill="#6B7280" />
          <path
            d="M5 5h4M5 8h3M5 11h2"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    }
  };

  const handleSave = async () => {
    try {
      // 필수 필드 검증
      if (!resumeData.name.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      if (!resumeData.birthDate.trim()) {
        alert("생년월일을 입력해주세요.");
        return;
      }

      if (!resumeData.phone.trim()) {
        alert("연락처를 입력해주세요.");
        return;
      }

      if (!resumeData.specialties || resumeData.specialties.length === 0) {
        alert("전공분야를 선택해주세요.");
        return;
      }

      // 전화번호 검증
      if (resumeData.phone) {
        const phoneValidation = validatePhoneNumber(resumeData.phone);
        if (!phoneValidation.isValid) {
          alert(phoneValidation.message);
          return;
        }
      }

      // 생년월일 검증
      if (resumeData.birthDate) {
        const birthDateValidation = validateBirthDate(resumeData.birthDate);
        if (!birthDateValidation.isValid) {
          alert(birthDateValidation.message);
          return;
        }
      }

      // 이메일 검증
      if (resumeData.email) {
        const emailValidation = validateEmail(resumeData.email);
        if (!emailValidation.isValid) {
          alert(emailValidation.message);
          return;
        }
      }

      // ResumeData를 ResumeUpdateData 형식으로 변환
      const saveData: ResumeUpdateData = {
        // 기본 정보
        name: resumeData.name,
        introduction: resumeData.introduction,
        selfIntroduction: resumeData.selfIntroduction,
        photo: resumeData.photo || undefined,
        birthDate: resumeData.birthDate,
        phone: resumeData.phone,
        email: resumeData.email,
        phonePublic: resumeData.phonePublic,
        emailPublic: resumeData.emailPublic,

        // 희망 근무 조건
        position: resumeData.position,
        specialties: resumeData.specialties,
        preferredRegions: resumeData.preferredRegions,
        expectedSalary: resumeData.expectedSalary,
        workTypes: resumeData.workTypes,
        startDate: resumeData.startDate,
        preferredWeekdays: resumeData.preferredWeekdays,
        weekdaysNegotiable: resumeData.weekdaysNegotiable,
        workStartTime: resumeData.workStartTime,
        workEndTime: resumeData.workEndTime,
        workTimeNegotiable: resumeData.workTimeNegotiable,

        // 관계 데이터
        experiences: resumeData.experiences.map((exp) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate) : null,
          endDate: exp.endDate ? new Date(exp.endDate) : null,
        })),
        licenses: resumeData.licenses.map((lic) => ({
          ...lic,
          acquiredDate: lic.acquiredDate ? new Date(lic.acquiredDate) : null,
        })),
        educations: resumeData.educations.map((edu) => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate) : null,
          endDate: edu.endDate ? new Date(edu.endDate) : null,
        })),
        medicalCapabilities: resumeData.medicalCapabilities,
        portfolioFiles: resumeData.portfolioFiles,
      };

      console.log("[VeterinarianResumePage] Saving resume data:", saveData);

      await saveResumeMutation.mutateAsync(saveData);

      alert(
        existingResume ? "이력서가 수정되었습니다." : "이력서가 생성되었습니다."
      );

      // 성공 후 대시보드로 이동
      router.push("/dashboard/veterinarian");
    } catch (error) {
      console.error("이력서 저장 실패:", error);
      alert("이력서 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    // 취소 로직 구현
    if (confirm("작성 중인 내용이 삭제됩니다. 정말 취소하시겠습니까?")) {
      // 수의사 대시보드로 이동
      router.push("/dashboard/veterinarian");
    }
  };

  // 로딩 상태
  if (resumeLoading) {
    return (
      <div className="bg-white">
        <div className="max-w-5xl mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">이력서 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto p-4 min-h-screen">
        <div className="mb-6">
          <h1 className="font-title title-medium text-[36px] mb-1">
            나의 이력서
          </h1>
        </div>

        {/* 기본 정보 */}

        <div className="rounded-[16px] border border-[#EFEFF0] py-[60px] px-[30px] flex flex-col gap-[80px]">
          <div className="flex lg:flex-row flex-col gap-6">
            {/* 이력서 사진 */}
            <div>
              <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                이력서 사진
              </label>
              <ResumeImageUpload
                value={resumeData.photo || undefined}
                onChange={(imageUrl) =>
                  setResumeData((prev) => ({ ...prev, photo: imageUrl }))
                }
              />
            </div>

            {/* 기본 정보 폼 */}
            <div className="lg:flex flex-col">
              <div className="lg:flex-row flex flex-col gap-[40px] lg:gap-[24px]">
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <InputBox
                    value={resumeData.name}
                    onChange={(value) =>
                      setResumeData((prev) => ({ ...prev, name: value }))
                    }
                    placeholder="이름"
                  />
                </div>
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    생년월일 <span className="text-red-500">*</span>
                  </label>
                  <InputBox
                    value={resumeData.birthDate}
                    onChange={handleBirthDateChange}
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
                  />
                  {validationErrors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.birthDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="lg:flex-row flex flex-col gap-[40px] lg:gap-[24px] mt-[30px]">
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <InputBox
                    value={resumeData.phone}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    type="tel"
                    maxLength={13}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
                  <div className="mt-1 text-xs">
                    <Checkbox
                      checked={resumeData.phonePublic}
                      onChange={(checked) =>
                        setResumeData((prev) => ({
                          ...prev,
                          phonePublic: checked,
                        }))
                      }
                    >
                      구직을 위한 연락처 노출에 동의합니다.
                    </Checkbox>
                  </div>
                </div>
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    이메일
                  </label>
                  <InputBox
                    value={resumeData.email}
                    onChange={handleEmailChange}
                    placeholder="example@example.com"
                    type="email"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                  <div className="mt-1 text-xs">
                    <Checkbox
                      checked={resumeData.emailPublic}
                      onChange={(checked) =>
                        setResumeData((prev) => ({
                          ...prev,
                          emailPublic: checked,
                        }))
                      }
                    >
                      구직을 위한 이메일 노출에 동의합니다.
                    </Checkbox>
                  </div>
                </div>
              </div>

              {/* 한 줄 소개 - 연락처 이메일 아래로 이동 */}
              <div className="mt-[30px]">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  한 줄 소개
                </label>
                <InputBox
                  value={resumeData.introduction}
                  onChange={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      introduction: value,
                    }))
                  }
                  placeholder="한 줄 소개"
                />
              </div>
            </div>
          </div>

          {/* 희망 근무 조건 */}
          <div className="flex flex-col gap-[40px] lg:gap-[80px]">
            <div className="flex flex-col lg:flex-row gap-[40px]">
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  직무
                </label>
                <SelectBox
                  value={resumeData.position}
                  onChange={(value) =>
                    setResumeData((prev) => ({ ...prev, position: value }))
                  }
                  placeholder="직무"
                  options={positionOptions}
                  className="min-w-[250px]"
                />
              </div>
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  전공 분야 <span className="text-red-500">*</span>
                </label>
                <FilterBox.Group
                  value={resumeData.specialties}
                  onChange={(value) =>
                    setResumeData((prev) => ({ ...prev, specialties: value }))
                  }
                  orientation="horizontal"
                >
                  {specialtyOptions.map((option) => (
                    <FilterBox key={option.value} value={option.value}>
                      {option.label}
                    </FilterBox>
                  ))}
                </FilterBox.Group>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-[40px]">
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  희망 근무 지역
                </label>
                <FilterBox.Group
                  value={resumeData.preferredRegions}
                  onChange={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      preferredRegions: value,
                    }))
                  }
                  orientation="horizontal"
                >
                  {regionOptions.map((option) => (
                    <FilterBox key={option.value} value={option.value}>
                      {option.label}
                    </FilterBox>
                  ))}
                </FilterBox.Group>
              </div>
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  희망 연봉
                </label>
                <InputBox
                  value={resumeData.expectedSalary}
                  onChange={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      expectedSalary: value,
                    }))
                  }
                  placeholder="희망 연봉"
                  suffix="만원"
                  type="number"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-[40px]">
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  희망 근무형태
                </label>
                <FilterBox.Group
                  value={resumeData.workTypes}
                  onChange={(value) =>
                    setResumeData((prev) => ({ ...prev, workTypes: value }))
                  }
                  orientation="horizontal"
                >
                  {workTypeOptions.map((option) => (
                    <FilterBox key={option.value} value={option.value}>
                      {option.label}
                    </FilterBox>
                  ))}
                </FilterBox.Group>
              </div>

              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  입사 가능 시기
                </label>
                <Radio.Group
                  value={resumeData.startDate}
                  onChange={(value) =>
                    setResumeData((prev) => ({ ...prev, startDate: value }))
                  }
                  orientation="horizontal"
                >
                  {startDateOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-[40px]">
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  희망 근무 요일
                </label>
                <div className="flex flex-col gap-[20px]">
                  <WeekdaySelector
                    value={resumeData.preferredWeekdays}
                    onChange={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        preferredWeekdays: value,
                      }))
                    }
                  />
                  <div className="text-xs">
                    <Checkbox
                      checked={resumeData.weekdaysNegotiable}
                      onChange={(checked) =>
                        setResumeData((prev) => ({
                          ...prev,
                          weekdaysNegotiable: checked,
                        }))
                      }
                    >
                      협의 가능
                    </Checkbox>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  희망 근무 시간
                </label>
                <div className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-2">
                    <SelectBox
                      value={resumeData.workStartTime}
                      onChange={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          workStartTime: value,
                        }))
                      }
                      placeholder="시작 시간"
                      options={timeOptions}
                    />
                    <span className="text-gray-500 text-sm">~</span>
                    <SelectBox
                      value={resumeData.workEndTime}
                      onChange={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          workEndTime: value,
                        }))
                      }
                      placeholder="종료 시간"
                      options={timeOptions}
                    />
                  </div>
                  <div className="text-xs">
                    <Checkbox
                      checked={resumeData.workTimeNegotiable}
                      onChange={(checked) =>
                        setResumeData((prev) => ({
                          ...prev,
                          workTimeNegotiable: checked,
                        }))
                      }
                    >
                      협의 가능
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 경력 사항 */}
        <div className="px-[30px] mt-[80px]">
          <div className="flex items-center justify-between mb-[30px] pb-2 border-b">
            <h2 className="font-text text-[20px] font-medium text-primary">
              경력 사항
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[20px] text-primary font-text">
                총 {calculateTotalExperience(resumeData.experiences)}
              </span>
            </div>
          </div>

          <div className="space-y-[20px]">
            {resumeData.experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="flex flex-col xl:flex-row xl:items-end gap-[10px] border border-[#EFEFF0] rounded-[12px] p-[20px] xl:p-[0px] xl:border-none bg-transparent"
              >
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    병원명
                  </label>
                  <InputBox
                    value={experience.hospitalName}
                    onChange={(value) => {
                      setResumeData((prev) => ({
                        ...prev,
                        experiences: prev.experiences.map((exp) =>
                          exp.id === experience.id
                            ? { ...exp, hospitalName: value }
                            : exp
                        ),
                      }));
                    }}
                    placeholder="병원명"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    주요 업무
                  </label>
                  <InputBox
                    value={experience.mainTasks}
                    onChange={(value) => {
                      setResumeData((prev) => ({
                        ...prev,
                        experiences: prev.experiences.map((exp) =>
                          exp.id === experience.id
                            ? { ...exp, mainTasks: value }
                            : exp
                        ),
                      }));
                    }}
                    placeholder="주요 업무"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    입사일
                  </label>
                  <DatePicker
                    value={experience.startDate}
                    onChange={(date) => {
                      setResumeData((prev) => ({
                        ...prev,
                        experiences: prev.experiences.map((exp) =>
                          exp.id === experience.id
                            ? { ...exp, startDate: date }
                            : exp
                        ),
                      }));
                    }}
                    placeholder="입사일"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    퇴사일
                  </label>
                  <DatePicker
                    value={experience.endDate}
                    onChange={(date) => {
                      setResumeData((prev) => ({
                        ...prev,
                        experiences: prev.experiences.map((exp) =>
                          exp.id === experience.id
                            ? { ...exp, endDate: date }
                            : exp
                        ),
                      }));
                    }}
                    placeholder="날짜"
                  />
                </div>
                <div>
                  <IconButton
                    isFirst={index === 0}
                    onClick={() => {
                      if (index === 0) {
                        addExperience();
                      } else {
                        removeExperience(experience.id);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 자격증/면허 */}
        <div className="px-[30px] mt-[80px]">
          <div className="flex items-center justify-between mb-[30px] pb-2 border-b">
            <h2 className="font-text text-[20px] font-medium text-primary">
              자격증/면허
            </h2>
          </div>

          <div className="space-y-[20px]">
            {resumeData.licenses.map((license, index) => (
              <div
                key={license.id}
                className="flex flex-col xl:flex-row xl:items-end gap-[10px] border border-[#EFEFF0] rounded-[12px] p-[20px] xl:p-[0px] xl:border-none bg-transparent"
              >
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    자격증/면허명
                  </label>
                  <InputBox
                    value={license.name}
                    onChange={(value) => {
                      setResumeData((prev) => ({
                        ...prev,
                        licenses: prev.licenses.map((lic) =>
                          lic.id === license.id ? { ...lic, name: value } : lic
                        ),
                      }));
                    }}
                    placeholder="자격증/면허명"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    발급기관
                  </label>
                  <InputBox
                    value={license.issuer}
                    onChange={(value) => {
                      setResumeData((prev) => ({
                        ...prev,
                        licenses: prev.licenses.map((lic) =>
                          lic.id === license.id
                            ? { ...lic, issuer: value }
                            : lic
                        ),
                      }));
                    }}
                    placeholder="발급기관"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    취득일
                  </label>
                  <DatePicker
                    value={license.acquiredDate}
                    onChange={(date) => {
                      setResumeData((prev) => ({
                        ...prev,
                        licenses: prev.licenses.map((lic) =>
                          lic.id === license.id
                            ? { ...lic, acquiredDate: date }
                            : lic
                        ),
                      }));
                    }}
                    placeholder="날짜"
                  />
                </div>
                <div>
                  <IconButton
                    isFirst={index === 0}
                    onClick={() => {
                      if (index === 0) {
                        addLicense();
                      } else {
                        removeLicense(license.id);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 학력 */}
        <div className="px-[30px] mt-[80px]">
          <div className="flex items-center justify-between mb-[30px] pb-2 border-b">
            <h2 className="font-text text-[20px] font-medium text-primary">
              학력
            </h2>
          </div>

          <div className="space-y-[20px]">
            {resumeData.educations.map((education, index) => (
              <div
                key={education.id}
                className="flex flex-col xl:items-start gap-[10px] border border-[#EFEFF0] rounded-[12px] p-[20px] xl:p-[0px] xl:border-none bg-transparent"
              >
                <div className="flex flex-col xl:flex-row gap-[10px]">
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      학위
                    </label>
                    <SelectBox
                      value={education.degree}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, degree: value }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="학위"
                      options={degreeOptions}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      졸업여부
                    </label>
                    <SelectBox
                      value={education.graduationStatus}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, graduationStatus: value }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="졸업여부"
                      options={graduationStatusOptions}
                    />
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-[10px]">
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      학교명
                    </label>
                    <InputBox
                      value={education.schoolName}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, schoolName: value }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="학교명"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      전공명
                    </label>
                    <InputBox
                      value={education.major}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, major: value }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="전공명"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      학점
                    </label>
                    <InputBox
                      value={education.gpa}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, gpa: value }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="학점"
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      총점
                    </label>
                    <InputBox
                      value={education.totalGpa}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, totalGpa: value }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="만점"
                      type="number"
                    />
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-[10px]">
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      입학일
                    </label>
                    <DatePicker
                      value={education.startDate}
                      className="min-w-[200px]"
                      onChange={(date) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, startDate: date }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="날짜"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      졸업일
                    </label>
                    <DatePicker
                      value={education.endDate}
                      className="min-w-[200px]"
                      onChange={(date) => {
                        setResumeData((prev) => ({
                          ...prev,
                          educations: prev.educations.map((edu) =>
                            edu.id === education.id
                              ? { ...edu, endDate: date }
                              : edu
                          ),
                        }));
                      }}
                      placeholder="날짜"
                    />
                  </div>
                </div>
                <div>
                  <IconButton
                    isFirst={index === 0}
                    onClick={() => {
                      if (index === 0) {
                        addEducation();
                      } else {
                        removeEducation(education.id);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 진료상세역량 */}
        <div className="px-[30px] mt-[80px]">
          <div className="flex items-center justify-between mb-[30px] pb-2 border-b">
            <h2 className="font-text text-[20px] font-medium text-primary">
              진료상세역량
            </h2>
          </div>

          <div className="space-y-[20px]">
            {resumeData.medicalCapabilities.map((capability, index) => (
              <div
                key={capability.id}
                className="flex flex-col xl:items-start gap-[10px] border border-[#EFEFF0] rounded-[12px] p-[20px] xl:p-[0px] xl:border-none bg-transparent"
              >
                <div className="flex flex-col xl:flex-row gap-[10px]">
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      분야
                    </label>
                    <SelectBox
                      value={capability.field}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          medicalCapabilities: prev.medicalCapabilities.map(
                            (cap) =>
                              cap.id === capability.id
                                ? { ...cap, field: value }
                                : cap
                          ),
                        }));
                      }}
                      placeholder="분야"
                      options={medicalFieldOptions}
                      className="min-w-[100px]"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      숙련도
                    </label>
                    <SelectBox
                      value={capability.proficiency}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          medicalCapabilities: prev.medicalCapabilities.map(
                            (cap) =>
                              cap.id === capability.id
                                ? { ...cap, proficiency: value }
                                : cap
                          ),
                        }));
                      }}
                      placeholder="숙련도"
                      options={proficiencyOptions}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[10px] w-full">
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      역량 설명
                    </label>
                    <Textarea
                      value={capability.description}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          medicalCapabilities: prev.medicalCapabilities.map(
                            (cap) =>
                              cap.id === capability.id
                                ? { ...cap, description: value }
                                : cap
                          ),
                        }));
                      }}
                      placeholder="역량 설명"
                      rows={3}
                      fullWidth
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      기타
                    </label>
                    <Textarea
                      value={capability.others}
                      onChange={(value) => {
                        setResumeData((prev) => ({
                          ...prev,
                          medicalCapabilities: prev.medicalCapabilities.map(
                            (cap) =>
                              cap.id === capability.id
                                ? { ...cap, others: value }
                                : cap
                          ),
                        }));
                      }}
                      placeholder="기타 사항"
                      rows={3}
                      fullWidth
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <IconButton
                    isFirst={index === 0}
                    onClick={() => {
                      if (index === 0) {
                        addMedicalCapability();
                      } else {
                        removeMedicalCapability(capability.id);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 포트폴리오 */}
        <div className="px-[30px] mt-[80px]">
          <div className="flex items-center justify-between mb-[30px] pb-2 border-b">
            <h2 className="font-text text-[20px] font-medium text-primary">
              포트폴리오
            </h2>
          </div>

          {/* DocumentUpload 컴포넌트 사용 */}
          <DocumentUpload
            value={[]} // DocumentUpload는 새로운 파일 업로드만 처리
            onChange={handlePortfolioUpload}
            maxFiles={5}
            className="mb-6"
          />

          {/* 업로드된 파일 목록 - 강의 상세 페이지 스타일 적용 */}
          {resumeData.portfolioFiles.length > 0 && (
            <div className="p-[20px] bg-[#FAFAFA] rounded-[16px]">
              <h3 className="text-[20px] font-title title-light text-sub mb-[20px]">
                첨부된 포트폴리오 파일
              </h3>
              <div className="space-y-3">
                {resumeData.portfolioFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border border-[#EFEFF0] bg-white rounded-[8px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[16px] h-[16px]">
                        {getFileIcon(file.fileName)}
                      </div>
                      <p className="text-[14px] font-semibold text-[#3B394D]">
                        {file.fileName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // 파일 다운로드 또는 보기 기능
                        if (file.fileUrl) {
                          window.open(file.fileUrl, "_blank");
                        }
                      }}
                      className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] transition-colors hover:bg-gray-100"
                    >
                      <DownloadIcon currentColor="#9098A4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 자기소개 */}
        <div className="px-[30px] mt-[80px] w-full">
          <h2 className="font-text text-[20px] font-medium text-primary mb-[30px] pb-2 border-b">
            자기소개
          </h2>
          <Textarea
            value={resumeData.selfIntroduction}
            onChange={(value) =>
              setResumeData((prev) => ({ ...prev, selfIntroduction: value }))
            }
            placeholder="자기소개"
            rows={6}
            maxLength={1000}
            resize="vertical"
            fullWidth
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center mt-[100px] gap-[30px] pb-6">
          <Button variant="line" size="medium" onClick={handleCancel}>
            취소
          </Button>
          <Button
            variant="default"
            size="medium"
            onClick={handleSave}
            disabled={saveResumeMutation.isPending}
          >
            {saveResumeMutation.isPending
              ? "저장 중..."
              : existingResume
              ? "수정하기"
              : "저장하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
