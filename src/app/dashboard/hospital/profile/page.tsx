"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import { DatePicker } from "@/components/ui/DatePicker";
import { AddressSearch } from "@/components/features/profile/AddressSearch";
import { FilterBox } from "@/components/ui/FilterBox";
import { ProfileImageUpload } from "@/components/features/profile/ProfileImageUpload";
import { Textarea } from "@/components/ui/Input/Textarea";
import { useDetailedHospitalProfile } from "@/hooks/api/useDetailedHospitalProfile";
import { useHospitalProfile } from "@/hooks/api/useHospitalProfile";
import { useCurrentUser } from "@/hooks/api/useAuth";
import hospitalImage from "@/assets/images/hospital.png";

interface HospitalProfileData {
  hospitalLogo?: string;
  hospitalName: string;
  establishedDate: string;
  address: string;
  detailAddress: string;
  website: string;
  phone: string;
  businessNumber: string;
  email: string;
  treatmentAnimals: string[];
  treatmentFields: string[];
  description: string;
}

export default function HospitalProfilePage() {
  const { data: detailedProfile, isLoading: detailedLoading, error: detailedError } = useDetailedHospitalProfile();
  const { data: basicProfile, isLoading: basicLoading, error: basicError } = useHospitalProfile();
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();

  // 로딩 상태
  if (detailedLoading || basicLoading || userLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
        <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">프로필 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (basicError || userError) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
        <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">프로필 정보를 불러오는데 실패했습니다.</p>
              <Button onClick={() => window.location.reload()}>다시 시도</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 프로필 데이터 결합 (상세 프로필이 있으면 우선, 없으면 기본 프로필 사용)
  const hospitalData: HospitalProfileData = {
    hospitalLogo: detailedProfile?.hospitalLogo || hospitalImage.src,
    hospitalName: detailedProfile?.hospitalName || basicProfile?.hospitalName || "병원명",
    establishedDate: detailedProfile?.establishedDate || "2024-01-01",
    address: detailedProfile?.address || basicProfile?.address || "",
    detailAddress: detailedProfile?.detailAddress || "",
    website: detailedProfile?.website || basicProfile?.website || "",
    phone: detailedProfile?.phone || basicProfile?.phone || "",
    businessNumber: detailedProfile?.businessNumber || basicProfile?.businessNumber || "",
    email: detailedProfile?.email || currentUser?.email || "",
    treatmentAnimals: detailedProfile?.treatmentAnimals || [],
    treatmentFields: detailedProfile?.treatmentFields || [],
    description: detailedProfile?.description || basicProfile?.description || "",
  };

  const handleEdit = () => {
    window.location.href = "/dashboard/hospital/profile/edit";
  };

  // 진료 동물 옵션
  const animalOptions = [
    { value: "호러치", label: "호러치" },
    { value: "고양이", label: "고양이" },
    { value: "파충류", label: "파충류" },
    { value: "대동물", label: "대동물" },
    { value: "산양생물", label: "산양생물" },
    { value: "삵도류", label: "삵도류" },
    { value: "약전대안", label: "약전대안" },
    { value: "기타", label: "기타" },
  ];

  // 진료 분야 옵션
  const fieldOptions = [
    { value: "내과", label: "내과" },
    { value: "외과", label: "외과" },
    { value: "치과", label: "치과" },
    { value: "피부과", label: "피부과" },
    { value: "안과", label: "안과" },
    { value: "산양의학", label: "산양의학" },
    { value: "정형외과", label: "정형외과" },
    { value: "행동의학", label: "행동의학" },
    { value: "기타", label: "기타" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        {/* 메인 컨텐츠 */}
        <div className="max-w-[758px] mx-auto w-full">
          {/* 페이지 제목 */}
          <h1 className="font-title text-[28px] font-light text-primary text-center mb-[60px]">
            프로필 설정
          </h1>

          <div className="flex flex-col gap-[40px]">
            {/* 병원명 */}
            <div className="flex flex-col lg:flex-row gap-[16px]">
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  병원명
                </label>
                <InputBox
                  value={hospitalData.hospitalName}
                  placeholder="병원명을 입력해 주세요"
                  disabled={true}
                  readOnly={true}
                />
              </div>

              {/* 설립일 */}
              <div className="w-full max-w-[300px]">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  설립일
                </label>
                <DatePicker
                  value={new Date(hospitalData.establishedDate)}
                  onChange={() => {}}
                  placeholder="설립일을 선택해주세요"
                  disabled={true}
                />
              </div>
            </div>

            {/* 주소 */}
            <AddressSearch
              address={hospitalData.address}
              detailAddress={hospitalData.detailAddress}
              onAddressChange={() => {}}
              onDetailAddressChange={() => {}}
              disabled={true}
            />

            <div className="flex flex-col lg:flex-row gap-[16px]">
              {/* 병원 웹사이트 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  병원 웹사이트
                </label>
                <InputBox
                  value={hospitalData.website}
                  placeholder="병원 웹사이트 URL을 입력해주세요"
                  disabled={true}
                  readOnly={true}
                />
              </div>

              {/* 대표 연락처 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  대표 연락처
                </label>
                <InputBox
                  value={hospitalData.phone}
                  placeholder="대표 연락처를 입력해주세요"
                  disabled={true}
                  readOnly={true}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-[16px]">
              {/* 사업자등록번호 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  사업자등록번호
                </label>
                <InputBox
                  value={hospitalData.businessNumber}
                  placeholder="사업자등록번호를 입력해주세요"
                  disabled={true}
                  readOnly={true}
                />
              </div>

              {/* 대표 이메일 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  대표 이메일
                </label>
                <InputBox
                  value={hospitalData.email}
                  placeholder="대표 이메일을 입력해주세요"
                  disabled={true}
                  readOnly={true}
                />
              </div>
            </div>

            {/* 진료 동물 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                진료 동물
              </label>
              <FilterBox.Group
                value={hospitalData.treatmentAnimals}
                disabled={true}
              >
                {animalOptions.map((option) => (
                  <FilterBox.Item key={option.value} value={option.value}>
                    {option.label}
                  </FilterBox.Item>
                ))}
              </FilterBox.Group>
            </div>

            {/* 진료 분야 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                진료 분야
              </label>
              <FilterBox.Group
                value={hospitalData.treatmentFields}
                disabled={true}
              >
                {fieldOptions.map((option) => (
                  <FilterBox.Item key={option.value} value={option.value}>
                    {option.label}
                  </FilterBox.Item>
                ))}
              </FilterBox.Group>
            </div>

            {/* 병원 로고 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-6">
                병원 로고
              </label>
              <div className="flex justify-center">
                <ProfileImageUpload
                  value={hospitalData.hospitalLogo}
                  onChange={() => {}} // 읽기 전용이므로 빈 함수
                  disabled={true}
                />
              </div>
            </div>

            {/* 병원 소개 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                병원 소개
              </label>
              <Textarea
                value={hospitalData.description}
                onChange={() => {}}
                placeholder="병원을 간단하게 소개해 주세요"
                disabled={true}
                rows={5}
              />
            </div>

            {/* 수정하기 버튼 */}
            <div className="flex justify-center mt-[40px]">
              <Button
                variant="default"
                size="medium"
                onClick={handleEdit}
                className="px-[40px]"
              >
                수정하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
