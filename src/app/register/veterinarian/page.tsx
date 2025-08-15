"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useState } from "react";

export default function VeterinarianRegisterPage() {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    profileImage: null as File | null,
    licenseImage: null as File | null,
  });

  // 중복확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    isValid: false,
  });

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange =
    (field: "profileImage" | "licenseImage") => (file: File | null) => {
      setFormData((prev) => ({ ...prev, [field]: file }));
    };

  const handleDuplicateCheck = async () => {
    if (!formData.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    setDuplicateCheck((prev) => ({ ...prev, isChecking: true }));

    // 임시 검증 로직 (실제로는 API 호출)
    setTimeout(() => {
      const isValid = formData.userId.length >= 4;
      setDuplicateCheck({
        isChecking: false,
        isValid,
      });

      if (isValid) {
        alert("사용 가능한 아이디입니다.");
      } else {
        alert("아이디는 4자 이상이어야 합니다.");
      }
    }, 1000);
  };

  const handleAgreementChange =
    (field: keyof typeof agreements) => (checked: boolean) => {
      setAgreements((prev) => {
        const newAgreements = { ...prev, [field]: checked };

        // 전체 동의 체크/해제
        if (field === "all") {
          return {
            all: checked,
            terms: checked,
            privacy: checked,
            marketing: checked,
          };
        }

        // 개별 항목 체크 시 전체 동의 상태 업데이트
        const { all, ...others } = newAgreements;
        const allChecked = Object.values(others).every(Boolean);
        newAgreements.all = allChecked;

        return newAgreements;
      });
    };

  const handleRegister = () => {
    // 필수 필드 검증
    if (
      !formData.userId ||
      !formData.password ||
      !formData.passwordConfirm ||
      !formData.nickname ||
      !formData.phone ||
      !formData.email ||
      !formData.birthDate
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!duplicateCheck.isValid) {
      alert("아이디 중복확인을 완료해주세요.");
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    console.log("회원가입 데이터:", formData, agreements);
    alert("회원가입이 완료되었습니다!");
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      window.history.back();
    }
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
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-col gap-[80px]">
            {/* 계정 정보 섹션 */}
            <section>
              <h2 className="font-text text-[28px] font-bold text-primary mb-6">
                계정 정보
              </h2>

              <div className="space-y-6">
                {/* 아이디 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    아이디
                  </label>
                  <InputBox
                    value={formData.userId}
                    onChange={handleInputChange("userId")}
                    placeholder="4자 이상 입력해주세요"
                    duplicateCheck={{
                      buttonText: "중복 확인",
                      onCheck: handleDuplicateCheck,
                      isChecking: duplicateCheck.isChecking,
                      isValid: duplicateCheck.isValid,
                    }}
                    success={duplicateCheck.isValid}
                    guide={
                      duplicateCheck.isValid
                        ? { text: "사용 가능한 아이디입니다", type: "success" }
                        : undefined
                    }
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    비밀번호
                  </label>
                  <InputBox
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    placeholder="비밀번호를 입력해주세요"
                    type="password"
                    guide={{
                      text: "비밀번호는 8자 이상 입력해주세요",
                      type: "info",
                    }}
                  />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    비밀번호 확인
                  </label>
                  <InputBox
                    value={formData.passwordConfirm}
                    onChange={handleInputChange("passwordConfirm")}
                    placeholder="비밀번호를 다시 입력해주세요"
                    type="password"
                    error={
                      !!(
                        formData.passwordConfirm &&
                        formData.password !== formData.passwordConfirm
                      )
                    }
                    guide={
                      formData.passwordConfirm &&
                      formData.password !== formData.passwordConfirm
                        ? {
                            text: "비밀번호가 일치하지 않습니다",
                            type: "error",
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            </section>

            {/* 기본 정보 섹션 */}
            <section>
              <h2 className="font-text text-[28px] font-bold text-primary mb-6">
                기본 정보
              </h2>

              {/* 프로필 사진 */}
              <div className="mb-6">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  프로필 사진
                </label>
                <ProfileImageUpload
                  value={
                    formData.profileImage
                      ? URL.createObjectURL(formData.profileImage)
                      : undefined
                  }
                  onChange={handleImageChange("profileImage")}
                />
              </div>

              <div className="space-y-6">
                {/* 닉네임 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    닉네임
                  </label>
                  <InputBox
                    value={formData.nickname}
                    onChange={handleInputChange("nickname")}
                    placeholder="닉네임을 입력해주세요"
                    guide={{
                      text: "동물병원에서 이름 제한이 있습니다",
                      type: "info",
                    }}
                  />
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    연락처
                  </label>
                  <InputBox
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    placeholder="연락처를 입력해 주세요"
                    type="tel"
                  />
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    이메일
                  </label>
                  <InputBox
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="이메일을 입력해 주세요"
                    type="email"
                  />
                </div>

                {/* 생년월일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    생년월일
                  </label>
                  <InputBox
                    value={formData.birthDate}
                    onChange={handleInputChange("birthDate")}
                    placeholder="YYYY-MM-DD"
                    type="text"
                  />
                </div>
              </div>

              {/* 수의사 면허증 */}
              <div className="mt-6">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  수의사 면허증
                </label>
                <LicenseImageUpload
                  value={
                    formData.licenseImage
                      ? URL.createObjectURL(formData.licenseImage)
                      : undefined
                  }
                  className="flex justify-center"
                  onChange={handleImageChange("licenseImage")}
                />
              </div>
            </section>

            {/* 약관 동의 섹션 */}
            <section>
              <h2 className="font-text text-[28px] font-bold text-primary mb-6">
                약관 동의
              </h2>

              <div className="p-[20px] rounded-[16px] space-y-4 border border-[1px] border-[line-primary]">
                {/* 전체 동의 */}
                <div className="pb-4 border-b border-[#E5E5E5]">
                  <Checkbox
                    checked={agreements.all}
                    onChange={handleAgreementChange("all")}
                    className="text-[18px] font-bold text-[#3B394D]"
                  >
                    전체동의
                  </Checkbox>
                </div>

                {/* 개별 약관 */}
                <div className="space-y-3 flex flex-col">
                  <Checkbox
                    checked={agreements.terms}
                    onChange={handleAgreementChange("terms")}
                    className="text-[16px] text-[#35313C]"
                  >
                    <Link href="/terms" className="text-[#35313C] underline">
                      이용약관
                    </Link>{" "}
                    동의 <span className="text-[#FF4A4A]">(필수)</span>
                  </Checkbox>

                  <Checkbox
                    checked={agreements.privacy}
                    onChange={handleAgreementChange("privacy")}
                    className="text-[16px] text-[#35313C]"
                  >
                    <Link href="/privacy" className="text-[#35313C] underline">
                      개인정보처리방침
                    </Link>{" "}
                    동의 <span className="text-[#FF4A4A]">(필수)</span>
                  </Checkbox>

                  <Checkbox
                    checked={agreements.marketing}
                    onChange={handleAgreementChange("marketing")}
                    className="text-[16px] text-[#35313C]"
                  >
                    <Link
                      href="/marketing"
                      className="text-[#35313C] underline"
                    >
                      마케팅정보수신
                    </Link>{" "}
                    동의 <span className="text-[#C5CCD8]">(선택)</span>
                  </Checkbox>
                </div>
              </div>
            </section>

            {/* 버튼 영역 */}
            <div className="flex gap-4 w-full min-w-0 flex justify-center">
              <Button
                variant="line"
                size="medium"
                onClick={handleCancel}
                fullWidth={true}
              >
                취소
              </Button>
              <Button
                variant="keycolor"
                size="medium"
                onClick={handleRegister}
                fullWidth={true}
              >
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </main>

    </>
  );
}
