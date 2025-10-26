"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import { DatePicker } from "@/components/ui/DatePicker";
import { AddressSearch } from "@/components/features/profile/AddressSearch";
import { FilterBox } from "@/components/ui/FilterBox";
import {
  ProfileImageUpload,
  MultiImageUpload,
} from "@/components/features/profile";
import { Textarea } from "@/components/ui/Input/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { BirthDateInput } from "@/components/ui/FormattedInput";
import {
  useDetailedHospitalProfile,
  useSaveDetailedHospitalProfile,
} from "@/hooks/api/useDetailedHospitalProfile";
import { useHospitalProfile } from "@/hooks/api/useHospitalProfile";
import { useCurrentUser } from "@/hooks/api/useAuth";
import type { DetailedHospitalProfileData } from "@/actions/auth";
import hospitalImage from "@/assets/images/hospital.png";

interface HospitalProfileData {
  hospitalLogo?: string;
  hospitalName: string;
  realName: string;
  establishedDate: string;
  address: string;
  detailAddress: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  website: string;
  phone: string;
  businessNumber: string;
  email: string;
  treatmentAnimals: string[];
  treatmentFields: string[];
  description: string;
  hospitalImages: string[];
  businessLicense: {
    file: File | null;
    url: string | null;
    fileName: string | null;
    fileType: string | null;
    mimeType: string | null;
    fileSize: number | null;
  };
}

