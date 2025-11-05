"use client";

import { useState, useEffect, use } from "react";
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
import { regionOptions } from "@/data/regionOptions";
import { uploadFile } from "@/lib/s3";
import { useAuth } from "@/hooks/api/useAuth";

interface FormData {
  title: string;
  category: string;
  isSale: boolean; // 매매 여부 (true: 매매, false: 임대)
  salePrice: string; // 매매 가격
  rentPrice: string; // 월세 가격
  area: string; // 평수 (병원양도일 때만)
  description: string;
  address: string; // 기본주소 (우편번호 검색으로 받은 주소)
  detailAddress: string; // 상세주소 (사용자가 입력하는 상세 주소)
  sido: string; // 시도 (서울, 경기, 부산 등)
  sigungu: string; // 시군구 (강남구, 분당구 등)
  images: string[]; // 양도양수 이미지 URL들 (MultiImageUpload에서 처리됨)
  documents: File[]; // 새로 업로드할 문서 파일들 (UI 표시용)
  documentUrls: string[]; // 새로 업로드된 문서 URL들
}

const categoryOptions = [
  { value: "병원양도", label: "병원양도" },
  { value: "기계장치", label: "기계장치" },
  { value: "의료장비", label: "의료장비" },
  { value: "인테리어", label: "인테리어" },
];

