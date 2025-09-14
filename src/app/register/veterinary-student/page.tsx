"use client";

import { VeterinaryStudentRegistrationForm } from "@/components/features/auth/VeterinaryStudentRegistrationForm";
import {
  registerVeterinaryStudent,
  VeterinaryStudentRegisterData,
} from "@/actions/auth";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface VeterinaryStudentFormData {
  userId: string;
  password: string;
  realName: string;
  nickname: string;
  phone: string;
  email: string; // 대학교 이메일로 통합
  birthDate: string;
  profileImage: string | null;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

function VeterinaryStudentRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse social login data from URL parameters
  const socialData = searchParams.get('social') === 'true' ? {
    email: searchParams.get('email') || '',
    name: searchParams.get('name') || '',
    profileImage: searchParams.get('profileImage') || undefined,
  } : undefined;

  const handleSubmit = async (formData: VeterinaryStudentFormData) => {
    try {
      console.log("CLIENT: handleSubmit called with data:", formData);

      // 이미지는 이미 S3에 업로드되어 URL로 전달됨
      const profileImageUrl = formData.profileImage;

      const registerData: VeterinaryStudentRegisterData = {
        userId: formData.userId,
        password: formData.password,
        realName: formData.realName,
        nickname: formData.nickname,
        phone: formData.phone,
        universityEmail: formData.email,
        birthDate: formData.birthDate,
        profileImage: profileImageUrl || undefined,
        termsAgreed: formData.agreements.terms,
        privacyAgreed: formData.agreements.privacy,
        marketingAgreed: formData.agreements.marketing,
      };

      console.log(
        "CLIENT: Calling registerVeterinaryStudent with:",
        registerData
      );
      const result = await registerVeterinaryStudent(registerData);
      console.log("CLIENT: registerVeterinaryStudent result:", result);

      if (result.success) {
        alert("수의학과 학생 회원가입이 완료되었습니다!");
        router.push("/login/veterinary-student");
      } else {
        console.error("CLIENT: Registration failed:", result.error);
        alert(
          `회원가입 실패: ${result.error || "알 수 없는 오류가 발생했습니다."}`
        );
      }
    } catch (error) {
      console.error("CLIENT: 회원가입 예외 발생:", error);
      console.error("CLIENT: Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        formData,
      });
      alert(
        `회원가입 중 예외 발생: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <>
      <main className="pt-[50px] pb-[262px] px-[16px] bg-white">
        <div className="max-w-[1155px] mx-auto w-full flex flex-col mb-[100px] gap-[10px]">
          <Link href="/login/veterinary-student" className="mr-4">
            <ArrowLeftIcon currentColor="#000" />
          </Link>
          <h1 className="font-title text-[36px] title-light text-[#3B394D]">
            수의학과 학생 회원가입
          </h1>
        </div>
        <VeterinaryStudentRegistrationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          socialData={socialData}
        />
      </main>
    </>
  );
}

export default function VeterinaryStudentRegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VeterinaryStudentRegisterContent />
    </Suspense>
  );
}