export default function HospitalProfileEditPage() {
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
  const saveProfileMutation = useSaveDetailedHospitalProfile();

  const [formData, setFormData] = useState<HospitalProfileData>({
    hospitalLogo: hospitalImage.src,
    hospitalName: "",
    realName: "",
    establishedDate: "2024-01-01",
    address: "",
    detailAddress: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    website: "",
    phone: "",
    businessNumber: "",
    email: "",
    treatmentAnimals: [],
    treatmentFields: [],
    description: "",
    hospitalImages: [],
    businessLicense: {
      file: null,
      url: null,
      fileName: null,
      fileType: null,
      mimeType: null,
      fileSize: null,
    },
  });

  // 프로필 데이터가 로드되면 폼에 반영
  useEffect(() => {
    if (detailedProfile) {
      // DB enum 값을 한글 표시값으로 변환
      const mappedAnimals = detailedProfile.treatmentAnimals.map(
        (animal) =>
          ANIMAL_TYPE_LABELS[animal as keyof typeof ANIMAL_TYPE_LABELS] ||
          animal
      );
      const mappedFields = detailedProfile.treatmentFields.map(
        (field) =>
          SPECIALTY_TYPE_LABELS[field as keyof typeof SPECIALTY_TYPE_LABELS] ||
          field
      );

      console.log("[HospitalProfileEditPage] Loading detailed profile:", {
        originalAnimals: detailedProfile.treatmentAnimals,
        mappedAnimals,
        originalFields: detailedProfile.treatmentFields,
        mappedFields,
      });

      setFormData({
        hospitalLogo: detailedProfile.hospitalLogo || hospitalImage.src,
        hospitalName: detailedProfile.hospitalName,
        realName: detailedProfile.realName || "",
        establishedDate: detailedProfile.establishedDate || "2024-01-01",
        address: detailedProfile.address,
        detailAddress: detailedProfile.detailAddress || "",
        postalCode: detailedProfile.postalCode || "",
        latitude: detailedProfile.latitude || null,
        longitude: detailedProfile.longitude || null,
        website: detailedProfile.website || "",
        phone: detailedProfile.phone,
        businessNumber: detailedProfile.businessNumber,
        email: detailedProfile.email || "",
        treatmentAnimals: mappedAnimals,
        treatmentFields: mappedFields,
        description: detailedProfile.description || "",
        hospitalImages: detailedProfile.facilityImages || [],
        businessLicense: {
          file: null,
          url: detailedProfile.businessLicense || null,
          fileName: null,
          fileType: null,
          mimeType: null,
          fileSize: null,
        },
      });
    } else if (basicProfile || currentUser) {
      // 상세 프로필이 없으면 기본 프로필 또는 유저 정보로 초기화
      const mappedAnimals =
        basicProfile?.treatmentAnimals?.map(
          (animal) =>
            ANIMAL_TYPE_LABELS[animal as keyof typeof ANIMAL_TYPE_LABELS] ||
            animal
        ) || [];
      const mappedFields =
        basicProfile?.treatmentSpecialties?.map(
          (field) =>
            SPECIALTY_TYPE_LABELS[
              field as keyof typeof SPECIALTY_TYPE_LABELS
            ] || field
        ) || [];

      console.log("[HospitalProfileEditPage] Loading basic profile:", {
        originalAnimals: basicProfile?.treatmentAnimals,
        mappedAnimals,
        originalFields: basicProfile?.treatmentSpecialties,
        mappedFields,
      });

      setFormData({
        hospitalLogo: hospitalImage.src,
        hospitalName:
          basicProfile?.hospitalName ||
          (currentUser as any)?.hospitalName ||
          "",
        realName: "",
        establishedDate: "",
        address: basicProfile?.address || "",
        detailAddress: "",
        postalCode: "",
        latitude: null,
        longitude: null,
        website: basicProfile?.website || "",
        phone: basicProfile?.phone || currentUser?.phone || "",
        businessNumber: basicProfile?.businessNumber || "",
        email: currentUser?.email || "",
        treatmentAnimals: mappedAnimals,
        treatmentFields: mappedFields,
        description: basicProfile?.description || "",
        hospitalImages: [],
        businessLicense: {
          file: null,
          url: null,
          fileName: null,
          fileType: null,
          mimeType: null,
          fileSize: null,
        },
      });
    }
  }, [detailedProfile, basicProfile, currentUser]);

  const handleCancel = () => {
    window.location.href = "/dashboard/hospital/profile";
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        businessLicense: {
          file: null,
          url: null,
          fileName: null,
          fileType: null,
          mimeType: null,
          fileSize: null,
        },
      }));
      return;
    }

    // 파일만 설정 (업로드 중 표시용)
    setFormData((prev) => ({
      ...prev,
      businessLicense: {
        file: file,
        url: null,
        fileName: null,
        fileType: null,
        mimeType: null,
        fileSize: null,
      },
    }));

    try {
      // 파일 업로드
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload/business-license", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.status === "success") {
        setFormData((prev) => ({
          ...prev,
          businessLicense: {
            file: file,
            url: result.data.fileUrl,
            fileName: result.data.fileName,
            fileType: result.data.fileType,
            mimeType: result.data.mimeType,
            fileSize: result.data.fileSize || file.size,
          },
        }));
      } else {
        console.error("File upload failed:", result.message);
        alert("파일 업로드에 실패했습니다: " + result.message);
        setFormData((prev) => ({
          ...prev,
          businessLicense: {
            file: file,
            url: null,
            fileName: null,
            fileType: null,
            mimeType: null,
            fileSize: null,
          },
        }));
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
      setFormData((prev) => ({
        ...prev,
        businessLicense: {
          file: file,
          url: null,
          fileName: null,
          fileType: null,
          mimeType: null,
          fileSize: null,
        },
      }));
    }
  };

  const handleSave = async () => {
    try {
      // 한글 표시값을 DB enum 값으로 변환
      const treatmentAnimalsEnum = formData.treatmentAnimals.map(
        (animal) =>
          ANIMAL_LABEL_TO_ENUM[animal as keyof typeof ANIMAL_LABEL_TO_ENUM] ||
          animal
      );
      const treatmentFieldsEnum = formData.treatmentFields.map(
        (field) =>
          SPECIALTY_LABEL_TO_ENUM[
            field as keyof typeof SPECIALTY_LABEL_TO_ENUM
          ] || field
      );

      console.log("[HospitalProfileEditPage] Saving data:", {
        displayAnimals: formData.treatmentAnimals,
        enumAnimals: treatmentAnimalsEnum,
        displayFields: formData.treatmentFields,
        enumFields: treatmentFieldsEnum,
      });

      // 폼 데이터를 DetailedHospitalProfileData 형식으로 변환
      const saveData: DetailedHospitalProfileData = {
        hospitalLogo:
          formData.hospitalLogo === hospitalImage.src
            ? undefined
            : formData.hospitalLogo,
        hospitalName: formData.hospitalName,
        realName: formData.realName || undefined,
        businessNumber: formData.businessNumber,
        address: formData.address,
        phone: formData.phone,
        website: formData.website || undefined,
        description: formData.description || undefined,
        businessLicense: formData.businessLicense.url || undefined,
        establishedDate: formData.establishedDate || undefined,
        detailAddress: formData.detailAddress || undefined,
        postalCode: formData.postalCode || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        email: formData.email || undefined,
        treatmentAnimals: treatmentAnimalsEnum,
        treatmentFields: treatmentFieldsEnum,
        facilityImages: formData.hospitalImages,

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

      alert(
        detailedProfile
          ? "프로필이 수정되었습니다."
          : "프로필이 생성되었습니다."
      );
      window.location.href = "/dashboard/hospital/profile";
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 동물 타입 매핑 (DB enum -> 한글 표시)
  const ANIMAL_TYPE_LABELS = {
    DOG: "반려견",
    CAT: "고양이",
    EXOTIC: "특수동물",
    LARGE_ANIMAL: "대동물",
  };

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

  // 한글 표시 -> DB enum 매핑 (역방향)
  const ANIMAL_LABEL_TO_ENUM = Object.fromEntries(
    Object.entries(ANIMAL_TYPE_LABELS).map(([key, value]) => [value, key])
  );

  const SPECIALTY_LABEL_TO_ENUM = Object.fromEntries(
    Object.entries(SPECIALTY_TYPE_LABELS).map(([key, value]) => [value, key])
  );

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

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        {/* 메인 컨텐츠 */}
        <div className="max-w-[758px] mx-auto w-full">
          {/* 페이지 제목 */}
          <h1 className="font-title text-[28px] text-primary text-center mb-[60px]">
            프로필 설정
          </h1>

          <div className="flex flex-col gap-[40px]">
            {/* 병원명과 대표자명 */}
            <div className="flex flex-col lg:flex-row gap-[16px]">
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  병원명
                </label>
                <InputBox
                  value={formData.hospitalName}
                  onChange={(value) =>
                    setFormData({ ...formData, hospitalName: value })
                  }
                  placeholder="병원명을 입력해 주세요"
                />
              </div>

              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  대표자명
                </label>
                <InputBox
                  value={formData.realName}
                  onChange={(value) =>
                    setFormData({ ...formData, realName: value })
                  }
                  placeholder="대표자명을 입력해 주세요"
                />
              </div>
            </div>

            {/* 설립일 */}
            <div className="w-full max-w-[300px]">
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                설립일
              </label>
              <BirthDateInput
                value={formData.establishedDate}
                onChange={(value) =>
                  setFormData({ ...formData, establishedDate: value })
                }
                placeholder="YYYY-MM-DD"
              />
            </div>

            {/* 주소 */}
            <AddressSearch
              address={formData.address}
              detailAddress={formData.detailAddress}
              onAddressChange={(address) =>
                setFormData({ ...formData, address })
              }
              onDetailAddressChange={(detailAddress) =>
                setFormData({ ...formData, detailAddress })
              }
              onAddressDataChange={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  address: data.address,
                  postalCode: data.postalCode,
                  latitude: data.latitude || null,
                  longitude: data.longitude || null,
                }));
              }}
            />

            <div className="flex flex-col lg:flex-row gap-[16px]">
              {/* 병원 웹사이트 */}
              <div className="w-full">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  병원 웹사이트
                </label>
                <InputBox
                  value={formData.website}
                  onChange={(value) =>
                    setFormData({ ...formData, website: value })
                  }
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
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value })
                  }
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
                  onChange={(value) =>
                    setFormData({ ...formData, businessNumber: value })
                  }
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
                  onChange={(value) =>
                    setFormData({ ...formData, email: value })
                  }
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
                onChange={(values) =>
                  setFormData({ ...formData, treatmentAnimals: values })
                }
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
                onChange={(values) =>
                  setFormData({ ...formData, treatmentFields: values })
                }
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
                    setFormData({
                      ...formData,
                      hospitalLogo: url || undefined,
                    });
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
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="병원을 간단하게 소개해 주세요"
                rows={5}
              />
            </div>

            {/* 병원 이미지 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                병원 이미지{" "}
                <span className="text-[#C5CCD8]">(선택, 최대 10장)</span>
              </label>
              <MultiImageUpload
                value={formData.hospitalImages}
                onChange={(urls) => {
                  setFormData({ ...formData, hospitalImages: urls });
                }}
                folder="hospital-facilities"
                maxImages={10}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                병원 시설, 진료실, 대기실 등의 사진을 업로드해주세요.
              </p>
            </div>

            {/* 사업자등록증 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                사업자등록증 <span className="text-[#FF4A4A]">(필수)</span>
              </label>
              <FileUpload
                onFileSelect={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                maxSize={10 * 1024 * 1024}
                placeholder="사업자등록증 파일을 업로드해주세요 (이미지, PDF, Word 파일)"
              />
              {formData.businessLicense.file &&
                formData.businessLicense.url && (
                  <div className="text-sm text-green-600 mt-2">
                    <p>✅ 업로드 완료: {formData.businessLicense.file.name}</p>
                    <p className="text-xs text-gray-500">
                      파일 형식: {formData.businessLicense.fileType} | 크기:{" "}
                      {Math.round(formData.businessLicense.file.size / 1024)}KB
                    </p>
                  </div>
                )}
              {formData.businessLicense.file &&
                !formData.businessLicense.url && (
                  <p className="text-sm text-amber-600 mt-2">📤 업로드 중...</p>
                )}
              {!formData.businessLicense.file &&
                formData.businessLicense.url && (
                  <div className="text-sm text-blue-600 mt-2">
                    <p>
                      📄 기존 파일:{" "}
                      {formData.businessLicense.fileName || "사업자등록증"}
                    </p>
                    <a
                      href={formData.businessLicense.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      파일 보기
                    </a>
                  </div>
                )}
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
                {saveProfileMutation.isPending
                  ? "저장 중..."
                  : detailedProfile
                  ? "수정하기"
                  : "저장하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
