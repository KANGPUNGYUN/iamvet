"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import { FilterBox } from "@/components/ui/FilterBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { DatePicker } from "@/components/ui/DatePicker";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { WeekdaySelector } from "@/components/features/resume/WeekdaySelector";
import { TimePicker } from "@/components/ui/TimePicker";
import { Textarea } from "@/components/ui/Input/Textarea";
import { PlusIcon, MinusIcon } from "public/icons";

interface JobFormData {
  title: string;
  workType: string[];
  isUnlimitedRecruit: boolean;
  recruitEndDate: Date | null;
  major: string[];
  experience: string[];
  position: string;
  salaryType: string;
  salary: string;
  workDays: string[];
  isWorkDaysNegotiable: boolean;
  workStartTime: any;
  workEndTime: any;
  isWorkTimeNegotiable: boolean;
  benefits: string;
  education: string[];
  certifications: string[];
  experienceDetails: string[];
  preferences: string[];
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  department: string;
}

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const [jobId, setJobId] = useState<string>("");
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    workType: [],
    isUnlimitedRecruit: false,
    recruitEndDate: null,
    major: [],
    experience: [],
    position: "",
    salaryType: "",
    salary: "",
    workDays: [],
    isWorkDaysNegotiable: false,
    workStartTime: null,
    workEndTime: null,
    isWorkTimeNegotiable: false,
    benefits: "",
    education: [""],
    certifications: [""],
    experienceDetails: [""],
    preferences: [""],
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    department: "",
  });

  // 파라미터 비동기 처리 및 기존 데이터 로드
  useEffect(() => {
    const loadJobData = async () => {
      const resolvedParams = await params;
      setJobId(resolvedParams.id);

      // 실제로는 API에서 기존 데이터를 불러옴 (더미 데이터)
      const existingData: JobFormData = {
        title: "수의사 채용 (경력 3년 이상)",
        workType: ["정규직"],
        isUnlimitedRecruit: false,
        recruitEndDate: new Date("2024-12-31"),
        major: ["내과", "외과"],
        experience: ["2-3년차", "4-5년차"],
        position: "수의사",
        salaryType: "연봉",
        salary: "4000",
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        isWorkDaysNegotiable: false,
        workStartTime: { hour: 9, minute: 0, period: "AM" },
        workEndTime: { hour: 6, minute: 0, period: "PM" },
        isWorkTimeNegotiable: false,
        benefits: "4대보험, 연차, 교육비 지원",
        education: ["수의학과 졸업"],
        certifications: ["수의사 면허증"],
        experienceDetails: ["소동물 진료 경험 3년 이상"],
        preferences: ["친화적인 성격", "책임감 있는 분"],
        managerName: "김수의",
        managerPhone: "010-1234-5678",
        managerEmail: "manager@hospital.com",
        department: "인사팀",
      };

      setFormData(existingData);
    };

    loadJobData();
  }, [params]);

  // 옵션 데이터
  const workTypeOptions = [
    { value: "정규직", label: "정규직" },
    { value: "계약직", label: "계약직" },
    { value: "인턴", label: "인턴" },
    { value: "아르바이트", label: "아르바이트" },
  ];

  const majorOptions = [
    { value: "내과", label: "내과" },
    { value: "외과", label: "외과" },
    { value: "치과", label: "치과" },
    { value: "피부과", label: "피부과" },
    { value: "안과", label: "안과" },
    { value: "산양의학", label: "산양의학" },
    { value: "정형외과", label: "정형외과" },
    { value: "행동의학", label: "행동의학" },
  ];

  const experienceOptions = [
    { value: "신입", label: "신입" },
    { value: "1년차", label: "1년차" },
    { value: "2-3년차", label: "2-3년차" },
    { value: "4-5년차", label: "4-5년차" },
    { value: "5년차 이상", label: "5년차 이상" },
  ];

  const positionOptions = [
    { value: "수의사", label: "수의사" },
    { value: "간호조무사", label: "간호조무사" },
    { value: "원무과", label: "원무과" },
    { value: "기타", label: "기타" },
  ];

  const salaryTypeOptions = [
    { value: "연봉", label: "연봉" },
    { value: "월급", label: "월급" },
    { value: "시급", label: "시급" },
  ];

  // 리스트 항목 추가/삭제 함수
  const addListItem = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeListItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (
    field: keyof typeof formData,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/hospital/my-jobs";
  };

  const handleSave = () => {
    console.log("수정 저장:", { id: jobId, ...formData });
    window.location.href = "/dashboard/hospital/my-jobs";
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        <div className="max-w-[758px] mx-auto w-full">
          <h1 className="font-title text-[28px] font-light text-primary text-center mb-[60px]">
            채용 공고 수정
          </h1>

          <div className="flex flex-col gap-[40px]">
            {/* 제목 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                제목
              </label>
              <InputBox
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                placeholder="제목을 입력해 주세요"
              />
            </div>

            {/* 근무 형태 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                근무 형태
              </label>
              <FilterBox.Group
                value={formData.workType}
                onChange={(values) =>
                  setFormData({ ...formData, workType: values })
                }
              >
                {workTypeOptions.map((option) => (
                  <FilterBox.Item key={option.value} value={option.value}>
                    {option.label}
                  </FilterBox.Item>
                ))}
              </FilterBox.Group>
            </div>

            {/* 채용 종료 날짜 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                채용 종료 날짜
              </label>
              <div className="flex items-center gap-4 mb-3">
                <Checkbox.Item
                  checked={formData.isUnlimitedRecruit}
                  onChange={(checked) =>
                    setFormData({ ...formData, isUnlimitedRecruit: checked })
                  }
                >
                  무기한
                </Checkbox.Item>
              </div>
              {!formData.isUnlimitedRecruit && (
                <DatePicker
                  value={formData.recruitEndDate}
                  onChange={(date) =>
                    setFormData({ ...formData, recruitEndDate: date })
                  }
                  placeholder="채용 종료 날짜를 선택해주세요"
                />
              )}
            </div>

            {/* 전공 분야 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                전공 분야
              </label>
              <FilterBox.Group
                value={formData.major}
                onChange={(values) =>
                  setFormData({ ...formData, major: values })
                }
              >
                {majorOptions.map((option) => (
                  <FilterBox.Item key={option.value} value={option.value}>
                    {option.label}
                  </FilterBox.Item>
                ))}
              </FilterBox.Group>
            </div>

            {/* 지원자 경력 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                지원자 경력
              </label>
              <FilterBox.Group
                value={formData.experience}
                onChange={(values) =>
                  setFormData({ ...formData, experience: values })
                }
              >
                {experienceOptions.map((option) => (
                  <FilterBox.Item key={option.value} value={option.value}>
                    {option.label}
                  </FilterBox.Item>
                ))}
              </FilterBox.Group>
            </div>

            {/* 직무 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                직무
              </label>
              <SelectBox
                value={formData.position}
                onChange={(value) =>
                  setFormData({ ...formData, position: value })
                }
                options={positionOptions}
                placeholder="직무를 선택하세요"
              />
            </div>

            {/* 급여 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                급여
              </label>
              <div className="flex flex-col lg:flex-row justify-start gap-[16px]">
                <div className="w-full max-w-[200px]">
                  <SelectBox
                    value={formData.salaryType}
                    onChange={(value) =>
                      setFormData({ ...formData, salaryType: value })
                    }
                    options={salaryTypeOptions}
                    placeholder="구분"
                  />
                </div>
                <div className="w-full">
                  <InputBox
                    value={formData.salary}
                    onChange={(value) =>
                      setFormData({ ...formData, salary: value })
                    }
                    placeholder="급여를 입력해 주세요"
                    suffix="만원"
                  />
                </div>
              </div>
            </div>

            {/* 희망 근무 요일 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                희망 근무 요일
              </label>
              <WeekdaySelector
                value={formData.workDays}
                onChange={(days) =>
                  setFormData({ ...formData, workDays: days })
                }
              />
              <div className="mt-3">
                <Checkbox.Item
                  checked={formData.isWorkDaysNegotiable}
                  onChange={(checked) =>
                    setFormData({ ...formData, isWorkDaysNegotiable: checked })
                  }
                >
                  협의 가능
                </Checkbox.Item>
              </div>
            </div>

            {/* 희망 근무 시간 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                희망 근무 시간
              </label>
              <div className="flex items-center gap-4 mb-3">
                <TimePicker
                  value={formData.workStartTime}
                  onChange={(time) =>
                    setFormData({ ...formData, workStartTime: time })
                  }
                  placeholder="시작 시간"
                />
                <span className="text-[#9EA5AF]">~</span>
                <TimePicker
                  value={formData.workEndTime}
                  onChange={(time) =>
                    setFormData({ ...formData, workEndTime: time })
                  }
                  placeholder="종료 시간"
                />
              </div>
              <Checkbox.Item
                checked={formData.isWorkTimeNegotiable}
                onChange={(checked) =>
                  setFormData({ ...formData, isWorkTimeNegotiable: checked })
                }
              >
                협의 가능
              </Checkbox.Item>
            </div>

            {/* 복리후생 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                복리후생
              </label>
              <Textarea
                value={formData.benefits}
                onChange={(value) =>
                  setFormData({ ...formData, benefits: value })
                }
                placeholder="복리후생을 입력해 주세요"
                rows={4}
              />
            </div>

            {/* 자격 요구사항 */}
            <div>
              <h3 className="text-[20px] font-medium text-[#3B394D] mb-6">
                자격 요구사항
              </h3>

              {/* 학력 */}
              <div className="mb-6">
                <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                  학력
                </label>
                {formData.education.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputBox
                      value={item}
                      onChange={(value) =>
                        updateListItem("education", index, value)
                      }
                      className="w-full"
                      placeholder="학력을 입력해 주세요"
                    />
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={() => addListItem("education")}
                        className="bg-[#FBFBFB] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <PlusIcon size="28" currentColor="#3B394D" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeListItem("education", index)}
                        className="bg-[#3B394D] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <MinusIcon currentColor="#EFEFF0" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 자격증 */}
              <div className="mb-6">
                <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                  자격증
                </label>
                {formData.certifications.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputBox
                      value={item}
                      onChange={(value) =>
                        updateListItem("certifications", index, value)
                      }
                      className="w-full"
                      placeholder="자격증을 입력해 주세요"
                    />
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={() => addListItem("certifications")}
                        className="bg-[#FBFBFB] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <PlusIcon size="28" currentColor="#3B394D" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeListItem("certifications", index)}
                        className="bg-[#3B394D] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <MinusIcon currentColor="#EFEFF0" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 경력 상세 */}
              <div className="mb-6">
                <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                  경력 상세
                </label>
                {formData.experienceDetails.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputBox
                      value={item}
                      onChange={(value) =>
                        updateListItem("experienceDetails", index, value)
                      }
                      className="w-full"
                      placeholder="경력 상세를 입력해 주세요"
                    />
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={() => addListItem("experienceDetails")}
                        className="bg-[#FBFBFB] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <PlusIcon size="28" currentColor="#3B394D" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          removeListItem("experienceDetails", index)
                        }
                        className="bg-[#3B394D] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <MinusIcon currentColor="#EFEFF0" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 우대사항 */}
              <div>
                <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                  우대사항
                </label>
                {formData.preferences.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputBox
                      value={item}
                      onChange={(value) =>
                        updateListItem("preferences", index, value)
                      }
                      className="w-full"
                      placeholder="우대사항을 입력해 주세요"
                    />
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={() => addListItem("preferences")}
                        className="bg-[#FBFBFB] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <PlusIcon size="28" currentColor="#3B394D" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeListItem("preferences", index)}
                        className="bg-[#3B394D] w-[52px] h-[52px] rounded-[8px] flex items-center justify-center"
                      >
                        <MinusIcon currentColor="#EFEFF0" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 채용 공고 담당자 정보 */}
            <div>
              <h3 className="text-[20px] font-medium text-[#3B394D] mb-6">
                채용 공고 담당자 정보
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                    담당자명
                  </label>
                  <InputBox
                    value={formData.managerName}
                    onChange={(value) =>
                      setFormData({ ...formData, managerName: value })
                    }
                    placeholder="담당자명을 입력해 주세요"
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                    연락처
                  </label>
                  <InputBox
                    value={formData.managerPhone}
                    onChange={(value) =>
                      setFormData({ ...formData, managerPhone: value })
                    }
                    placeholder="연락처를 입력해 주세요"
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                    메일
                  </label>
                  <InputBox
                    value={formData.managerEmail}
                    onChange={(value) =>
                      setFormData({ ...formData, managerEmail: value })
                    }
                    placeholder="메일을 입력해 주세요"
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-medium text-[#3B394D] mb-3">
                    담당 부서
                  </label>
                  <InputBox
                    value={formData.department}
                    onChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                    placeholder="담당 부서를 입력해 주세요"
                  />
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-[16px] mt-[40px]">
              <Button
                variant="line"
                size="medium"
                onClick={handleCancel}
                className="px-[40px]"
              >
                취소
              </Button>
              <Button
                variant="default"
                size="medium"
                onClick={handleSave}
                className="px-[40px]"
              >
                저장하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
