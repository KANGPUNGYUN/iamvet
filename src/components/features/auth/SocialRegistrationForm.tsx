"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import { PhoneInput, BirthDateInput } from "@/components/ui/FormattedInput";
import { ProfileImageUpload, LicenseImageUpload } from "@/components/features/profile";
import { checkEmailDuplicate } from "@/actions/auth";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SocialRegistrationData {
  nickname: string;
  phone: string;
  email: string; // 수의학과 학생의 경우 대학교 이메일
  realName: string; // 실명 (SNS 이름과 별도)
  birthDate: string;
  profileImage: string | null;
  licenseImage?: string | null; // 수의사만 필요
  universityEmail?: string; // 수의학과 학생만 필요
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

interface SocialRegistrationFormProps {
  userType: 'veterinarian' | 'veterinary-student';
  socialData: {
    email: string;
    name: string;
    profileImage?: string;
  };
  onSubmit?: (data: SocialRegistrationData) => void;
  onCancel?: () => void;
}

export const SocialRegistrationForm: React.FC<SocialRegistrationFormProps> = ({ 
  userType, 
  socialData, 
  onSubmit, 
  onCancel 
}) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<SocialRegistrationData>({
    nickname: "",
    phone: "",
    email: userType === 'veterinary-student' ? "" : socialData.email, // 수의사는 SNS 이메일 사용
    realName: "", // 실명은 사용자가 직접 입력
    birthDate: "",
    profileImage: socialData.profileImage || null,
    licenseImage: null,
    universityEmail: userType === 'veterinary-student' ? "" : undefined,
    agreements: {
      terms: true, // SNS 로그인 시 자동 동의
      privacy: true,
      marketing: false,
    },
  });

  // 중복확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: {
      isChecking: false,
      isValid: userType === 'veterinarian', // 수의사는 SNS 이메일 사용하므로 기본 valid
    },
    universityEmail: {
      isChecking: false,
      isValid: false,
    },
  });

  // 입력 에러 상태
  const [inputErrors, setInputErrors] = useState({
    realName: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    universityEmail: "",
  });

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    all: true, // SNS 로그인 시 필수 약관은 자동 동의
    terms: true,
    privacy: true,
    marketing: false,
  });

  const handleInputChange = (field: keyof SocialRegistrationData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 입력 시 해당 필드 에러 초기화
    if (inputErrors[field as keyof typeof inputErrors]) {
      setInputErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // 실시간 검증
    validateField(field, value);
  };

  const validateField = (field: keyof SocialRegistrationData, value: string) => {
    let error = "";

    switch (field) {
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
      case "universityEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = userType === 'veterinary-student' && field === 'universityEmail' 
            ? "대학교 이메일을 입력해주세요." 
            : "이메일을 입력해주세요.";
        } else if (!emailRegex.test(value)) {
          error = "올바른 이메일 형식을 입력해주세요.";
        } else if (userType === 'veterinary-student' && field === 'universityEmail' && !validateUniversityEmail(value)) {
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

  const handleImageChange = (field: keyof Pick<SocialRegistrationData, 'profileImage' | 'licenseImage'>) => (url: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleUniversityEmailDuplicateCheck = async () => {
    if (!formData.universityEmail?.trim()) {
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

    setDuplicateCheck((prev) => ({
      ...prev,
      universityEmail: { ...prev.universityEmail, isChecking: true },
    }));

    try {
      const result = await checkEmailDuplicate(formData.universityEmail);

      if (result.success) {
        const isValid = !result.isDuplicate;
        setDuplicateCheck((prev) => ({
          ...prev,
          universityEmail: {
            isChecking: false,
            isValid,
          },
        }));
        alert(result.message);
      } else {
        setDuplicateCheck((prev) => ({
          ...prev,
          universityEmail: { ...prev.universityEmail, isChecking: false },
        }));
        alert(result.error || "이메일 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        universityEmail: { ...prev.universityEmail, isChecking: false },
      }));
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleAgreementChange = (field: keyof typeof agreements) => (checked: boolean) => {
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
          privacy: field === "privacy" ? checked : prevFormData.agreements.privacy,
          marketing: field === "marketing" ? checked : prevFormData.agreements.marketing,
        },
      }));

      return newAgreements;
    });
  };

  const handleSubmit = () => {
    const requiredFields: (keyof typeof inputErrors)[] = ["realName", "nickname", "phone", "birthDate"];
    
    // 수의학과 학생의 경우 대학교 이메일 필수
    if (userType === 'veterinary-student') {
      requiredFields.push("universityEmail");
    }

    const errors: string[] = [];

    requiredFields.forEach((field) => {
      const value = field === 'universityEmail' 
        ? formData.universityEmail || ""
        : formData[field] as string;
      
      if (field === 'universityEmail') {
        validateField('universityEmail' as any, value);
      } else {
        validateField(field as keyof SocialRegistrationData, value);
      }

      if (!value?.trim()) {
        const fieldName: Record<string, string> = {
          realName: "실명",
          nickname: "닉네임",
          phone: "연락처",
          birthDate: "생년월일",
          universityEmail: "대학교 이메일",
          email: "이메일",
        };
        errors.push(`${fieldName[field]}를 입력해주세요.`);
      }
    });

    // 수의학과 학생의 경우 대학교 이메일 인증 확인
    if (userType === 'veterinary-student' && !duplicateCheck.universityEmail.isValid) {
      errors.push("대학교 이메일 인증을 완료해주세요.");
    }

    // 약관 동의 검증
    if (!formData.agreements.terms || !formData.agreements.privacy) {
      errors.push("필수 약관에 동의해주세요.");
    }

    // 에러가 있다면 첫 번째 에러 표시
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }

    // 수의학과 학생의 경우 universityEmail을 email로 설정
    if (userType === 'veterinary-student' && formData.universityEmail) {
      formData.email = formData.universityEmail;
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
        {/* SNS 계정 정보 표시 */}
        <section>
          <h2 className="font-text text-[28px] font-bold text-primary mb-6">
            연결된 SNS 계정
          </h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700 mb-2">
              <strong>이름:</strong> {socialData.name}
            </p>
            <p className="text-sm text-blue-700">
              <strong>이메일:</strong> {socialData.email}
            </p>
          </div>
        </section>

        {/* 기본 정보 섹션 */}
        <section>
          <h2 className="font-text text-[28px] font-bold text-primary mb-6">
            추가 정보 입력
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
              <PhoneInput
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="연락처를 입력해 주세요"
                className={inputErrors.phone ? "border-red-500" : ""}
              />
              {inputErrors.phone && (
                <p className="text-red-500 text-sm mt-2">{inputErrors.phone}</p>
              )}
            </div>

            {/* 수의학과 학생의 경우 대학교 이메일 입력 */}
            {userType === 'veterinary-student' && (
              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  대학교 이메일
                  <span className="text-sm text-gray-500 ml-2">
                    (수의학과 인증용)
                  </span>
                </label>
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
                  <p>수의학과 인증을 위해 대학교 이메일을 입력해주세요.</p>
                </div>
                <InputBox
                  value={formData.universityEmail || ""}
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
                      ? { text: "인증된 수의학과 대학교 이메일입니다", type: "success" }
                      : undefined
                  }
                />
              </div>
            )}

            {/* 생년월일 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                생년월일
              </label>
              <BirthDateInput
                value={formData.birthDate}
                onChange={handleInputChange("birthDate")}
                placeholder="YYYY-MM-DD"
                className={inputErrors.birthDate ? "border-red-500" : ""}
              />
              {inputErrors.birthDate && (
                <p className="text-red-500 text-sm mt-2">{inputErrors.birthDate}</p>
              )}
            </div>

            {/* 수의사의 경우 면허증 이미지 */}
            {userType === 'veterinarian' && (
              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  수의사 면허증
                  <span className="text-sm text-gray-500 ml-2">(선택)</span>
                </label>
                <LicenseImageUpload
                  value={formData.licenseImage || undefined}
                  onChange={handleImageChange("licenseImage")}
                />
              </div>
            )}
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
            onClick={handleSubmit}
            fullWidth={true}
          >
            회원가입 완료
          </Button>
        </div>
      </div>
    </div>
  );
};