"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import { DatePicker } from "@/components/ui/DatePicker";
import { AddressSearch } from "@/components/features/profile/AddressSearch";
import { FilterBox } from "@/components/ui/FilterBox";
import { ProfileImageUpload } from "@/components/features/profile/ProfileImageUpload";
import { Textarea } from "@/components/ui/Input/Textarea";
import { useDetailedHospitalProfile, useSaveDetailedHospitalProfile } from "@/hooks/api/useDetailedHospitalProfile";
import { useHospitalProfile } from "@/hooks/api/useHospitalProfile";
import { useCurrentUser } from "@/hooks/api/useAuth";
import type { DetailedHospitalProfileData } from "@/actions/auth";
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

export default function HospitalProfileEditPage() {
  const { data: detailedProfile, isLoading: detailedLoading, error: detailedError } = useDetailedHospitalProfile();
  const { data: basicProfile, isLoading: basicLoading, error: basicError } = useHospitalProfile();
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();
  const saveProfileMutation = useSaveDetailedHospitalProfile();

  const [formData, setFormData] = useState<HospitalProfileData>({
    hospitalLogo: hospitalImage.src,
    hospitalName: "",
    establishedDate: "2024-01-01",
    address: "",
    detailAddress: "",
    website: "",
    phone: "",
    businessNumber: "",
    email: "",
    treatmentAnimals: [],
    treatmentFields: [],
    description: "",
  });

  // 프로필 데이터가 로드되면 폼에 반영
  useEffect(() => {
    if (detailedProfile) {
      setFormData({
        hospitalLogo: detailedProfile.hospitalLogo || hospitalImage.src,
        hospitalName: detailedProfile.hospitalName,
        establishedDate: detailedProfile.establishedDate || "2024-01-01",
        address: detailedProfile.address,
        detailAddress: detailedProfile.detailAddress || "",
        website: detailedProfile.website || "",
        phone: detailedProfile.phone,
        businessNumber: detailedProfile.businessNumber,
        email: detailedProfile.email || "",
        treatmentAnimals: detailedProfile.treatmentAnimals,
        treatmentFields: detailedProfile.treatmentFields,
        description: detailedProfile.description || "",
      });
    } else if (basicProfile && currentUser) {
      // 상세 프로필이 없으면 기본 프로필로 초기화
      setFormData({
        hospitalLogo: hospitalImage.src,
        hospitalName: basicProfile.hospitalName,
        establishedDate: "2024-01-01",
        address: basicProfile.address,
        detailAddress: "",
        website: basicProfile.website || "",
        phone: basicProfile.phone,
        businessNumber: basicProfile.businessNumber,
        email: currentUser.email,
        treatmentAnimals: [],
        treatmentFields: [],
        description: basicProfile.description || "",
      });
    }
  }, [detailedProfile, basicProfile, currentUser]);

  const handleCancel = () => {
    window.location.href = "/dashboard/hospital/profile";
  };

  const handleSave = async () => {
    try {
      // 폼 데이터를 DetailedHospitalProfileData 형식으로 변환
      const saveData: DetailedHospitalProfileData = {
        hospitalLogo: formData.hospitalLogo === hospitalImage.src ? undefined : formData.hospitalLogo,
        hospitalName: formData.hospitalName,
        businessNumber: formData.businessNumber,
        address: formData.address,
        phone: formData.phone,
        website: formData.website || undefined,
        description: formData.description || undefined,
        businessLicense: undefined, // TODO: 실제 비즈니스 라이센스 처리
        establishedDate: formData.establishedDate || undefined,
        detailAddress: formData.detailAddress || undefined,
        email: formData.email || undefined,
        treatmentAnimals: formData.treatmentAnimals,
        treatmentFields: formData.treatmentFields,
        
        // 운영 정보 (기본값)
        operatingHours: undefined,
        emergencyService: false,
        parkingAvailable: false,
        publicTransportInfo: undefined,
        
        // 시설 정보 (기본값)
        totalBeds: undefined,
        surgeryRooms: undefined,
        xrayRoom: false,
        ctScan: false,
        ultrasound: false,
        
        // 추가 서비스 (기본값)
        grooming: false,
        boarding: false,
        petTaxi: false,
        
        // 인증 정보 (기본값)
        certifications: [],
        awards: [],
        
        // 관계 데이터 (기본값)
        staff: undefined,
        equipments: undefined,
      };

      await saveProfileMutation.mutateAsync(saveData);
      
      alert(detailedProfile ? "프로필이 수정되었습니다." : "프로필이 생성되었습니다.");
      window.location.href = "/dashboard/hospital/profile";
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장에 실패했습니다. 다시 시도해주세요.");
    }
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
                  value={formData.hospitalName}
                  onChange={(value) => setFormData({ ...formData, hospitalName: value })}
                  placeholder="병원명을 입력해 주세요"
                />
              </div>

              {/* 설립일 */}
              <div className="w-full max-w-[300px]">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  설립일
                </label>
                <DatePicker
                  value={new Date(formData.establishedDate)}
                  onChange={(date) => setFormData({ ...formData, establishedDate: date.toISOString().split('T')[0] })}
                  placeholder="설립일을 선택해주세요"
                />
              </div>
            </div>

            {/* 주소 */}
            <AddressSearch
              address={formData.address}
              detailAddress={formData.detailAddress}
              onAddressChange={(address) => setFormData({ ...formData, address })}
              onDetailAddressChange={(detailAddress) => setFormData({ ...formData, detailAddress })}
            />

            <div className="flex flex-col lg:flex-row gap-[16px]">
              {/* 병원 웹사이트 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  병원 웹사이트
                </label>
                <InputBox
                  value={formData.website}
                  onChange={(value) => setFormData({ ...formData, website: value })}
                  placeholder="병원 웹사이트 URL을 입력해주세요"
                />
              </div>

              {/* 대표 연락처 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  대표 연락처
                </label>
                <InputBox
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  placeholder="대표 연락처를 입력해주세요"
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
                  value={formData.businessNumber}
                  onChange={(value) => setFormData({ ...formData, businessNumber: value })}
                  placeholder="사업자등록번호를 입력해주세요"
                />
              </div>

              {/* 대표 이메일 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  대표 이메일
                </label>
                <InputBox
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  placeholder="대표 이메일을 입력해주세요"
                />
              </div>
            </div>

            {/* 진료 동물 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                진료 동물
              </label>
              <FilterBox.Group
                value={formData.treatmentAnimals}
                onChange={(values) => setFormData({ ...formData, treatmentAnimals: values })}
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
                value={formData.treatmentFields}
                onChange={(values) => setFormData({ ...formData, treatmentFields: values })}
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
                  value={formData.hospitalLogo}
                  onChange={(url) => {
                    setFormData({ ...formData, hospitalLogo: url || undefined });
                  }}
                  folder="hospitals"
                />
              </div>
            </div>

            {/* 병원 소개 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                병원 소개
              </label>
              <Textarea
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="병원을 간단하게 소개해 주세요"
                rows={5}
              />
            </div>

            {/* 취소/저장 버튼 */}
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
                disabled={saveProfileMutation.isPending}
                className="px-[40px]"
              >
                {saveProfileMutation.isPending ? "저장 중..." : detailedProfile ? "수정하기" : "저장하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}