"use client";

import { HospitalRegistrationForm } from "@/components/features/auth/HospitalRegistrationForm";
import { registerHospital, HospitalRegisterData } from "@/actions/auth";
import { HospitalRegistrationData } from "@/types/hospital";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 페이지에서 사용하는 폼 데이터는 공통 타입 사용
type HospitalFormData = HospitalRegistrationData;

export default function HospitalRegisterPage() {
  const router = useRouter();

  const handleSubmit = async (formData: HospitalFormData) => {
    try {
      console.log("CLIENT: handleSubmit called with data:", formData);
      
      // 이미지는 이미 S3에 업로드되어 URL로 전달됨
      const profileImageUrl = formData.hospitalLogo;
      
      // 업로드된 사업자등록증 파일 정보 사용
      const businessLicenseUrl = formData.businessLicense.url;
      const businessLicenseFileName = formData.businessLicense.fileName;
      const businessLicenseFileType = formData.businessLicense.fileType;
      const businessLicenseFileSize = formData.businessLicense.fileSize;

      const registerData: HospitalRegisterData = {
        userId: formData.loginId,
        password: formData.password,
        realName: formData.realName, // 대표자명 추가
        hospitalName: formData.hospitalName,
        establishedDate: formData.establishedDate, // 병원 설립일 추가
        businessNumber: formData.businessNumber,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        address: formData.address, // 주소 분리
        detailAddress: formData.detailAddress, // 상세주소 분리
        profileImage: profileImageUrl || undefined,
        treatmentAnimals: formData.treatmentAnimals, // 진료 가능 동물 추가
        treatmentSpecialties: formData.treatmentSpecialties, // 진료 분야 추가
        businessLicense: businessLicenseUrl || undefined,
        businessLicenseFileName: businessLicenseFileName || undefined,
        businessLicenseFileType: businessLicenseFileType || undefined,
        businessLicenseFileSize: businessLicenseFileSize || undefined,
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
        formData: {
          ...formData,
          password: '[REDACTED]',
          passwordConfirm: '[REDACTED]'
        }
      });
      
      // 더 자세한 에러 메시지 표시
      let errorMessage = "회원가입 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        errorMessage = error.message;
        // 네트워크 에러 체크
        if (error.message.includes('fetch')) {
          errorMessage = "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
        }
      }
      
      alert(errorMessage);
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
