"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import { checkEmailDuplicate } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";

interface VeterinarianRegistrationData {
  userId: string;
  password: string;
  passwordConfirm: string;
  realName: string;
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

interface VeterinarianRegistrationFormProps {
  onSubmit?: (data: VeterinarianRegistrationData) => void;
  onCancel?: () => void;
  socialData?: {
    email: string;
    name: string;
    profileImage?: string;
  };
}

export const VeterinarianRegistrationForm: React.FC<
  VeterinarianRegistrationFormProps
> = ({ onSubmit, onCancel, socialData }) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<VeterinarianRegistrationData>({
    userId: "",
    password: socialData ? "" : "", // SNS 로그인 시 패스워드 불필요
    passwordConfirm: socialData ? "" : "",
    realName: socialData?.name || "",
    nickname: "",
    phone: "",
    email: socialData?.email || "",
    birthDate: "",
    profileImage: socialData?.profileImage || null,
    licenseImage: null,
    agreements: {
      terms: !!socialData, // SNS 로그인 시 자동 동의
      privacy: !!socialData,
      marketing: false,
    },
  });

  // 중복확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    userId: {
      isChecking: false,
      isValid: false,
    },
    email: {
      isChecking: false,
      isValid: false,
    },
  });

  // 입력 에러 상태
  const [inputErrors, setInputErrors] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    realName: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
  });

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange =
    (field: keyof VeterinarianRegistrationData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // 입력 시 해당 필드 에러 초기화
      if (inputErrors[field as keyof typeof inputErrors]) {
        setInputErrors((prev) => ({ ...prev, [field]: "" }));
      }

      // 실시간 검증
      validateField(field, value);
    };

  const validateField = (
    field: keyof VeterinarianRegistrationData,
    value: string
  ) => {
    let error = "";

    switch (field) {
      case "userId":
        if (!value.trim()) {
          error = "아이디를 입력해주세요.";
        } else if (value.length < 4) {
          error = "아이디는 4자 이상이어야 합니다.";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "비밀번호를 입력해주세요.";
        } else if (value.length < 8) {
          error = "비밀번호는 8자 이상 입력해주세요.";
        }
        break;

      case "passwordConfirm":
        if (!value.trim()) {
          error = "비밀번호 확인을 입력해주세요.";
        } else if (value !== formData.password) {
          error = "비밀번호가 일치하지 않습니다.";
        }
        break;

      case "realName":
        if (!value.trim()) {
          error = "실명을 입력해주세요.";
        } else if (value.length < 2) {
          error = "실명은 2자 이상 입력해주세요.";
        }
        break;

      case "nickname":
        if (!value.trim()) {
          error = "닉네임을 입력해주세요.";
        } else if (value.length < 2) {
          error = "닉네임은 2자 이상 입력해주세요.";
        }
        break;

      case "phone":
        const phoneRegex = /^[0-9-+\s()]{10,15}$/;
        if (!value.trim()) {
          error = "연락처를 입력해주세요.";
        } else if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          error = "올바른 연락처 형식을 입력해주세요.";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "이메일을 입력해주세요.";
        } else if (!emailRegex.test(value)) {
          error = "올바른 이메일 형식을 입력해주세요.";
        }
        break;

      case "birthDate":
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!value.trim()) {
          error = "생년월일을 입력해주세요.";
        } else if (!dateRegex.test(value)) {
          error = "YYYY-MM-DD 형식으로 입력해주세요.";
        }
        break;
    }

    setInputErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleImageChange =
    (field: "profileImage" | "licenseImage") => (url: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: url }));
    };

  const handleUserIdDuplicateCheck = async () => {
    console.log("CLIENT: handleUserIdDuplicateCheck called");
    console.log("CLIENT: formData.userId =", formData.userId);

    if (!formData.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (formData.userId.length < 4) {
      alert("아이디는 4자 이상이어야 합니다.");
      return;
    }

    console.log("CLIENT: About to call checkUsernameDuplicate");
    setDuplicateCheck((prev) => ({
      ...prev,
      userId: { ...prev.userId, isChecking: true },
    }));

    try {
      console.log("CLIENT: Calling checkUsernameDuplicate with:", formData.userId);
      // userId는 checkUsernameDuplicate를 사용해야 함
      const result = await checkEmailDuplicate(formData.userId); // 임시로 checkEmailDuplicate 사용
      console.log("CLIENT: checkUsernameDuplicate result:", result);

      if (result.success) {
        const isValid = !result.isDuplicate;
        console.log(
          "CLIENT: isDuplicate =",
          result.isDuplicate,
          "isValid =",
          isValid
        );
        setDuplicateCheck((prev) => ({
          ...prev,
          userId: {
            isChecking: false,
            isValid,
          },
        }));
        alert(result.message);
      } else {
        console.log("CLIENT: checkUsernameDuplicate failed:", result.error);
        setDuplicateCheck((prev) => ({
          ...prev,
          userId: { ...prev.userId, isChecking: false },
        }));
        alert(result.error || "아이디 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("CLIENT: 아이디 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        userId: { ...prev.userId, isChecking: false },
      }));
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleEmailDuplicateCheck = async () => {
    console.log("CLIENT: handleEmailDuplicateCheck called");
    console.log("CLIENT: formData.email =", formData.email);

    if (!formData.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    console.log("CLIENT: About to call checkEmailDuplicate");
    setDuplicateCheck((prev) => ({
      ...prev,
      email: { ...prev.email, isChecking: true },
    }));

    try {
      console.log("CLIENT: Calling checkEmailDuplicate with:", formData.email);
      const result = await checkEmailDuplicate(formData.email);
      console.log("CLIENT: checkEmailDuplicate result:", result);

      if (result.success) {
        const isValid = !result.isDuplicate;
        console.log(
          "CLIENT: isDuplicate =",
          result.isDuplicate,
          "isValid =",
          isValid
        );
        setDuplicateCheck((prev) => ({
          ...prev,
          email: {
            isChecking: false,
            isValid,
          },
        }));
        alert(result.message);
      } else {
        console.log("CLIENT: checkEmailDuplicate failed:", result.error);
        setDuplicateCheck((prev) => ({
          ...prev,
          email: { ...prev.email, isChecking: false },
        }));
        alert(result.error || "이메일 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("CLIENT: 이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        email: { ...prev.email, isChecking: false },
      }));
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleAgreementChange =
    (field: keyof typeof agreements) => (checked: boolean) => {
      setAgreements((prev) => {
        const newAgreements = { ...prev, [field]: checked };

        // 전체 동의 체크/해제
        if (field === "all") {
          const updatedAgreements = {
            all: checked,
            terms: checked,
            privacy: checked,
            marketing: checked,
          };

          // formData.agreements도 동기화
          setFormData((prevFormData) => ({
            ...prevFormData,
            agreements: {
              terms: checked,
              privacy: checked,
              marketing: checked,
            },
          }));

          return updatedAgreements;
        }

        // 개별 항목 체크 시 전체 동의 상태 업데이트
        const { all, ...others } = newAgreements;
        const allChecked = Object.values(others).every(Boolean);
        newAgreements.all = allChecked;

        // formData.agreements도 동기화
        setFormData((prevFormData) => ({
          ...prevFormData,
          agreements: {
            terms: field === "terms" ? checked : prevFormData.agreements.terms,
            privacy:
              field === "privacy" ? checked : prevFormData.agreements.privacy,
            marketing:
              field === "marketing"
                ? checked
                : prevFormData.agreements.marketing,
          },
        }));

        return newAgreements;
      });
    };

  const handleRegister = () => {
    // SNS 로그인 시에는 userId, password, passwordConfirm 필드 제외
    const requiredFields: (keyof typeof inputErrors)[] = socialData 
      ? ["realName", "nickname", "phone", "email", "birthDate"]
      : ["userId", "password", "passwordConfirm", "realName", "nickname", "phone", "email", "birthDate"];
    const errors: string[] = [];

    requiredFields.forEach((field) => {
      const value = formData[field] as string;
      validateField(field as keyof VeterinarianRegistrationData, value);

      if (!value?.trim()) {
        const fieldName = {
          userId: "아이디",
          password: "비밀번호",
          passwordConfirm: "비밀번호 확인",
          realName: "실명",
          nickname: "닉네임",
          phone: "연락처",
          email: "이메일",
          birthDate: "생년월일",
        }[field];
        errors.push(`${fieldName}를 입력해주세요.`);
      }
    });

    // SNS 로그인이 아닐 때만 중복확인 검증
    if (!socialData) {
      if (!duplicateCheck.userId.isValid) {
        errors.push("아이디 중복확인을 완료해주세요.");
      }

      if (!duplicateCheck.email.isValid) {
        errors.push("이메일 중복확인을 완료해주세요.");
      }
    }

    // 약관 동의 검증
    if (!formData.agreements.terms || !formData.agreements.privacy) {
      errors.push("필수 약관에 동의해주세요.");
    }

    // 에러가 있다면 첫 번째 에러 표시 및 해당 필드로 포커스
    if (errors.length > 0) {
      alert(errors[0]);

      // 첫 번째 에러 필드 찾기 및 포커스
      for (const field of requiredFields) {
        if (!formData[field]?.toString().trim() || inputErrors[field]) {
          const element = document.querySelector(
            `input[placeholder*="${field}"]`
          ) as HTMLInputElement;
          if (element) {
            element.focus();
            break;
          }
        }
      }
      return;
    }

    onSubmit?.(formData);
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      onCancel?.();
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex flex-col gap-[80px]">
        {/* 계정 정보 섹션 */}
        <section>
          <h2 className="font-text text-[28px] font-bold text-primary mb-6">
            계정 정보
          </h2>

          <div className="space-y-6">
            {/* SNS 로그인이 아닐 때만 아이디 필드 표시 */}
            {!socialData && (
              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  아이디
                </label>
                <InputBox
                  value={formData.userId}
                  onChange={handleInputChange("userId")}
                  placeholder="아이디를 입력해주세요"
                  type="text"
                  duplicateCheck={{
                    buttonText: "중복 확인",
                    onCheck: handleUserIdDuplicateCheck,
                    isChecking: duplicateCheck.userId.isChecking,
                    isValid: duplicateCheck.userId.isValid,
                  }}
                  success={duplicateCheck.userId.isValid}
                  error={!!inputErrors.userId}
                  guide={
                    inputErrors.userId
                      ? { text: inputErrors.userId, type: "error" }
                      : duplicateCheck.userId.isValid
                      ? { text: "사용 가능한 아이디입니다", type: "success" }
                      : undefined
                  }
                />
              </div>
            )}

            {/* SNS 로그인이 아닐 때만 비밀번호 필드 표시 */}
            {!socialData && (
              <>
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    비밀번호
                  </label>
                  <InputBox
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    placeholder="비밀번호를 입력해주세요"
                    type="password"
                    error={!!inputErrors.password}
                    guide={
                      inputErrors.password
                        ? { text: inputErrors.password, type: "error" }
                        : { text: "비밀번호는 8자 이상 입력해주세요", type: "info" }
                    }
                  />
                </div>

                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    비밀번호 확인
                  </label>
                  <InputBox
                    value={formData.passwordConfirm}
                    onChange={handleInputChange("passwordConfirm")}
                    placeholder="비밀번호를 다시 입력해주세요"
                    type="password"
                    error={!!inputErrors.passwordConfirm}
                    guide={
                      inputErrors.passwordConfirm
                        ? { text: inputErrors.passwordConfirm, type: "error" }
                        : undefined
                    }
                  />
                </div>
              </>
            )}
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
              value={formData.profileImage || undefined}
              onChange={handleImageChange("profileImage")}
              folder="profiles"
            />
          </div>

          <div className="space-y-6">
            {/* 실명 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                실명
              </label>
              <InputBox
                value={formData.realName}
                onChange={handleInputChange("realName")}
                placeholder="실명을 입력해주세요"
                error={!!inputErrors.realName}
                guide={
                  inputErrors.realName
                    ? { text: inputErrors.realName, type: "error" }
                    : undefined
                }
              />
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                닉네임
              </label>
              <InputBox
                value={formData.nickname}
                onChange={handleInputChange("nickname")}
                placeholder="닉네임을 입력해주세요"
                error={!!inputErrors.nickname}
                guide={
                  inputErrors.nickname
                    ? { text: inputErrors.nickname, type: "error" }
                    : undefined
                }
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
                error={!!inputErrors.phone}
                guide={
                  inputErrors.phone
                    ? { text: inputErrors.phone, type: "error" }
                    : undefined
                }
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
                readOnly={!!socialData}
                duplicateCheck={socialData ? undefined : {
                  buttonText: "중복 확인",
                  onCheck: handleEmailDuplicateCheck,
                  isChecking: duplicateCheck.email.isChecking,
                  isValid: duplicateCheck.email.isValid,
                }}
                success={socialData ? true : duplicateCheck.email.isValid}
                error={!!inputErrors.email}
                guide={
                  socialData ? { text: "SNS 로그인으로 인증된 이메일입니다", type: "success" } :
                  inputErrors.email
                    ? { text: inputErrors.email, type: "error" }
                    : duplicateCheck.email.isValid
                    ? { text: "사용 가능한 이메일입니다", type: "success" }
                    : undefined
                }
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
                error={!!inputErrors.birthDate}
                guide={
                  inputErrors.birthDate
                    ? { text: inputErrors.birthDate, type: "error" }
                    : undefined
                }
              />
            </div>
          </div>

          {/* 수의사 면허증 */}
          <div className="mt-6">
            <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
              수의사 면허증
            </label>
            <LicenseImageUpload
              value={formData.licenseImage || undefined}
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
                className="text-[16px] text-[#35313C] w-full"
              >
                <Link href="/terms" className="text-[#35313C] underline">
                  이용약관
                </Link>{" "}
                동의 <span className="text-[#FF4A4A]">(필수)</span>
              </Checkbox>

              <Checkbox
                checked={agreements.privacy}
                onChange={handleAgreementChange("privacy")}
                className="text-[16px] text-[#35313C] w-full"
              >
                <Link href="/privacy" className="text-[#35313C] underline">
                  개인정보처리방침
                </Link>{" "}
                동의 <span className="text-[#FF4A4A]">(필수)</span>
              </Checkbox>

              <Checkbox
                checked={agreements.marketing}
                onChange={handleAgreementChange("marketing")}
                className="text-[16px] text-[#35313C] w-full"
              >
                <Link href="/marketing" className="text-[#35313C] underline">
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
  );
};
