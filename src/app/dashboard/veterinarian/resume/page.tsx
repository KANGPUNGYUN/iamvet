"use client";

import React, { useState, useEffect } from "react";
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
import { PlusIcon, MinusIcon } from "public/icons";
import { useVeterinarianProfile } from "@/hooks/api/useVeterinarianProfile";
import { useCurrentUser } from "@/hooks/api/useAuth";
import { useDetailedResume, useSaveDetailedResume } from "@/hooks/api/useDetailedResume";
import type { DetailedResumeData } from "@/actions/auth";

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
  grade: string;
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

interface ResumeData {
  photo: File | null;
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

const specialtyOptions = [
  { value: "internal", label: "내과" },
  { value: "surgery", label: "외과" },
  { value: "dermatology", label: "피부과" },
  { value: "orthopedics", label: "정형외과" },
  { value: "ophthalmology", label: "안과" },
  { value: "dentistry", label: "치과" },
];

const regionOptions = [
  { value: "seoul", label: "서울" },
  { value: "busan", label: "부산" },
  { value: "daegu", label: "대구" },
  { value: "incheon", label: "인천" },
  { value: "gwangju", label: "광주" },
  { value: "daejeon", label: "대전" },
];

const workTypeOptions = [
  { value: "fulltime", label: "정규직" },
  { value: "parttime", label: "파트타임" },
  { value: "contract", label: "계약직" },
  { value: "intern", label: "인턴" },
];

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

const gradeOptions = [
  { value: "1", label: "1급" },
  { value: "2", label: "2급" },
  { value: "3", label: "3급" },
  { value: "special", label: "특급" },
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

const medicalFieldOptions = [
  { value: "internal", label: "내과" },
  { value: "surgery", label: "외과" },
  { value: "dermatology", label: "피부과" },
  { value: "orthopedics", label: "정형외과" },
];

const proficiencyOptions = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
  { value: "expert", label: "전문가" },
];

export default function VeterinarianResumePage() {
  const {
    data: veterinarianProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useVeterinarianProfile();
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const {
    data: existingResume,
    isLoading: resumeLoading,
    error: resumeError,
  } = useDetailedResume();
  const saveResumeMutation = useSaveDetailedResume();

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
        id: "default-1",
        hospitalName: "",
        mainTasks: "",
        startDate: null,
        endDate: null,
      },
    ],
    licenses: [
      {
        id: "default-1",
        name: "",
        issuer: "",
        grade: "",
        acquiredDate: null,
      },
    ],
    educations: [
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
    medicalCapabilities: [
      {
        id: "default-1",
        field: "",
        proficiency: "",
        description: "",
        others: "",
      },
    ],
    selfIntroduction: "",
  });

  // 기존 이력서 데이터가 있으면 폼에 반영
  useEffect(() => {
    if (existingResume) {
      setResumeData(prev => ({
        ...prev,
        photo: null, // File 객체는 나중에 처리
        name: existingResume.name,
        birthDate: existingResume.birthDate || "",
        introduction: existingResume.introduction || "",
        phone: existingResume.phone || "",
        email: existingResume.email || "",
        phonePublic: existingResume.phonePublic,
        emailPublic: existingResume.emailPublic,
        position: existingResume.position || "",
        specialties: existingResume.specialties,
        preferredRegions: existingResume.preferredRegions,
        expectedSalary: existingResume.expectedSalary || "",
        workTypes: existingResume.workTypes,
        startDate: existingResume.startDate || "",
        preferredWeekdays: existingResume.preferredWeekdays,
        weekdaysNegotiable: existingResume.weekdaysNegotiable,
        workStartTime: existingResume.workStartTime || "",
        workEndTime: existingResume.workEndTime || "",
        workTimeNegotiable: existingResume.workTimeNegotiable,
        experiences: existingResume.experiences.length > 0 
          ? existingResume.experiences.map(exp => ({
              id: exp.id,
              hospitalName: exp.hospitalName,
              mainTasks: exp.mainTasks,
              startDate: exp.startDate || null,
              endDate: exp.endDate || null,
            }))
          : [{
              id: "default-1",
              hospitalName: "",
              mainTasks: "",
              startDate: null,
              endDate: null,
            }],
        licenses: existingResume.licenses.length > 0
          ? existingResume.licenses.map(lic => ({
              id: lic.id,
              name: lic.name,
              issuer: lic.issuer,
              grade: lic.grade || "",
              acquiredDate: lic.acquiredDate || null,
            }))
          : [{
              id: "default-1",
              name: "",
              issuer: "",
              grade: "",
              acquiredDate: null,
            }],
        educations: existingResume.educations.length > 0
          ? existingResume.educations.map(edu => ({
              id: edu.id,
              degree: edu.degree,
              graduationStatus: edu.graduationStatus,
              schoolName: edu.schoolName,
              major: edu.major,
              gpa: edu.gpa || "",
              totalGpa: edu.totalGpa || "",
              startDate: edu.startDate || null,
              endDate: edu.endDate || null,
            }))
          : [{
              id: "default-1",
              degree: "",
              graduationStatus: "",
              schoolName: "",
              major: "",
              gpa: "",
              totalGpa: "",
              startDate: null,
              endDate: null,
            }],
        medicalCapabilities: existingResume.medicalCapabilities.length > 0
          ? existingResume.medicalCapabilities.map(cap => ({
              id: cap.id,
              field: cap.field,
              proficiency: cap.proficiency,
              description: cap.description || "",
              others: cap.others || "",
            }))
          : [{
              id: "default-1",
              field: "",
              proficiency: "",
              description: "",
              others: "",
            }],
        selfIntroduction: existingResume.selfIntroduction || "",
      }));
    } else {
      // 기존 이력서가 없으면 프로필과 사용자 정보로 초기화
      if (veterinarianProfile && currentUser) {
        setResumeData(prev => ({
          ...prev,
          name: veterinarianProfile.nickname,
          birthDate: veterinarianProfile.birthDate 
            ? new Date(veterinarianProfile.birthDate).toISOString().split('T')[0]
            : "",
          introduction: veterinarianProfile.introduction || "",
          selfIntroduction: veterinarianProfile.introduction || "",
          email: currentUser.email,
          phone: currentUser.phone || "",
        }));
      }
    }
  }, [existingResume, veterinarianProfile, currentUser]);

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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
      name: "",
      issuer: "",
      grade: "",
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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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

  const handleSave = async () => {
    try {
      // ResumeData를 DetailedResumeData 형식으로 변환
      const saveData: DetailedResumeData = {
        photo: resumeData.photo ? "photo-url-placeholder" : undefined, // TODO: 실제 파일 업로드 구현
        name: resumeData.name,
        birthDate: resumeData.birthDate || undefined,
        introduction: resumeData.introduction || undefined,
        phone: resumeData.phone || undefined,
        email: resumeData.email || undefined,
        phonePublic: resumeData.phonePublic,
        emailPublic: resumeData.emailPublic,
        position: resumeData.position || undefined,
        specialties: resumeData.specialties,
        preferredRegions: resumeData.preferredRegions,
        expectedSalary: resumeData.expectedSalary || undefined,
        workTypes: resumeData.workTypes,
        startDate: resumeData.startDate || undefined,
        preferredWeekdays: resumeData.preferredWeekdays,
        weekdaysNegotiable: resumeData.weekdaysNegotiable,
        workStartTime: resumeData.workStartTime || undefined,
        workEndTime: resumeData.workEndTime || undefined,
        workTimeNegotiable: resumeData.workTimeNegotiable,
        selfIntroduction: resumeData.selfIntroduction || undefined,
        experiences: resumeData.experiences
          .filter(exp => exp.hospitalName.trim() && exp.mainTasks.trim())
          .map(exp => ({
            hospitalName: exp.hospitalName,
            mainTasks: exp.mainTasks,
            startDate: exp.startDate || undefined,
            endDate: exp.endDate || undefined,
          })),
        licenses: resumeData.licenses
          .filter(lic => lic.name.trim() && lic.issuer.trim())
          .map(lic => ({
            name: lic.name,
            issuer: lic.issuer,
            grade: lic.grade || undefined,
            acquiredDate: lic.acquiredDate || undefined,
          })),
        educations: resumeData.educations
          .filter(edu => edu.schoolName.trim() && edu.major.trim())
          .map(edu => ({
            degree: edu.degree,
            graduationStatus: edu.graduationStatus,
            schoolName: edu.schoolName,
            major: edu.major,
            gpa: edu.gpa || undefined,
            totalGpa: edu.totalGpa || undefined,
            startDate: edu.startDate || undefined,
            endDate: edu.endDate || undefined,
          })),
        medicalCapabilities: resumeData.medicalCapabilities
          .filter(cap => cap.field.trim() && cap.proficiency.trim())
          .map(cap => ({
            field: cap.field,
            proficiency: cap.proficiency,
            description: cap.description || undefined,
            others: cap.others || undefined,
          })),
      };

      await saveResumeMutation.mutateAsync(saveData);
      
      alert(existingResume ? "이력서가 수정되었습니다." : "이력서가 생성되었습니다.");
    } catch (error) {
      console.error("이력서 저장 실패:", error);
      alert("이력서 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    // 취소 로직 구현
    if (confirm("작성 중인 내용이 삭제됩니다. 정말 취소하시겠습니까?")) {
      // 초기값으로 리셋하거나 이전 페이지로 이동
      window.history.back();
    }
  };

  // 로딩 상태
  if (profileLoading || userLoading || resumeLoading) {
    return (
      <div className="bg-white">
        <div className="max-w-5xl mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 (이력서 에러는 처음 작성하는 경우 정상이므로 제외)
  if (profileError || userError) {
    return (
      <div className="bg-white">
        <div className="max-w-5xl mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">정보를 불러오는데 실패했습니다.</p>
            <Button onClick={() => window.location.reload()}>다시 시도</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto p-4 min-h-screen">
        <div className="mb-6">
          <h1 className="font-title text-[36px] text-primary mb-1">
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
                value={
                  resumeData.photo
                    ? URL.createObjectURL(resumeData.photo)
                    : undefined
                }
                onChange={(file) =>
                  setResumeData((prev) => ({ ...prev, photo: file }))
                }
              />
            </div>

            {/* 기본 정보 폼 */}
            <div className="lg:flex flex-col">
              <div className="lg:flex-row flex flex-col gap-[40px] lg:gap-[24px]">
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    이름
                  </label>
                  <InputBox
                    value={resumeData.name}
                    onChange={(value) =>
                      setResumeData((prev) => ({ ...prev, name: value }))
                    }
                    placeholder="이름 입력"
                  />
                </div>
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    생년월일
                  </label>
                  <InputBox
                    value={resumeData.birthDate}
                    onChange={(value) =>
                      setResumeData((prev) => ({ ...prev, birthDate: value }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
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
                    placeholder="한 줄 소개 입력"
                  />
                </div>
              </div>

              <div className="lg:flex-row flex flex-col gap-[40px] lg:gap-[24px] mt-[30px]">
                <div>
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    연락처
                  </label>
                  <InputBox
                    value={resumeData.phone}
                    onChange={(value) =>
                      setResumeData((prev) => ({ ...prev, phone: value }))
                    }
                    placeholder="010-0000-0000"
                    type="tel"
                  />
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
                    onChange={(value) =>
                      setResumeData((prev) => ({ ...prev, email: value }))
                    }
                    placeholder="example@email.com"
                    type="email"
                  />
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
                  placeholder="선택"
                  options={positionOptions}
                  className="min-w-[250px]"
                />
              </div>
              <div className="w-full">
                <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                  전공 분야
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
                  placeholder="희망 연봉 입력"
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
                className="flex flex-col xl:flex-row xl:items-center gap-[10px] border border-[#EFEFF0] rounded-[12px] p-[20px] xl:p-[0px] xl:border-none bg-transparent"
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
                    placeholder="병원명 입력"
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
                    placeholder="주요 업무 입력"
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
                    placeholder="YYYY-MM-DD"
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
                    placeholder="YYYY-MM-DD"
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
                className="flex flex-col xl:flex-row xl:items-center gap-[10px] border border-[#EFEFF0] rounded-[12px] p-[20px] xl:p-[0px] xl:border-none bg-transparent"
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
                    placeholder="자격증/면허명 입력"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    등급
                  </label>
                  <SelectBox
                    value={license.grade}
                    onChange={(value) => {
                      setResumeData((prev) => ({
                        ...prev,
                        licenses: prev.licenses.map((lic) =>
                          lic.id === license.id ? { ...lic, grade: value } : lic
                        ),
                      }));
                    }}
                    placeholder="등급 선택"
                    options={gradeOptions}
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
                    placeholder="발급기관 입력"
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
                    placeholder="YYYY-MM-DD"
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
                      placeholder="학위 선택"
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
                      placeholder="졸업여부 선택"
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
                      placeholder="학교명 입력"
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
                      placeholder="전공명 입력"
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
                      placeholder="3.5"
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
                      placeholder="4.0"
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
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      졸업일
                    </label>
                    <DatePicker
                      value={education.endDate}
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
                      placeholder="YYYY-MM-DD"
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
                      placeholder="분야 선택"
                      options={medicalFieldOptions}
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
                      placeholder="숙련도 선택"
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
                      placeholder="역량 설명 입력"
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
                      placeholder="기타 사항 입력"
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
            placeholder="자기소개를 작성해주세요"
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
            {saveResumeMutation.isPending ? "저장 중..." : existingResume ? "수정하기" : "저장하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
