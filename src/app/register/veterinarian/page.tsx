"use client";

import { VeterinarianRegistrationForm } from "@/components/features/auth/VeterinarianRegistrationForm";
import { registerVeterinarian, VeterinarianRegisterData } from "@/actions/auth";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VeterinarianFormData {
  userId: string;
  password: string;
  realName: string; // 실명 추가
  nickname: string;
  phone: string;
  email: string;
  birthDate: string;
  profileImage: string | null;
  licenseImage: string | null;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export default function VeterinarianRegisterPage() {
  const router = useRouter();

  const handleSubmit = async (formData: VeterinarianFormData) => {
    try {
      console.log("CLIENT: handleSubmit called with data:", formData);
      
      // 이미지는 이미 S3에 업로드되어 URL로 전달됨
      const profileImageUrl = formData.profileImage;
      const licenseImageUrl = formData.licenseImage;

      const registerData: VeterinarianRegisterData = {
        userId: formData.userId,
        password: formData.password,
        realName: formData.realName, // 실명 추가
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        profileImage: profileImageUrl || undefined,
        licenseImage: licenseImageUrl || undefined,
        termsAgreed: formData.agreements.terms,
        privacyAgreed: formData.agreements.privacy,
        marketingAgreed: formData.agreements.marketing,
      };

      console.log("CLIENT: Calling registerVeterinarian with:", registerData);
      const result = await registerVeterinarian(registerData);
      console.log("CLIENT: registerVeterinarian result:", result);
      
      if (result.success) {
        alert("수의사 회원가입이 완료되었습니다!");
        router.push("/login/veterinarian");
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
          <Link href="/login/veterinarian" className="mr-4">
            <ArrowLeftIcon currentColor="#000" />
          </Link>
          <h1 className="font-title text-[36px] title-light text-[#3B394D]">
            수의사 회원가입
          </h1>
        </div>
        <VeterinarianRegistrationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </>
  );
}
