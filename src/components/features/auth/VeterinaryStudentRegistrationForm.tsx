"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import { ProfileImageUpload } from "@/components/features/profile";
import { checkEmailDuplicate } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";

interface VeterinaryStudentRegistrationData {
  userId: string;
  password: string;
  passwordConfirm: string;
  realName: string;
  nickname: string;
  phone: string;
  universityEmail: string;
  birthDate: string;
  profileImage: string | null;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

interface VeterinaryStudentRegistrationFormProps {
  onSubmit?: (data: VeterinaryStudentRegistrationData) => void;
  onCancel?: () => void;
}

export const VeterinaryStudentRegistrationForm: React.FC<
  VeterinaryStudentRegistrationFormProps
> = ({ onSubmit, onCancel }) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<VeterinaryStudentRegistrationData>({
    userId: "",
    password: "",
    passwordConfirm: "",
    realName: "",
    nickname: "",
    phone: "",
    universityEmail: "",
    birthDate: "",
    profileImage: null,
    agreements: {
      terms: false,
      privacy: false,
      marketing: false,
    },
  });

  // 중복확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    userId: {
      isChecking: false,
      isValid: false,
    },
    universityEmail: {
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
    universityEmail: "",
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
    (field: keyof VeterinaryStudentRegistrationData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // 입력 시 해당 필드 에러 초기화
      if (inputErrors[field as keyof typeof inputErrors]) {
        setInputErrors((prev) => ({ ...prev, [field]: "" }));
      }

      // 실시간 검증
      validateField(field, value);
    };

  const validateField = (
    field: keyof VeterinaryStudentRegistrationData,
    value: string
  ) => {
    let error = "";

    switch (field) {
      case "userId":
        if (!value.trim()) {
          error = "아이디를 입력해주세요.";
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

      case "universityEmail":
        const emailRegex3 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "대학교 이메일을 입력해주세요.";
        } else if (!emailRegex3.test(value)) {
          error = "올바른 이메일 형식을 입력해주세요.";
        } else if (!validateUniversityEmail(value)) {
          error = "수의학과가 있는 대학교의 이메일을 입력해주세요.";
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

  // 대학교 이메일 검증 (수의학과가 있는 대학교만)
  const validateUniversityEmail = (email: string): boolean => {
    const veterinaryUniversityDomains = [
      "kangwon.ac.kr", // 강원대
      "konkuk.ac.kr", // 건국대
      "knu.ac.kr", // 경북대
      "gnu.ac.kr", // 경상국립대
      "snu.ac.kr", // 서울대
      "jnu.ac.kr", // 전남대
      "jbnu.ac.kr", // 전북대
      "stu.jejunu.ac.kr", // 제주대
      "o.cnu.ac.kr", // 충남대
      "chungbuk.ac.kr", // 충북대
    ];

    const domain = email.split("@")[1]?.toLowerCase();
    return veterinaryUniversityDomains.includes(domain || "");
  };

  const handleImageChange = (field: "profileImage") => (url: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleEmailDuplicateCheckForUserId = async () => {
    console.log("CLIENT: handleEmailDuplicateCheckForUserId called");
    console.log("CLIENT: formData.userId =", formData.userId);

    if (!formData.userId.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userId)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    console.log("CLIENT: About to call checkEmailDuplicate");
    setDuplicateCheck((prev) => ({
      ...prev,
      userId: { ...prev.userId, isChecking: true },
    }));

    try {
      console.log("CLIENT: Calling checkEmailDuplicate with:", formData.userId);
      const result = await checkEmailDuplicate(formData.userId);
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
          userId: {
            isChecking: false,
            isValid,
          },
        }));
        alert(result.message);
      } else {
        console.log("CLIENT: checkEmailDuplicate failed:", result.error);
        setDuplicateCheck((prev) => ({
          ...prev,
          userId: { ...prev.userId, isChecking: false },
        }));
        alert(result.error || "이메일 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("CLIENT: 이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        userId: { ...prev.userId, isChecking: false },
      }));
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleUniversityEmailDuplicateCheck = async () => {
    console.log("CLIENT: handleUniversityEmailDuplicateCheck called");
    console.log("CLIENT: formData.universityEmail =", formData.universityEmail);

    if (!formData.universityEmail.trim()) {
      alert("대학교 이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.universityEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 대학교 이메일 도메인 검증
    if (!validateUniversityEmail(formData.universityEmail)) {
      alert("수의학과가 있는 대학교의 이메일을 입력해주세요.");
      return;
    }

    console.log(
      "CLIENT: About to call checkEmailDuplicate for university email"
    );
    setDuplicateCheck((prev) => ({
      ...prev,
      universityEmail: { ...prev.universityEmail, isChecking: true },
    }));

    try {
      console.log(
        "CLIENT: Calling checkEmailDuplicate with:",
        formData.universityEmail
      );
      const result = await checkEmailDuplicate(formData.universityEmail);
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
          universityEmail: {
            isChecking: false,
            isValid,
          },
        }));
        alert(result.message);
      } else {
        console.log("CLIENT: checkEmailDuplicate failed:", result.error);
        setDuplicateCheck((prev) => ({
          ...prev,
          universityEmail: { ...prev.universityEmail, isChecking: false },
        }));
        alert(
          result.error || "대학교 이메일 중복 확인 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      console.error("CLIENT: 대학교 이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        universityEmail: { ...prev.universityEmail, isChecking: false },
      }));
      alert("대학교 이메일 중복 확인 중 오류가 발생했습니다.");
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
    // 모든 필드 검증
    const fields: (keyof typeof inputErrors)[] = [
      "userId",
      "password",
      "passwordConfirm",
      "realName",
      "nickname",
      "phone",
      "universityEmail",
      "birthDate",
    ];
    const errors: string[] = [];

    fields.forEach((field) => {
      const value = formData[field] as string;
      validateField(field as keyof VeterinaryStudentRegistrationData, value);

      if (!value?.trim()) {
        const fieldName = {
          userId: "이메일 (아이디)",
          password: "비밀번호",
          passwordConfirm: "비밀번호 확인",
          realName: "실명",
          nickname: "닉네임",
          phone: "연락처",
          email: "이메일",
          universityEmail: "대학교 이메일",
          birthDate: "생년월일",
        }[field];
        errors.push(`${fieldName}를 입력해주세요.`);
      }
    });

    // 중복확인 검증
    if (!duplicateCheck.userId.isValid) {
      errors.push("이메일 중복확인을 완료해주세요.");
    }

    if (!duplicateCheck.universityEmail.isValid) {
      errors.push("대학교 이메일 인증을 완료해주세요.");
    }

    // 약관 동의 검증
    if (!formData.agreements.terms || !formData.agreements.privacy) {
      errors.push("필수 약관에 동의해주세요.");
    }

    // 에러가 있다면 첫 번째 에러 표시 및 해당 필드로 포커스
    if (errors.length > 0) {
      alert(errors[0]);

      // 첫 번째 에러 필드 찾기 및 포커스
      for (const field of fields) {
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
            {/* 아이디 */}
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
                  onCheck: handleEmailDuplicateCheckForUserId,
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
                error={!!inputErrors.password}
                guide={
                  inputErrors.password
                    ? { text: inputErrors.password, type: "error" }
                    : { text: "비밀번호는 8자 이상 입력해주세요", type: "info" }
                }
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
                error={!!inputErrors.passwordConfirm}
                guide={
                  inputErrors.passwordConfirm
                    ? { text: inputErrors.passwordConfirm, type: "error" }
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

            {/* 대학교 이메일 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                대학교 이메일
                <span className="text-sm text-gray-500 ml-2">
                  (수의학과 인증용)
                </span>
              </label>
              <InputBox
                value={formData.universityEmail}
                onChange={handleInputChange("universityEmail")}
                placeholder="수의학과 대학교 이메일을 입력해주세요 (예: student@snu.ac.kr)"
                type="email"
                duplicateCheck={{
                  buttonText: "인증",
                  onCheck: handleUniversityEmailDuplicateCheck,
                  isChecking: duplicateCheck.universityEmail.isChecking,
                  isValid: duplicateCheck.universityEmail.isValid,
                }}
                success={duplicateCheck.universityEmail.isValid}
                error={!!inputErrors.universityEmail}
                guide={
                  inputErrors.universityEmail
                    ? { text: inputErrors.universityEmail, type: "error" }
                    : duplicateCheck.universityEmail.isValid
                    ? {
                        text: "인증된 수의학과 대학교 이메일입니다",
                        type: "success",
                      }
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
