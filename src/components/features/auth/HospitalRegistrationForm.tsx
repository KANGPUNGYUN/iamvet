"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import { PhoneInput, BirthDateInput } from "@/components/ui/FormattedInput";
import { ProfileImageUpload, AddressSearch } from "@/components/features/profile";
import { FileUpload } from "@/components/ui/FileUpload";
import { checkEmailDuplicate, checkUsernameDuplicate } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";

interface HospitalRegistrationData {
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

interface HospitalRegistrationFormProps {
  onSubmit?: (data: HospitalRegistrationData) => void;
  onCancel?: () => void;
}

export const HospitalRegistrationForm: React.FC<
  HospitalRegistrationFormProps
> = ({ onSubmit, onCancel }) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<HospitalRegistrationData>({
    loginId: "",
    password: "",
    passwordConfirm: "",
    realName: "", // 대표자명
    hospitalName: "",
    establishedDate: "", // 병원 설립일
    businessNumber: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    detailAddress: "",
    hospitalLogo: null,
    facilityImages: [], // 병원 시설 이미지
    treatmentAnimals: [], // 진료 가능 동물
    treatmentSpecialties: [], // 진료 분야
    businessLicenseFile: null, // 사업자등록증 파일
    agreements: {
      terms: false,
      privacy: false,
      marketing: false,
    },
  });

