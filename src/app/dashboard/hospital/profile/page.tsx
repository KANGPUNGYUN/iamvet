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
  const { data: detailedProfile, isLoading: detailedLoading } =
    useDetailedHospitalProfile();
  const {
    data: basicProfile,
    isLoading: basicLoading,
    error: basicError,
  } = useHospitalProfile();
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

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

  // 인증되지 않은 사용자 체크
  if (!detailedLoading && !basicLoading && !userLoading && !currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
        <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">로그인이 필요합니다.</p>
              <Button
                onClick={() => (window.location.href = "/login/hospital")}
              >
                로그인하기
              </Button>
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
              <p className="text-red-600 mb-4">
                프로필 정보를 불러오는데 실패했습니다.
              </p>
              <p className="text-gray-600 mb-4 text-sm">
                {basicError?.message ||
                  userError?.message ||
                  "알 수 없는 오류가 발생했습니다."}
              </p>
              <Button onClick={() => window.location.reload()}>
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 프로필 데이터 결합 (상세 프로필이 있으면 우선, 없으면 기본 프로필 사용)
  const hospitalData: HospitalProfileData = {
    hospitalLogo: detailedProfile?.hospitalLogo || hospitalImage.src,
    hospitalName:
      detailedProfile?.hospitalName ||
      basicProfile?.hospitalName ||
      (currentUser as any)?.hospitalName ||
      "병원명을 설정해주세요",
    establishedDate:
      detailedProfile?.establishedDate || "설립일을 설정해주세요",
    address:
      detailedProfile?.address ||
      basicProfile?.address ||
      "주소를 설정해주세요",
    detailAddress: detailedProfile?.detailAddress || "상세주소를 설정해주세요",
    website:
      detailedProfile?.website ||
      basicProfile?.website ||
      "웹사이트를 설정해주세요",
    phone:
      detailedProfile?.phone ||
      basicProfile?.phone ||
      currentUser?.phone ||
      "연락처를 설정해주세요",
    businessNumber:
      detailedProfile?.businessNumber ||
      basicProfile?.businessNumber ||
      "사업자등록번호를 설정해주세요",
    email:
      detailedProfile?.email || currentUser?.email || "이메일을 설정해주세요",
    treatmentAnimals:
      detailedProfile?.treatmentAnimals || basicProfile?.treatmentAnimals || [],
    treatmentFields:
      detailedProfile?.treatmentFields ||
      basicProfile?.treatmentSpecialties ||
      [],
    description:
      detailedProfile?.description ||
      basicProfile?.description ||
      "병원 소개를 작성해주세요",
  };

  // 데이터가 있는지 확인
  const hasRealData =
    hospitalData.hospitalName !== "병원명을 설정해주세요" &&
    hospitalData.hospitalName !== "" &&
    hospitalData.phone !== "연락처를 설정해주세요" &&
    hospitalData.phone !== "";

  // 데이터가 전혀 없는 경우 (처음 가입한 경우)
  if (
    !detailedLoading &&
    !basicLoading &&
    !userLoading &&
    !hasRealData &&
    currentUser
  ) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
        <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-[16px] mb-2">
                병원 프로필을 작성해주세요
              </p>
              <p className="text-gray-500 text-[14px] mb-4">
                로그인한 계정 ({currentUser?.email})에 대한 병원 정보가
                없습니다.
                <br />
                프로필을 작성하여 병원 정보를 등록해주세요.
              </p>
              <Button
                variant="default"
                size="medium"
                onClick={() =>
                  (window.location.href = "/dashboard/hospital/profile/edit")
                }
                className="px-[40px]"
              >
                프로필 작성하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    window.location.href = "/dashboard/hospital/profile/edit";
  };

  // 동물 타입 매핑 (DB enum -> 한글 표시)
  const ANIMAL_TYPE_LABELS = {};

  // 진료 분야 매핑 (DB enum -> 한글 표시)
  const SPECIALTY_TYPE_LABELS = {
    INTERNAL_MEDICINE: "내과",
    SURGERY: "외과",
    DERMATOLOGY: "피부과",
    DENTISTRY: "치과",
    OPHTHALMOLOGY: "안과",
    NEUROLOGY: "신경과",
    ORTHOPEDICS: "정형외과",
  };

  // 진료 동물 옵션 (표시용)
  const animalOptions = [
    { value: "반려견", label: "반려견" },
    { value: "고양이", label: "고양이" },
    { value: "특수동물", label: "특수동물" },
    { value: "대동물", label: "대동물" },
  ];

  // 진료 분야 옵션 (표시용)
  const fieldOptions = [
    { value: "내과", label: "내과" },
    { value: "외과", label: "외과" },
    { value: "피부과", label: "피부과" },
    { value: "치과", label: "치과" },
    { value: "안과", label: "안과" },
    { value: "신경과", label: "신경과" },
    { value: "정형외과", label: "정형외과" },
  ];

  // DB enum 값을 한글 표시값으로 변환
  const mappedTreatmentAnimals = hospitalData.treatmentAnimals.map(
    (animal) =>
      ANIMAL_TYPE_LABELS[animal as keyof typeof ANIMAL_TYPE_LABELS] || animal
  );

  const mappedTreatmentFields = hospitalData.treatmentFields.map(
    (field) =>
      SPECIALTY_TYPE_LABELS[field as keyof typeof SPECIALTY_TYPE_LABELS] ||
      field
  );

  console.log("[HospitalProfilePage] Data mapping:", {
    originalAnimals: hospitalData.treatmentAnimals,
    mappedAnimals: mappedTreatmentAnimals,
    originalFields: hospitalData.treatmentFields,
    mappedFields: mappedTreatmentFields,
    detailedProfile: !!detailedProfile,
    basicProfile: !!basicProfile,
  });

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
              <FilterBox.Group value={mappedTreatmentAnimals} disabled={true}>
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
              <FilterBox.Group value={mappedTreatmentFields} disabled={true}>
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
