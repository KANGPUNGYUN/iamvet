"use client";

import { Footer, Header } from "@/components";
import { InputBox } from "@/components/ui/Input/InputBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  ProfileImageUpload,
  MultiImageUpload,
  DocumentUpload,
  AddressSearch,
} from "@/components/features/profile";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useState } from "react";

export default function HospitalRegisterPage() {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    hospitalName: "",
    businessNumber: "",
    representativePhone: "",
    representativeEmail: "",
    website: "",
    establishmentDate: null as Date | null,
    address: "",
    detailAddress: "",
    hospitalLogo: null as File | null,
    hospitalImages: [] as File[],
    businessRegistration: [] as File[],
  });

  // 중복확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    isValid: false,
  });

  // 진료동물 선택
  const [treatmentAnimals, setTreatmentAnimals] = useState({
    dog: false,
    cat: false,
    rabbit: false,
    bird: false,
    reptile: false,
    others: false,
  });

  // 진료분야 선택
  const [treatmentFields, setTreatmentFields] = useState({
    internal: false,
    surgery: false,
    dermatology: false,
    ophthalmology: false,
    dentistry: false,
    emergency: false,
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

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, establishmentDate: date }));
  };

  const handleFileChange =
    (field: keyof typeof formData) => (file: File | File[] | null) => {
      setFormData((prev) => ({ ...prev, [field]: file }));
    };

  const handleDuplicateCheck = async () => {
    if (!formData.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    setDuplicateCheck((prev) => ({ ...prev, isChecking: true }));

    // 임시 검증 로직
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

  const handleAnimalChange =
    (animal: keyof typeof treatmentAnimals) => (checked: boolean) => {
      setTreatmentAnimals((prev) => ({ ...prev, [animal]: checked }));
    };

  const handleFieldChange =
    (field: keyof typeof treatmentFields) => (checked: boolean) => {
      setTreatmentFields((prev) => ({ ...prev, [field]: checked }));
    };

  const handleAgreementChange =
    (field: keyof typeof agreements) => (checked: boolean) => {
      setAgreements((prev) => {
        const newAgreements = { ...prev, [field]: checked };

        if (field === "all") {
          return {
            all: checked,
            terms: checked,
            privacy: checked,
            marketing: checked,
          };
        }

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
      !formData.hospitalName ||
      !formData.businessNumber ||
      !formData.representativePhone ||
      !formData.representativeEmail ||
      !formData.address
    ) {
      alert("필수 정보를 모두 입력해주세요.");
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

    console.log("병원 회원가입 데이터:", {
      formData,
      treatmentAnimals,
      treatmentFields,
      agreements,
    });
    alert("회원가입이 완료되었습니다!");
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      window.history.back();
    }
  };

  return (
    <>
      <Header isLoggedIn={false} />

      <main className="pt-[50px] pb-[262px] px-[16px] bg-white">
        <div className="max-w-[1155px] mx-auto w-full flex flex-col mb-[100px] gap-[10px]">
          <Link href="/login/hospital" className="mr-4">
            <ArrowLeftIcon currentColor="#000" />
          </Link>
          <h1 className="font-title text-[36px] title-light text-[#3B394D]">
            병원 회원가입
          </h1>
        </div>

        <div className="max-w-[758px] mx-auto w-full">
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
                    아이디 <span className="text-[#FF4A4A]">*</span>
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
                    비밀번호 <span className="text-[#FF4A4A]">*</span>
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
                    비밀번호 확인 <span className="text-[#FF4A4A]">*</span>
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

            {/* 병원 기본 정보 섹션 */}
            <section>
              <h2 className="font-text text-[28px] font-bold text-primary mb-6">
                병원 기본 정보
              </h2>

              <div className="space-y-6">
                {/* 병원명 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    병원명 <span className="text-[#FF4A4A]">*</span>
                  </label>
                  <InputBox
                    value={formData.hospitalName}
                    onChange={handleInputChange("hospitalName")}
                    placeholder="병원명을 입력해주세요"
                  />
                </div>

                {/* 설립일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    설립일
                  </label>
                  <DatePicker
                    value={formData.establishmentDate}
                    onChange={handleDateChange}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                {/* 사업자등록번호 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    사업자등록번호 <span className="text-[#FF4A4A]">*</span>
                  </label>
                  <InputBox
                    value={formData.businessNumber}
                    onChange={handleInputChange("businessNumber")}
                    placeholder="000-00-00000 형식으로 입력해주세요"
                  />
                </div>

                {/* 대표 연락처 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    대표 연락처 <span className="text-[#FF4A4A]">*</span>
                  </label>
                  <InputBox
                    value={formData.representativePhone}
                    onChange={handleInputChange("representativePhone")}
                    placeholder="010-0000-0000"
                    type="tel"
                  />
                </div>

                {/* 대표 이메일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    대표 이메일 <span className="text-[#FF4A4A]">*</span>
                  </label>
                  <InputBox
                    value={formData.representativeEmail}
                    onChange={handleInputChange("representativeEmail")}
                    placeholder="example@hospital.com"
                    type="email"
                  />
                </div>

                {/* 병원 웹사이트 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    병원 웹사이트
                  </label>
                  <InputBox
                    value={formData.website}
                    onChange={handleInputChange("website")}
                    placeholder="https://www.example.com"
                    type="url"
                  />
                </div>

                {/* 병원 로고 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    병원 로고
                  </label>
                  <ProfileImageUpload
                    value={
                      formData.hospitalLogo
                        ? URL.createObjectURL(formData.hospitalLogo)
                        : undefined
                    }
                    onChange={handleFileChange("hospitalLogo")}
                  />
                </div>

                {/* 병원 이미지 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    병원 이미지
                  </label>
                  <div className="flex items-center gap-[4px] mb-[12px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 15.2V12M12 8.8H12.008M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
                        stroke="#9098A4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-text text-[14px] text-subtext2">
                      사진 업로드는 최대 10장 가능합니다.
                    </span>
                  </div>
                  <MultiImageUpload
                    value={formData.hospitalImages}
                    onChange={handleFileChange("hospitalImages")}
                    maxImages={10}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* 진료동물 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3 mt-6">
                    진료동물
                  </label>
                  <div className="flex self-stretch gap-[26px] flex-wrap">
                    <Checkbox
                      checked={treatmentAnimals.dog}
                      onChange={handleAnimalChange("dog")}
                    >
                      개과
                    </Checkbox>
                    <Checkbox
                      checked={treatmentAnimals.cat}
                      onChange={handleAnimalChange("cat")}
                    >
                      고양이
                    </Checkbox>
                    <Checkbox
                      checked={treatmentAnimals.rabbit}
                      onChange={handleAnimalChange("rabbit")}
                    >
                      토끼류
                    </Checkbox>
                    <Checkbox
                      checked={treatmentAnimals.bird}
                      onChange={handleAnimalChange("bird")}
                    >
                      조류
                    </Checkbox>
                    <Checkbox
                      checked={treatmentAnimals.reptile}
                      onChange={handleAnimalChange("reptile")}
                    >
                      파충류
                    </Checkbox>
                    <Checkbox
                      checked={treatmentAnimals.others}
                      onChange={handleAnimalChange("others")}
                    >
                      기타동물
                    </Checkbox>
                  </div>
                </div>

                {/* 진료분야 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-4">
                    진료분야
                  </label>
                  <div className="flex self-stretch gap-[26px] flex-wrap">
                    <Checkbox
                      checked={treatmentFields.internal}
                      onChange={handleFieldChange("internal")}
                    >
                      내과
                    </Checkbox>
                    <Checkbox
                      checked={treatmentFields.surgery}
                      onChange={handleFieldChange("surgery")}
                    >
                      외과
                    </Checkbox>
                    <Checkbox
                      checked={treatmentFields.dermatology}
                      onChange={handleFieldChange("dermatology")}
                    >
                      피부과
                    </Checkbox>
                    <Checkbox
                      checked={treatmentFields.ophthalmology}
                      onChange={handleFieldChange("ophthalmology")}
                    >
                      안과
                    </Checkbox>
                    <Checkbox
                      checked={treatmentFields.dentistry}
                      onChange={handleFieldChange("dentistry")}
                    >
                      치과
                    </Checkbox>
                    <Checkbox
                      checked={treatmentFields.emergency}
                      onChange={handleFieldChange("emergency")}
                    >
                      응급의료
                    </Checkbox>
                  </div>
                </div>
              </div>
              <div>
                <AddressSearch
                  className="mt-6"
                  address={formData.address}
                  detailAddress={formData.detailAddress}
                  onAddressChange={handleInputChange("address")}
                  onDetailAddressChange={handleInputChange("detailAddress")}
                />
              </div>
              <div>
                <h2 className="block text-[20px] font-medium text-[#3B394D] mb-4 mt-6">
                  사업자등록증 첨부
                </h2>

                <DocumentUpload
                  value={formData.businessRegistration}
                  onChange={handleFileChange("businessRegistration")}
                  maxFiles={3}
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
            <div className="flex gap-4 w-full min-w-0 justify-center">
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

      <Footer />
    </>
  );
}