export default function EditTransferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    isSale: true, // 기본값은 매매
    salePrice: "",
    rentPrice: "",
    area: "",
    description: "",
    address: "",
    detailAddress: "",
    sido: "",
    sigungu: "",
    images: [], // URL 배열
    documents: [], // UI 표시용
    documentUrls: [], // 새로 업로드된 문서 URL들
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState<string[]>([]); // 기존 문서 URL들

  // 기존 데이터 로드
  useEffect(() => {
    const loadTransferData = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/transfers/${id}/edit`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "게시글을 불러올 수 없습니다.");
        }

        const result = await response.json();
        const transferData = result.data;

        // 가격 분리 로직 (병원양도 여부에 따라)
        const isSale = transferData.category === "병원양도" ? true : true; // 기본값
        let salePrice = "";
        let rentPrice = "";

        if (transferData.price) {
          if (transferData.category === "병원양도") {
            // TODO: 실제로는 매매/임대 정보를 별도로 저장해야 함
            salePrice = transferData.price.toLocaleString();
          } else {
            salePrice = transferData.price.toLocaleString();
          }
        }

        // 주소 데이터 처리 - base_address와 detail_address 필드에서 직접 가져오기
        const baseAddress =
          transferData.baseAddress || transferData.base_address || "";
        const detailAddress =
          transferData.detailAddress || transferData.detail_address || "";

        setFormData({
          title: transferData.title || "",
          category: transferData.category || "",
          isSale: isSale,
          salePrice: salePrice,
          rentPrice: rentPrice,
          area: transferData.area ? transferData.area.toString() : "",
          description: transferData.description || "",
          address: baseAddress,
          detailAddress: detailAddress,
          sido: transferData.sido || "",
          sigungu: transferData.sigungu || "",
          images: transferData.images || [],
          documents: [], // 새로 업로드할 문서 파일들 (UI 표시용)
          documentUrls: [], // 새로 업로드된 문서 URL들
        });
        setExistingDocuments(transferData.documents || []); // 기존 문서 URL들
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Transfer load error:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        router.push("/transfers");
      }
    };

    loadTransferData();
  }, [id, router, user]);

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

  // 가격 입력 필드 전용 핸들러 (숫자 포맷팅)
  const handlePriceInputChange =
    (field: "salePrice" | "rentPrice") => (value: string) => {
      // 숫자만 추출
      const numericValue = value.replace(/[^\d]/g, "");

      // 숫자를 천 단위 콤마 형식으로 변환
      const formattedValue = numericValue
        ? parseInt(numericValue).toLocaleString()
        : "";

      setFormData((prev) => ({
        ...prev,
        [field]: formattedValue,
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
    }));
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: urls,
    }));
  };

  const handleDocumentUpload = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const handleDocumentUploadComplete = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      documentUrls: [...prev.documentUrls, ...urls],
    }));
  };

  const handleRemoveExistingDocument = (documentUrl: string) => {
    setExistingDocuments((prev) => prev.filter((url) => url !== documentUrl));
  };

  // 주소 검색 후 시도/시군구 추출 함수
  const extractRegionFromAddress = (address: string) => {
    // 주소에서 시도와 시군구 추출
    for (const [sido, districts] of Object.entries(regionOptions)) {
      if (address.includes(sido)) {
        // 해당 시도의 시군구 중에서 주소에 포함된 것 찾기
        const foundDistrict = districts.find((district) =>
          address.includes(district)
        );
        if (foundDistrict) {
          return { sido, sigungu: foundDistrict };
        }
        // 시군구를 찾지 못한 경우 시도만 반환
        return { sido, sigungu: "" };
      }
    }
    return { sido: "", sigungu: "" };
  };

  // 기본주소 변경 시 시도/시군구 자동 추출
  const handleAddressChange = (address: string) => {
    const { sido, sigungu } = extractRegionFromAddress(address);
    setFormData((prev) => ({
      ...prev,
      address,
      sido,
      sigungu,
    }));
    // 에러 제거
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
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

    if (formData.category === "병원양도") {
      if (formData.isSale && !formData.salePrice.trim()) {
        newErrors.salePrice = "매매 가격을 입력해주세요.";
      }
      if (!formData.isSale && !formData.rentPrice.trim()) {
        newErrors.rentPrice = "월세 가격을 입력해주세요.";
      }
    } else {
      if (!formData.salePrice.trim()) {
        newErrors.salePrice = "가격을 입력해주세요.";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "상세 내용을 입력해주세요.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "기본주소를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDraftForm = (): boolean => {
    // 임시저장 시에는 제목만 필수
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목은 필수입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    // 임시저장과 정식 등록에 따라 다른 유효성 검사
    if (isDraft) {
      if (!validateDraftForm()) return;
    } else {
      if (!validateForm()) return;
    }

    setIsLoading(true);
    try {
      // 양도양수 이미지들은 이미 MultiImageUpload에서 업로드됨
      console.log("[DEBUG] 양도양수 이미지 URL들:", formData.images);

      // 문서 파일들은 이미 DocumentUpload에서 업로드됨
      console.log("[DEBUG] 새로 업로드된 문서 URL들:", formData.documentUrls);

      // 기존 문서 URL들과 새로 업로드된 문서 URL들을 합침
      const allDocumentUrls = [...existingDocuments, ...formData.documentUrls];

      console.log("[DEBUG] 기존 문서 URL들:", existingDocuments);
      console.log("[DEBUG] 새 문서 URL들:", formData.documentUrls);
      console.log("[DEBUG] 전체 문서 URL 배열:", allDocumentUrls);

      // API 요청 데이터 구성
      const updateData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: `${formData.address} ${formData.detailAddress}`.trim(), // 호환성을 위해 유지
        baseAddress: formData.address, // 기본주소
        detailAddress: formData.detailAddress, // 상세주소
        sido: formData.sido, // 시도
        sigungu: formData.sigungu, // 시군구
        price:
          parseInt(
            (formData.category === "병원양도"
              ? formData.isSale
                ? formData.salePrice
                : formData.rentPrice
              : formData.salePrice
            ).replace(/[^\d]/g, "") // 콤마 제거 후 숫자만 추출
          ) || 0,
        area:
          formData.category === "병원양도"
            ? parseInt(formData.area) || null
            : null,
        images: formData.images, // 이미지 파일 URL들
        documents: allDocumentUrls, // 기존 문서 + 새 문서 URL들
        status: "ACTIVE", // 상태는 항상 ACTIVE
        isDraft: isDraft, // isDraft 필드로 임시저장 구분
      };

      // API 호출
      const response = await fetch(`/api/transfers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "양도양수 게시글 수정에 실패했습니다."
        );
      }

      // 성공 알림 및 페이지 이동
      if (isDraft) {
        alert("양도양수 게시글이 임시저장되었습니다!");
        router.push("/transfers/drafts"); // 임시저장 목록으로 이동
      } else {
        alert("양도양수 게시글이 성공적으로 수정되었습니다!");
        router.push(`/transfers/${id}`); // 상세 페이지로 이동
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSalePricePlaceholder = () => {
    return formData.category === "병원양도"
      ? "매매 가격을 입력해주세요"
      : "가격을 입력해주세요";
  };

  const getRentPricePlaceholder = () => {
    return "월세 가격을 입력해주세요";
  };

  if (!isDataLoaded) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

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
              양도양수 게시글 수정
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

            {/* 가격 설정 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                가격 설정
              </label>

              {/* 병원양도일 때 매매/임대에 따른 가격 입력 */}
              {formData.category === "병원양도" ? (
                <>
                  {formData.isSale && (
                    <div className="mb-4">
                      <InputBox
                        value={formData.salePrice}
                        onChange={handlePriceInputChange("salePrice")}
                        placeholder={getSalePricePlaceholder()}
                        suffix="원"
                        error={!!errors.salePrice}
                        guide={
                          errors.salePrice
                            ? { text: errors.salePrice, type: "error" }
                            : undefined
                        }
                      />
                    </div>
                  )}
                  {!formData.isSale && (
                    <div className="mb-4">
                      <InputBox
                        value={formData.rentPrice}
                        onChange={handlePriceInputChange("rentPrice")}
                        placeholder={getRentPricePlaceholder()}
                        suffix="원/월"
                        error={!!errors.rentPrice}
                        guide={
                          errors.rentPrice
                            ? { text: errors.rentPrice, type: "error" }
                            : undefined
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4">
                  <InputBox
                    value={formData.salePrice}
                    onChange={handlePriceInputChange("salePrice")}
                    placeholder={getSalePricePlaceholder()}
                    suffix="원"
                    error={!!errors.salePrice}
                    guide={
                      errors.salePrice
                        ? { text: errors.salePrice, type: "error" }
                        : undefined
                    }
                  />
                </div>
              )}
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
                  onAddressChange={handleAddressChange}
                  onDetailAddressChange={handleInputChange("detailAddress")}
                />
              </div>
              {errors.address && (
                <p className="mt-2 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#EFEFF0] rounded-[20px] p-6 lg:p-[60px] mt-[40px]">
            {/* 이미지/파일 첨부 */}
            <div className="mb-8">
              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4">
                이미지/파일 첨부
              </label>

              {/* 기존 문서 파일들 표시 */}
              {existingDocuments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    기존 업로드된 문서
                  </h4>
                  <div className="space-y-2">
                    {existingDocuments.map((documentUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border"
                      >
                        <div className="flex-shrink-0">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <rect
                              x="2"
                              y="1"
                              width="10"
                              height="14"
                              rx="1"
                              fill="#6B7280"
                            />
                            <path
                              d="M5 5h4M5 8h3M5 11h2"
                              stroke="white"
                              strokeWidth="1"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {documentUrl.split("/").pop() ||
                              `문서 ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            기존 업로드 파일
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveExistingDocument(documentUrl)
                          }
                          className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm hover:bg-red-200 transition-colors"
                          aria-label="파일 제거"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-2">
                양도양수 이미지
              </label>

              {/* 양도양수 이미지들 업로드 (첫 번째 이미지가 썸네일로 사용됨) */}
              <MultiImageUpload
                value={formData.images}
                onChange={handleImageUpload}
                maxImages={10}
                folder="transfers"
                className="mt-[40px]"
              />

              <label className="block font-title text-[16px] lg:text-[20px] title-light text-primary mb-4 mt-4">
                첨부 파일
              </label>

              {/* 새 문서 파일들 업로드 */}
              <DocumentUpload
                value={formData.documents}
                onChange={handleDocumentUpload}
                onUploadComplete={handleDocumentUploadComplete}
                maxFiles={3}
              />
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
              수정하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