  // 중복확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    loginId: {
      isChecking: false,
      isValid: false,
    },
  });

  // 입력 에러 상태
  const [inputErrors, setInputErrors] = useState({
    loginId: "",
    password: "",
    passwordConfirm: "",
    realName: "", // 대표자명
    hospitalName: "",
    establishedDate: "", // 병원 설립일
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
      case "loginId":
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

      case "realName":
        if (!value.trim()) {
          error = "대표자명을 입력해주세요.";
        } else if (value.length < 2) {
          error = "대표자명은 2자 이상 입력해주세요.";
        }
        break;

      case "hospitalName":
        if (!value.trim()) {
          error = "병원명을 입력해주세요.";
        } else if (value.length < 2) {
          error = "병원명은 2자 이상 입력해주세요.";
        }
        break;

      case "establishedDate":
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!value.trim()) {
          error = "병원 설립일을 입력해주세요.";
        } else if (!dateRegex.test(value)) {
          error = "YYYY-MM-DD 형식으로 입력해주세요.";
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
    (field: "hospitalLogo") => (url: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: url }));
    };

  const handleFacilityImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, facilityImages: urls }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, businessLicenseFile: file }));
  };

  const handleCheckboxChange = (field: 'treatmentAnimals' | 'treatmentSpecialties') => (checked: boolean, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleLoginIdDuplicateCheck = async () => {
    console.log("CLIENT: handleLoginIdDuplicateCheck called");
    console.log("CLIENT: formData.loginId =", formData.loginId);

    if (!formData.loginId.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.loginId)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    console.log("CLIENT: About to call checkEmailDuplicate");
    setDuplicateCheck((prev) => ({
      ...prev,
      loginId: { ...prev.loginId, isChecking: true },
    }));

    try {
      console.log("CLIENT: Calling checkEmailDuplicate with:", formData.loginId);
      const result = await checkEmailDuplicate(formData.loginId);
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
          loginId: {
            isChecking: false,
            isValid,
          },
        }));
        alert(result.message);
      } else {
        console.log("CLIENT: checkEmailDuplicate failed:", result.error);
        setDuplicateCheck((prev) => ({
          ...prev,
          loginId: { ...prev.loginId, isChecking: false },
        }));
        alert(result.error || "이메일 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("CLIENT: 이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        loginId: { ...prev.loginId, isChecking: false },
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
    const fields: (keyof Pick<HospitalRegistrationData, "loginId" | "password" | "passwordConfirm" | "realName" | "hospitalName" | "establishedDate" | "businessNumber" | "phone" | "email" | "address">)[] = [
      "loginId",
      "password",
      "passwordConfirm",
      "realName",
      "hospitalName",
      "establishedDate",
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
          loginId: "이메일 (아이디)",
          password: "비밀번호",
          passwordConfirm: "비밀번호 확인",
          realName: "대표자명",
          hospitalName: "병원명",
          establishedDate: "병원 설립일",
          businessNumber: "사업자등록번호",
          phone: "연락처",
          email: "이메일",
          address: "주소",
          detailAddress: "상세주소",
        }[field];
        errors.push(`${fieldName}을 입력해주세요.`);
      }
    });

    // 중복확인 검증
    if (!duplicateCheck.loginId.isValid) {
      errors.push("이메일 중복확인을 완료해주세요.");
    }

    // 진료 가능 동물 및 진료 분야 검증
    if (formData.treatmentAnimals.length === 0) {
      errors.push("진료 가능한 동물을 선택해주세요.");
    }
    
    if (formData.treatmentSpecialties.length === 0) {
      errors.push("진료 분야를 선택해주세요.");
    }
    
    // 사업자등록증 파일 검증
    if (!formData.businessLicenseFile) {
      errors.push("사업자등록증 파일을 업로드해주세요.");
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
                value={formData.loginId}
                onChange={handleInputChange("loginId")}
                placeholder="이메일 주소를 입력해주세요"
                type="email"
                duplicateCheck={{
                  buttonText: "중복 확인",
                  onCheck: handleLoginIdDuplicateCheck,
                  isChecking: duplicateCheck.loginId.isChecking,
                  isValid: duplicateCheck.loginId.isValid,
                }}
                success={duplicateCheck.loginId.isValid}
                error={!!inputErrors.loginId}
                guide={
                  inputErrors.loginId
                    ? { text: inputErrors.loginId, type: "error" }
                    : duplicateCheck.loginId.isValid
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
              value={formData.hospitalLogo || undefined}
              onChange={handleImageChange("hospitalLogo")}
              folder="hospitals"
            />
          </div>

          <div className="space-y-6">
            {/* 대표자명 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                대표자명
              </label>
              <InputBox
                value={formData.realName}
                onChange={handleInputChange("realName")}
                placeholder="대표자명을 입력해주세요"
                error={!!inputErrors.realName}
                guide={
                  inputErrors.realName
                    ? { text: inputErrors.realName, type: "error" }
                    : undefined
                }
              />
            </div>

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

            {/* 병원 설립일 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                병원 설립일
              </label>
              <BirthDateInput
                value={formData.establishedDate}
                onChange={handleInputChange("establishedDate")}
                placeholder="YYYY-MM-DD"
                className={inputErrors.establishedDate ? "border-red-500" : ""}
              />
              {inputErrors.establishedDate && (
                <p className="text-red-500 text-sm mt-2">{inputErrors.establishedDate}</p>
              )}
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
            {/* 진료 가능 동물 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                진료 가능 동물 <span className="text-[#FF4A4A]">(필수)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'DOG', label: '반려견' },
                  { value: 'CAT', label: '고양이' },
                  { value: 'EXOTIC', label: '특수동물' },
                  { value: 'LARGE_ANIMAL', label: '대동물' }
                ].map((animal) => (
                  <Checkbox
                    key={animal.value}
                    checked={formData.treatmentAnimals.includes(animal.value)}
                    onChange={handleCheckboxChange('treatmentAnimals')}
                    value={animal.value}
                    className="text-[16px] text-[#35313C]"
                  >
                    {animal.label}
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* 진료 분야 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                진료 분야 <span className="text-[#FF4A4A]">(필수)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'INTERNAL_MEDICINE', label: '내과' },
                  { value: 'SURGERY', label: '외과' },
                  { value: 'DERMATOLOGY', label: '피부과' },
                  { value: 'DENTISTRY', label: '치과' },
                  { value: 'OPHTHALMOLOGY', label: '안과' },
                  { value: 'NEUROLOGY', label: '신경과' },
                  { value: 'ORTHOPEDICS', label: '정형외과' }
                ].map((specialty) => (
                  <Checkbox
                    key={specialty.value}
                    checked={formData.treatmentSpecialties.includes(specialty.value)}
                    onChange={handleCheckboxChange('treatmentSpecialties')}
                    value={specialty.value}
                    className="text-[16px] text-[#35313C]"
                  >
                    {specialty.label}
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>

          {/* 병원 시설 이미지 */}
          <div className="mt-6">
            <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
              병원 시설 이미지 (최대 10장, 선택)
            </label>
            <div className="space-y-3">
              {formData.facilityImages.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img src={imageUrl} alt={`시설 이미지 ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.facilityImages.filter((_, i) => i !== index);
                      handleFacilityImagesChange(newImages);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              ))}
              {formData.facilityImages.length < 10 && (
                <ProfileImageUpload
                  value={undefined}
                  onChange={(url) => {
                    if (url) {
                      handleFacilityImagesChange([...formData.facilityImages, url]);
                    }
                  }}
                  folder="hospitals/facilities"
                />
              )}
            </div>
          </div>

          {/* 사업자등록증 파일 */}
          <div className="mt-6">
            <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
              사업자등록증 <span className="text-[#FF4A4A]">(필수)</span>
            </label>
            <FileUpload
              onFileSelect={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024}
              placeholder="사업자등록증 파일을 업로드해주세요 (이미지, PDF, Word 파일)"
            />
            {formData.businessLicenseFile && (
              <p className="text-sm text-green-600 mt-2">
                업로드된 파일: {formData.businessLicenseFile.name}
              </p>
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