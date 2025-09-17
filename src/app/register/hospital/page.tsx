"use client";

import { HospitalRegistrationForm } from "@/components/features/auth/HospitalRegistrationForm";
import { registerHospital, HospitalRegisterData } from "@/actions/auth";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HospitalFormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  realName: string; // 대표자명 추가
  hospitalName: string;
  establishedDate: string; // 병원 설립일 추가
  businessNumber: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  detailAddress: string;
  hospitalLogo: string | null; // 병원 로고
  facilityImages: string[]; // 병원 시설 이미지 (최대 10장)
  treatmentAnimals: string[]; // 진료 가능 동물 추가
  treatmentSpecialties: string[]; // 진료 분야 추가
  businessLicenseFile: File | null; // 사업자등록증 파일 추가
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export default function HospitalRegisterPage() {
  const router = useRouter();

  const handleSubmit = async (formData: HospitalFormData) => {
    try {
      console.log("CLIENT: handleSubmit called with data:", formData);
      
      // 이미지는 이미 S3에 업로드되어 URL로 전달됨
      const profileImageUrl = formData.hospitalLogo;
      // 파일 업로드는 추후 구현 (현재는 URL만 처리)
      const businessLicenseUrl = formData.businessLicenseFile ? 'business-license-url-placeholder' : undefined;

      const registerData: HospitalRegisterData = {
        userId: formData.loginId,
        password: formData.password,
        hospitalName: formData.hospitalName,
        businessNumber: formData.businessNumber,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        address: formData.detailAddress ? `${formData.address} ${formData.detailAddress}` : formData.address,
        profileImage: profileImageUrl || undefined,
        businessLicense: businessLicenseUrl,
        termsAgreed: formData.agreements.terms,
        privacyAgreed: formData.agreements.privacy,
        marketingAgreed: formData.agreements.marketing,
      };

      console.log("CLIENT: Calling registerHospital with:", registerData);
      const result = await registerHospital(registerData);
      console.log("CLIENT: registerHospital result:", result);
      
      if (result.success) {
        alert("병원 회원가입이 완료되었습니다!");
        router.push("/login/hospital");
      } else {
        console.error("CLIENT: Registration failed:", result.error);
        alert(`회원가입 실패: ${result.error || "알 수 없는 오류가 발생했습니다."}`);
      }
    } catch (error) {
      console.error("CLIENT: 회원가입 예외 발생:", error);
      console.error("CLIENT: Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData
      });
      alert(`회원가입 중 예외 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <>
      <main className="pt-[50px] pb-[262px] px-[16px] bg-white">
        <div className="max-w-[1155px] mx-auto w-full flex flex-col mb-[100px] gap-[10px]">
          <Link href="/login/hospital" className="mr-4">
            <ArrowLeftIcon currentColor="#000" />
          </Link>
          <h1 className="font-title text-[36px] title-light text-[#3B394D]">
            병원 회원가입
          </h1>
        </div>
        <HospitalRegistrationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </>
  );
}
