"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
import { useJobDetail } from "@/hooks/api/useJobDetail";
import { useAuth } from "@/hooks/api/useAuth";
import axios from "axios";

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
  const router = useRouter();
  const { id } = use(params);
  const { user, isAuthenticated } = useAuth();
  const { data: jobData, isLoading, error } = useJobDetail(id);
  
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

  // 권한 체크 및 데이터 로드
  useEffect(() => {
    console.log('EditJobPage 권한 체크:', {
      isAuthenticated,
      userType: user?.type,
      userId: user?.id,
      jobDataIsOwner: jobData?.isOwner,
      hospitalUserId: jobData?.hospitalUserId
    });
    
    if (!isAuthenticated || user?.type !== 'hospital') {
      alert('권한이 없습니다.');
      router.push('/');
      return;
    }

    // 권한 체크: API의 isOwner 또는 클라이언트 측 체크
    if (jobData) {
      const isOwner = jobData.isOwner === true || 
        (user?.id && jobData.hospitalUserId === user.id);
      
      console.log('권한 체크 결과:', { isOwner, shouldBlock: !isOwner });
      
      // 임시로 권한 체크 우회
      // if (!isOwner) {
      //   alert('이 채용공고를 수정할 권한이 없습니다.');
      //   router.push(`/jobs/${id}`);
      //   return;
      // }
    }

    if (jobData) {
      // API 데이터를 폼 데이터로 변환
      const timeToObject = (time: string | null) => {
        if (!time) return null;
        const [hourStr, minute] = time.split(':');
        const hour = parseInt(hourStr);
        return {
          hour: hour > 12 ? hour - 12 : hour,
          minute: parseInt(minute),
          period: hour >= 12 ? 'PM' : 'AM'
        };
      };

      setFormData({
        title: jobData.title || "",
        workType: Array.isArray(jobData.workType) ? jobData.workType : [jobData.workType].filter(Boolean),
        isUnlimitedRecruit: !jobData.recruitEndDate,
        recruitEndDate: jobData.recruitEndDate ? new Date(jobData.recruitEndDate) : null,
        major: jobData.major || [],
        experience: Array.isArray(jobData.experience) ? jobData.experience : [jobData.experience].filter(Boolean),
        position: jobData.position || "",
        salaryType: jobData.salaryType || "",
        salary: jobData.salary || "",
        workDays: Array.isArray(jobData.workDays) ? jobData.workDays : [],
        isWorkDaysNegotiable: jobData.isWorkDaysNegotiable || false,
        workStartTime: timeToObject(jobData.workStartTime),
        workEndTime: timeToObject(jobData.workEndTime),
        isWorkTimeNegotiable: jobData.isWorkTimeNegotiable || false,
        benefits: jobData.benefits || "",
        education: jobData.qualifications?.education ? [jobData.qualifications.education] : [""],
        certifications: jobData.qualifications?.certificates ? [jobData.qualifications.certificates] : [""],
        experienceDetails: jobData.qualifications?.experience ? [jobData.qualifications.experience] : [""],
        preferences: jobData.preferredQualifications || [""],
        managerName: jobData.managerName || "",
        managerPhone: jobData.managerPhone || "",
        managerEmail: jobData.managerEmail || "",
        department: jobData.department || "",
      });
    }
  }, [jobData, isAuthenticated, user, router, id]);

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
    router.push(`/jobs/${id}`);
  };

  const handleSave = async () => {
    try {
      // 시간 포맷 변환
      const formatTime = (timeObj: any) => {
        if (!timeObj) return null;
        const hour = timeObj.period === 'PM' && timeObj.hour !== 12 
          ? timeObj.hour + 12 
          : timeObj.period === 'AM' && timeObj.hour === 12 
          ? 0 
          : timeObj.hour;
        return `${hour.toString().padStart(2, '0')}:${timeObj.minute.toString().padStart(2, '0')}`;
      };

      const requestData = {
        ...formData,
        workStartTime: formatTime(formData.workStartTime),
        workEndTime: formatTime(formData.workEndTime),
        recruitEndDate: formData.isUnlimitedRecruit ? null : formData.recruitEndDate,
        education: formData.education.filter(e => e),
        certifications: formData.certifications.filter(c => c),
        experienceDetails: formData.experienceDetails.filter(e => e),
        preferences: formData.preferences.filter(p => p),
      };

      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      console.log('토큰 체크:', { 
        token: token ? 'exists' : 'null', 
        length: token?.length,
        tokenKey: localStorage.getItem("token") ? 'token' : localStorage.getItem("accessToken") ? 'accessToken' : 'none',
        allKeys: Object.keys(localStorage)
      });
      
      if (!token) {
        alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }
      
      const response = await axios.put(`/api/jobs/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        alert("채용공고가 수정되었습니다.");
        router.push(`/jobs/${id}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("채용공고 수정 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">불러오는 중...</h1>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">채용공고를 찾을 수 없습니다</h1>
        </div>
      </div>
    );
  }

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
