"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import { ProfileImageUpload, AddressSearch } from "@/components/features/profile";
import { checkEmailDuplicate } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";

interface HospitalRegistrationData {
  userId: string;
  password: string;
  passwordConfirm: string;
  hospitalName: string;
  businessNumber: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  detailAddress: string;
  profileImage: File | null;
  businessLicense: File | null;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

interface HospitalRegistrationFormProps {
  onSubmit?: (data: HospitalRegistrationData) => void;
  onCancel?: () => void;
}

export const HospitalRegistrationForm: React.FC<
  HospitalRegistrationFormProps
> = ({ onSubmit, onCancel }) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<HospitalRegistrationData>({
    userId: "",
    password: "",
    passwordConfirm: "",
    hospitalName: "",
    businessNumber: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    detailAddress: "",
    profileImage: null,
    businessLicense: null,
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
  });

  // 입력 에러 상태
  const [inputErrors, setInputErrors] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    hospitalName: "",
    businessNumber: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
  });

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange =
    (field: keyof HospitalRegistrationData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // 입력 시 해당 필드 에러 초기화
      if (inputErrors[field as keyof typeof inputErrors]) {
        setInputErrors((prev) => ({ ...prev, [field]: "" }));
      }

      // 실시간 검증
      validateField(field, value);
    };

  const validateField = (
    field: keyof HospitalRegistrationData,
    value: string
  ) => {
    let error = "";

    switch (field) {
      case "userId":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "이메일을 입력해주세요.";
        } else if (!emailRegex.test(value)) {
          error = "올바른 이메일 형식을 입력해주세요.";
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

      case "hospitalName":
        if (!value.trim()) {
          error = "병원명을 입력해주세요.";
        } else if (value.length < 2) {
          error = "병원명은 2자 이상 입력해주세요.";
        }
        break;

      case "businessNumber":
        const businessRegex = /^\d{3}-\d{2}-\d{5}$/;
        if (!value.trim()) {
          error = "사업자등록번호를 입력해주세요.";
        } else if (!businessRegex.test(value)) {
          error = "000-00-00000 형식으로 입력해주세요.";
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
        const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "이메일을 입력해주세요.";
        } else if (!emailRegex2.test(value)) {
          error = "올바른 이메일 형식을 입력해주세요.";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "주소를 입력해주세요.";
        }
        break;

      case "detailAddress":
        // 상세주소는 선택사항이므로 검증하지 않음
        break;
    }

    setInputErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleImageChange =
    (field: "profileImage" | "businessLicense") => (file: File | null) => {
      setFormData((prev) => ({ ...prev, [field]: file }));
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
      "hospitalName",
      "businessNumber",
      "phone",
      "email",
      "address",
    ];
    const errors: string[] = [];

    fields.forEach((field) => {
      const value = formData[field] as string;
      validateField(field as keyof HospitalRegistrationData, value);

      if (!value?.trim()) {
        const fieldName = {
          userId: "이메일 (아이디)",
          password: "비밀번호",
          passwordConfirm: "비밀번호 확인",
          hospitalName: "병원명",
          businessNumber: "사업자등록번호",
          phone: "연락처",
          email: "이메일",
          address: "주소",
        }[field];
        errors.push(`${fieldName}을 입력해주세요.`);
      }
    });

    // 중복확인 검증
    if (!duplicateCheck.userId.isValid) {
      errors.push("이메일 중복확인을 완료해주세요.");
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
                placeholder="이메일 주소를 입력해주세요"
                type="email"
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
                    ? { text: "사용 가능한 이메일입니다", type: "success" }
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

        {/* 병원 정보 섹션 */}
        <section>
          <h2 className="font-text text-[28px] font-bold text-primary mb-6">
            병원 정보
          </h2>

          {/* 프로필 사진 */}
          <div className="mb-6">
            <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
              병원 로고
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
            {/* 병원명 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                병원명
              </label>
              <InputBox
                value={formData.hospitalName}
                onChange={handleInputChange("hospitalName")}
                placeholder="병원명을 입력해주세요"
                error={!!inputErrors.hospitalName}
                guide={
                  inputErrors.hospitalName
                    ? { text: inputErrors.hospitalName, type: "error" }
                    : undefined
                }
              />
            </div>

            {/* 사업자등록번호 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                사업자등록번호
              </label>
              <InputBox
                value={formData.businessNumber}
                onChange={handleInputChange("businessNumber")}
                placeholder="000-00-00000 형식으로 입력해주세요"
                error={!!inputErrors.businessNumber}
                guide={
                  inputErrors.businessNumber
                    ? { text: inputErrors.businessNumber, type: "error" }
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
                error={!!inputErrors.email}
                guide={
                  inputErrors.email
                    ? { text: inputErrors.email, type: "error" }
                    : undefined
                }
              />
            </div>

            {/* 웹사이트 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                웹사이트 (선택)
              </label>
              <InputBox
                value={formData.website}
                onChange={handleInputChange("website")}
                placeholder="https://www.example.com"
                type="url"
              />
            </div>

            {/* 주소 */}
            <AddressSearch
              address={formData.address}
              detailAddress={formData.detailAddress}
              onAddressChange={handleInputChange("address")}
              onDetailAddressChange={handleInputChange("detailAddress")}
            />
          </div>

          {/* 사업자등록증 (선택사항으로 변경) */}
          <div className="mt-6">
            <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
              사업자등록증 (선택)
            </label>
            <ProfileImageUpload
              value={
                formData.businessLicense
                  ? URL.createObjectURL(formData.businessLicense)
                  : undefined
              }
              className="flex justify-center"
              onChange={handleImageChange("businessLicense")}
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