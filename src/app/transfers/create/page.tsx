"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "public/icons";
import { InputBox } from "@/components/ui/Input/InputBox";
import { Textarea } from "@/components/ui/Input/Textarea";
import { SelectBox } from "@/components/ui/SelectBox";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { Button } from "@/components/ui/Button";
import { AddressSearch } from "@/components/features/profile/AddressSearch";
import { DocumentUpload } from "@/components/features/profile/DocumentUpload";
import { MultiImageUpload } from "@/components/features/profile/MultiImageUpload";

interface FormData {
  title: string;
  category: string;
  isSale: boolean; // 매매 여부 (true: 매매, false: 임대)
  price: string; // 매매가격 또는 월세가격
  area: string; // 평수 (병원양도일 때만)
  description: string;
  address: string;
  detailAddress: string;
  images: File[];
  documents: File[];
}

const categoryOptions = [
  { value: "병원양도", label: "병원양도" },
  { value: "기계장치", label: "기계장치" },
  { value: "의료장비", label: "의료장비" },
  { value: "인테리어", label: "인테리어" },
];

export default function CreateTransferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    isSale: true, // 기본값은 매매
    price: "",
    area: "",
    description: "",
    address: "",
    detailAddress: "",
    images: [],
    documents: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSaleTypeChange = (isSale: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isSale: isSale,
      price: "", // 타입 변경시 가격 초기화
    }));
  };

  const handleImageUpload = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleDocumentUpload = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!formData.category) {
      newErrors.category = "카테고리를 선택해주세요.";
    }

    if (formData.category === "병원양도") {
      if (!formData.area.trim()) {
        newErrors.area = "평수를 입력해주세요.";
      }
    }

    if (!formData.price.trim()) {
      newErrors.price = "가격을 입력해주세요.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "상세 내용을 입력해주세요.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm() && !isDraft) return;

    setIsLoading(true);
    try {
      // API 호출 로직
      console.log("Submitting form:", { ...formData, isDraft });

      // 성공 시 리스트 페이지로 이동
      router.push("/transfers");
    } catch (error) {
      console.error("Submit error:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPricePlaceholder = () => {
    if (formData.category === "병원양도") {
      return formData.isSale
        ? "매물 가격을 입력해주세요"
        : "월세 가격을 입력해주세요";
    }
    return "가격을 입력해주세요";
  };

  const getPriceSuffix = () => {
    if (formData.category === "병원양도") {
      return formData.isSale ? "원" : "원/월";
    }
    return "원";
  };

  const isPriceDisabled = () => {
    return false; // 더 이상 비활성화할 필요 없음
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-[878px] mx-auto pt-[20px] pb-[140px] px-4 lg:px-0">
          {/* 헤더 */}
          <div className="flex lg:flex-col gap-[10px] lg:mb-[30px] lg:py-[0px] py-[17px] items-center lg:items-start">
            <Link
              href="/transfers"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>
            <h1 className="font-title text-[16px] lg:text-[36px] title-light text-primary">
              양수양도 게시글 작성
            </h1>
          </div>

          <div className="bg-white border border-[#EFEFF0] rounded-[20px] p-6 lg:p-[60px]">
            {/* 제목 */}
            <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center w-full lg:gap-[9px] gap-[15px]">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary w-fit">
                제목
              </label>
              <InputBox
                className="w-full max-w-[649px]"
                value={formData.title}
                onChange={handleInputChange("title")}
                placeholder="제목을 입력해주세요"
                error={!!errors.title}
                guide={
                  errors.title
                    ? { text: errors.title, type: "error" }
                    : undefined
                }
              />
            </div>

            {/* 카테고리 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                카테고리
              </label>
              <SelectBox
                options={categoryOptions}
                value={formData.category}
                onChange={handleInputChange("category")}
                placeholder="카테고리를 선택해주세요"
                error={!!errors.category}
              />
              {errors.category && (
                <p className="mt-2 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* 병원양도일 때만 표시되는 매매 여부 */}
            {formData.category === "병원양도" && (
              <div className="mb-8">
                <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                  매매 여부
                </label>
                <Checkbox
                  value="isSale"
                  checked={formData.isSale}
                  onChange={(checked) => handleSaleTypeChange(checked)}
                >
                  매매 (체크 해제시 임대)
                </Checkbox>
              </div>
            )}

            {/* 가격 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                가격
              </label>
              <InputBox
                value={formData.price}
                onChange={handleInputChange("price")}
                placeholder={getPricePlaceholder()}
                suffix={getPriceSuffix()}
                state={isPriceDisabled() ? "disabled" : undefined}
                error={!!errors.price}
                guide={
                  errors.price
                    ? { text: errors.price, type: "error" }
                    : undefined
                }
                disabled={isPriceDisabled()}
              />
            </div>

            {/* 평수 (병원양도일 때만) */}
            {formData.category === "병원양도" && (
              <div className="mb-8">
                <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                  평수
                </label>
                <InputBox
                  value={formData.area}
                  onChange={handleInputChange("area")}
                  placeholder="평수를 입력해주세요"
                  suffix="평"
                  error={!!errors.area}
                  guide={
                    errors.area
                      ? { text: errors.area, type: "error" }
                      : undefined
                  }
                />
              </div>
            )}

            {/* 상세 내용 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                상세 내용
              </label>
              <Textarea
                value={formData.description}
                onChange={handleInputChange("description")}
                placeholder="병원 소개, 양도/임대 조건 등 상세 정보를 입력해주세요"
                error={!!errors.description}
                resize="vertical"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* 주소 검색 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                주소 검색
              </label>
              <div className="w-full">
                <AddressSearch
                  address={formData.address}
                  detailAddress={formData.detailAddress}
                  onAddressChange={handleInputChange("address")}
                  onDetailAddressChange={handleInputChange("detailAddress")}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EFEFF0] rounded-[20px] p-6 lg:p-[60px] mt-[40px]">
            {/* 이미지/파일 첨부 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                이미지/파일 첨부
              </label>

              {/* 파일 업로드 */}
              <div className="mb-6 max-w-[758px]">
                <DocumentUpload
                  value={formData.documents}
                  onChange={handleDocumentUpload}
                  maxFiles={3}
                />
              </div>

              {/* 이미지 업로드 */}
              <div>
                <MultiImageUpload
                  value={formData.images as any}
                  onChange={handleImageUpload as any}
                  maxImages={10}
                />
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-row gap-4 justify-center mt-[40px]">
            <Button
              variant="line"
              size="large"
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
            >
              임시저장
            </Button>
            <Button
              variant="default"
              size="large"
              onClick={() => handleSubmit(false)}
              loading={isLoading}
            >
              등록하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
