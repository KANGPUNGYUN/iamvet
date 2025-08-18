"use client";

import React, { useState } from "react";
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

  const handleSave = () => {
    // 저장 로직 구현
    console.log("이력서 저장:", resumeData);
    alert("이력서가 저장되었습니다.");
  };

  const handleCancel = () => {
    // 취소 로직 구현
    if (confirm("작성 중인 내용이 삭제됩니다. 정말 취소하시겠습니까?")) {
      // 초기값으로 리셋하거나 이전 페이지로 이동
      window.history.back();
    }
  };

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
            <div className="lg:flex-1 flex flex-col">
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
                      연락처 공개 여부 체크 시 공개
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
                      이메일 공개 여부 체크 시 공개
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
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                총 경력: {calculateTotalExperience(resumeData.experiences)}
              </span>
              <Button variant="line" size="xsmall" onClick={addExperience}>
                + 추가
              </Button>
            </div>
          </div>

          <div className="space-y-[20px]">
            {resumeData.experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="border border-[#EFEFF0] rounded-[12px] p-[24px] bg-[#FAFAFA]"
              >
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="text-[16px] font-medium text-primary">
                    경력 사항 {index + 1}
                  </h3>
                  {resumeData.experiences.length > 1 && (
                    <Button
                      variant="text"
                      size="xsmall"
                      onClick={() => removeExperience(experience.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-[40px]">
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
                </div>
                <div className="flex flex-col lg:flex-row gap-[40px] mt-[40px]">
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
            <Button variant="line" size="xsmall" onClick={addLicense}>
              + 추가
            </Button>
          </div>

          <div className="space-y-[20px]">
            {resumeData.licenses.map((license, index) => (
              <div
                key={license.id}
                className="border border-[#EFEFF0] rounded-[12px] p-[24px] bg-[#FAFAFA]"
              >
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="text-[16px] font-medium text-primary">
                    자격증/면허 {index + 1}
                  </h3>
                  {resumeData.licenses.length > 1 && (
                    <Button
                      variant="text"
                      size="xsmall"
                      onClick={() => removeLicense(license.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-[40px]">
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
                            lic.id === license.id
                              ? { ...lic, name: value }
                              : lic
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
                            lic.id === license.id
                              ? { ...lic, grade: value }
                              : lic
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
            <Button variant="line" size="xsmall" onClick={addEducation}>
              + 추가
            </Button>
          </div>

          <div className="space-y-[20px]">
            {resumeData.educations.map((education, index) => (
              <div
                key={education.id}
                className="border border-[#EFEFF0] rounded-[12px] p-[24px] bg-[#FAFAFA]"
              >
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="text-[16px] font-medium text-primary">
                    학력 {index + 1}
                  </h3>
                  {resumeData.educations.length > 1 && (
                    <Button
                      variant="text"
                      size="xsmall"
                      onClick={() => removeEducation(education.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-[40px]">
                  <div>
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
                  <div>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
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
                    <div>
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
                </div>
                <div className="flex flex-col lg:flex-row gap-[40px] mt-[24px]">
                  <div>
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
                  <div>
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
                </div>
                <div className="mt-[24px]">
                  <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                    재학기간
                  </label>
                  <DatePicker.Range
                    startDate={education.startDate}
                    endDate={education.endDate}
                    onChange={(start, end) => {
                      setResumeData((prev) => ({
                        ...prev,
                        educations: prev.educations.map((edu) =>
                          edu.id === education.id
                            ? { ...edu, startDate: start, endDate: end }
                            : edu
                        ),
                      }));
                    }}
                    placeholder="재학기간 선택"
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
            <Button variant="line" size="xsmall" onClick={addMedicalCapability}>
              + 추가
            </Button>
          </div>

          <div className="space-y-[20px]">
            {resumeData.medicalCapabilities.map((capability, index) => (
              <div
                key={capability.id}
                className="border border-[#EFEFF0] rounded-[12px] p-[24px] bg-[#FAFAFA]"
              >
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="text-[16px] font-medium text-primary">
                    진료상세역량 {index + 1}
                  </h3>
                  {resumeData.medicalCapabilities.length > 1 && (
                    <Button
                      variant="text"
                      size="xsmall"
                      onClick={() => removeMedicalCapability(capability.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-[40px]">
                  <div>
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
                  <div>
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
                  <div>
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      역량 설명
                    </label>
                    <InputBox
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
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-text text-[primary] mb-[10px]">
                      기타
                    </label>
                    <InputBox
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
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 자기소개 */}
        <div className="px-[30px] mt-[80px]">
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
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center mt-[100px] gap-[30px] pb-6">
          <Button variant="line" size="medium" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="default" size="medium" onClick={handleSave}>
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}
