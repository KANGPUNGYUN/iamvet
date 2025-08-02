"use client";

import { Footer, Header } from "@/components";
import { FilterBox } from "@/components/ui/FilterBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import AdCard from "@/components/ui/AdCard";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { InputBox } from "@/components/ui/Input/InputBox";
import MobileFilterModal from "@/components/ui/MobileFilterModal";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { allTransferData } from "@/data/transfersData";
import { regionOptions } from "@/data/regionOptions";
import { CloseIcon, ArrowRightIcon, EditIcon } from "public/icons";
import Link from "next/link";

export default function TransfersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 적용된 필터 상태 (실제 필터링에 사용)
  const [appliedFilters, setAppliedFilters] = useState({
    category: [] as string[],
    regions: [] as string[],
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    searchKeyword: "",
    sortBy: "recent",
  });

  // 임시 필터 상태 (사용자가 선택 중인 필터)
  const [tempFilters, setTempFilters] = useState({
    category: [] as string[],
    regions: [] as string[],
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    searchKeyword: "",
    sortBy: "recent",
  });

  // 적용된 필터 태그들
  const [appliedFilterTags, setAppliedFilterTags] = useState<
    Array<{
      id: string;
      label: string;
      type: string;
    }>
  >([]);

  const [currentPage, setCurrentPage] = useState(1);

  // 선택된 시도 상태
  const [selectedSido, setSelectedSido] = useState<string[]>([]);
  // 현재 활성화된 시도 (시군구 표시용)
  const [activeSido, setActiveSido] = useState<string | null>(null);

  // 모바일 필터 모달 상태
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // URL 쿼리 스트링에서 필터 상태 파싱
  const parseFiltersFromURL = () => {
    const category =
      searchParams.get("category")?.split(",").filter(Boolean) || [];
    const regions =
      searchParams.get("regions")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const minArea = searchParams.get("minArea") || "";
    const maxArea = searchParams.get("maxArea") || "";
    const searchKeyword = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "recent";
    const page = parseInt(searchParams.get("page") || "1");

    return {
      category,
      regions,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      searchKeyword,
      sortBy,
      page,
    };
  };

  // 필터 상태를 URL 쿼리 스트링으로 업데이트
  const updateURL = (filters: typeof appliedFilters, page: number = 1) => {
    const params = new URLSearchParams();

    if (filters.category.length > 0)
      params.set("category", filters.category.join(","));
    if (filters.regions.length > 0)
      params.set("regions", filters.regions.join(","));
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minArea) params.set("minArea", filters.minArea);
    if (filters.maxArea) params.set("maxArea", filters.maxArea);
    if (filters.searchKeyword) params.set("search", filters.searchKeyword);
    if (filters.sortBy !== "recent") params.set("sort", filters.sortBy);
    if (page !== 1) params.set("page", page.toString());

    const queryString = params.toString();
    const newURL = queryString ? `/transfers?${queryString}` : "/transfers";

    router.push(newURL, { scroll: false });
  };

  // 필터링 로직 (적용된 필터 사용)
  const getFilteredData = () => {
    let filtered = [...allTransferData];

    // 키워드 검색
    if (appliedFilters.searchKeyword.trim()) {
      const keyword = appliedFilters.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(
        (transfer) =>
          transfer.title.toLowerCase().includes(keyword) ||
          transfer.location.toLowerCase().includes(keyword) ||
          transfer.hospitalType.toLowerCase().includes(keyword)
      );
    }

    // 카테고리 필터
    if (appliedFilters.category.length > 0) {
      filtered = filtered.filter((transfer) =>
        appliedFilters.category.includes(transfer.category)
      );
    }

    // 지역 필터
    if (appliedFilters.regions.length > 0) {
      filtered = filtered.filter((transfer) => {
        return appliedFilters.regions.some((region) => {
          // 전체 시/도 선택 시 해당 시/도의 모든 시군구 포함
          if (Object.keys(regionOptions).includes(region)) {
            return transfer.sido === region;
          }
          // 시군구 필터링 시 "시/도|시군구" 형태로 저장된 경우 분리해서 비교
          if (region.includes("|")) {
            const [filterSido, filterSigungu] = region.split("|");
            return (
              transfer.sido === filterSido && transfer.sigungu === filterSigungu
            );
          }

          // 기존 시군구 필터링 (하위 호환성)
          const regionSido = Object.keys(regionOptions).find((sido) =>
            regionOptions[sido as keyof typeof regionOptions].includes(region)
          );
          return transfer.sido === regionSido && transfer.sigungu === region;
        });
      });
    }

    // 가격 필터
    if (appliedFilters.minPrice || appliedFilters.maxPrice) {
      filtered = filtered.filter((transfer) => {
        const price = transfer.priceValue;
        const min = appliedFilters.minPrice
          ? parseInt(appliedFilters.minPrice) * 10000
          : 0;
        const max = appliedFilters.maxPrice
          ? parseInt(appliedFilters.maxPrice) * 10000
          : Number.MAX_SAFE_INTEGER;
        return price >= min && price <= max;
      });
    }

    // 평수 필터
    if (appliedFilters.minArea || appliedFilters.maxArea) {
      filtered = filtered.filter((transfer) => {
        if (transfer.area === 0) return true; // 장비나 인테리어는 평수가 0
        const min = appliedFilters.minArea
          ? parseInt(appliedFilters.minArea)
          : 0;
        const max = appliedFilters.maxArea
          ? parseInt(appliedFilters.maxArea)
          : Number.MAX_SAFE_INTEGER;
        return transfer.area >= min && transfer.area <= max;
      });
    }

    // 정렬
    switch (appliedFilters.sortBy) {
      case "recent":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "priceLow":
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalTransfers = filteredData.length;

  // 1페이지: 광고 1개 + 게시글 8개 = 총 9개 표시
  // 2페이지부터: 게시글 9개씩 표시
  const itemsPerPage = currentPage === 1 ? 8 : 9;
  const adjustedTotal = currentPage === 1 ? totalTransfers : totalTransfers - 8;
  const totalPages =
    currentPage === 1
      ? Math.ceil((totalTransfers - 8) / 9) + 1
      : Math.ceil(adjustedTotal / 9) + 1;

  // 페이지네이션
  const startIndex = currentPage === 1 ? 0 : 8 + (currentPage - 2) * 9;
  let transferData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // 광고는 1페이지(index 0)에서만 표시
  const shouldShowAd = currentPage === 1 && transferData.length > 0;

  // 항상 9개 슬롯을 채우기 위한 빈 카드 생성
  const totalSlots = 9;
  const currentContentCount = (shouldShowAd ? 1 : 0) + transferData.length;
  const emptySlots = Math.max(0, totalSlots - currentContentCount);

  // URL에서 필터 상태 초기화
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    const { page, ...filterData } = urlFilters;

    setAppliedFilters(filterData);
    setTempFilters(filterData);
    setCurrentPage(page);
  }, [searchParams]);

  // 임시 필터 변경 핸들러
  const handleTempFilterChange = (
    type: keyof typeof tempFilters,
    value: any
  ) => {
    setTempFilters((prev) => ({ ...prev, [type]: value }));
  };

  // 필터 적용 처리 (버튼 클릭시만)
  const handleFilterApply = () => {
    setAppliedFilters(tempFilters);
    setCurrentPage(1);
    updateURL(tempFilters, 1);
  };

  // 전체 초기화
  const handleFilterReset = () => {
    const resetFilters = {
      category: [],
      regions: [],
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      searchKeyword: "",
      sortBy: "recent",
    };
    setTempFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setSelectedSido([]);
    setActiveSido(null);
    setAppliedFilterTags([]);
    setCurrentPage(1);
    updateURL(resetFilters, 1);
  };

  // 필터 태그 생성
  const generateFilterTags = (filterData: typeof appliedFilters) => {
    const tags: Array<{ id: string; label: string; type: string }> = [];

    // 카테고리 태그
    filterData.category.forEach((cat) => {
      const label =
        cat === "hospital"
          ? "병원 양도"
          : cat === "machine"
          ? "기계 장치"
          : cat === "device"
          ? "의료 장비"
          : "인테리어";
      tags.push({ id: `category-${cat}`, label, type: "category" });
    });

    // 지역 태그
    filterData.regions.forEach((region) => {
      let label;
      if (Object.keys(regionOptions).includes(region)) {
        // 시/도 전체 선택인 경우
        label = `${region} 전체`;
      } else if (region.includes("|")) {
        // 시/도|시군구 형태인 경우
        const [sido, sigungu] = region.split("|");
        label = `${sido} ${sigungu}`;
      } else {
        // 기존 형태
        label = region;
      }
      tags.push({ id: `region-${region}`, label, type: "region" });
    });

    // 가격 태그
    if (filterData.minPrice || filterData.maxPrice) {
      const minLabel = filterData.minPrice
        ? `${filterData.minPrice}만원`
        : "0만원";
      const maxLabel = filterData.maxPrice
        ? `${filterData.maxPrice}만원`
        : "무제한";
      tags.push({
        id: "price",
        label: `${minLabel} ~ ${maxLabel}`,
        type: "price",
      });
    }

    // 평수 태그
    if (filterData.minArea || filterData.maxArea) {
      const minLabel = filterData.minArea ? `${filterData.minArea}평` : "0평";
      const maxLabel = filterData.maxArea
        ? `${filterData.maxArea}평`
        : "무제한";
      tags.push({
        id: "area",
        label: `${minLabel} ~ ${maxLabel}`,
        type: "area",
      });
    }

    setAppliedFilterTags(tags);
  };

  // 임시 필터 변경 시 자동으로 태그 생성 (선택하자마자 표시)
  useEffect(() => {
    generateFilterTags(tempFilters);
  }, [
    tempFilters.category,
    tempFilters.regions,
    tempFilters.minPrice,
    tempFilters.maxPrice,
    tempFilters.minArea,
    tempFilters.maxArea,
  ]);

  // 개별 필터 태그 삭제 (임시 필터에서 제거)
  const handleRemoveFilterTag = (tagId: string) => {
    const tag = appliedFilterTags.find((t) => t.id === tagId);
    if (!tag) return;

    let newFilters = { ...tempFilters };

    if (tag.type === "category") {
      const categoryValue = tagId.replace("category-", "");
      newFilters.category = newFilters.category.filter(
        (c) => c !== categoryValue
      );
    } else if (tag.type === "region") {
      const regionValue = tagId.replace("region-", "");
      // 시/도 전체 선택 해제 시 해당 시군구도 모두 제거
      if (Object.keys(regionOptions).includes(regionValue)) {
        const districtsToRemove =
          regionOptions[regionValue as keyof typeof regionOptions];
        newFilters.regions = newFilters.regions.filter(
          (r) =>
            r !== regionValue &&
            !districtsToRemove.includes(r) &&
            !r.startsWith(`${regionValue}|`)
        );
        // selectedSido에서도 제거
        setSelectedSido((prev) => prev.filter((s) => s !== regionValue));
      } else {
        newFilters.regions = newFilters.regions.filter(
          (r) => r !== regionValue
        );
      }
    } else if (tag.type === "price") {
      newFilters.minPrice = "";
      newFilters.maxPrice = "";
    } else if (tag.type === "area") {
      newFilters.minArea = "";
      newFilters.maxArea = "";
    }

    setTempFilters(newFilters);
  };

  // 검색어 변경 (즉시 적용)
  const handleSearchChange = (searchKeyword: string) => {
    const newFilters = { ...appliedFilters, searchKeyword };
    setAppliedFilters(newFilters);
    setTempFilters(newFilters);
    updateURL(newFilters, 1);
    setCurrentPage(1);
  };

  // 정렬 변경 (즉시 적용)
  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...appliedFilters, sortBy };
    setAppliedFilters(newFilters);
    setTempFilters(newFilters);
    updateURL(newFilters, currentPage);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(appliedFilters, page);
  };

  return (
    <>
      <Header isLoggedIn={false} />

      <main className="bg-white">
        <div className="max-w-[1320px] mx-auto px-4 xl:px-[60px] py-[30px]">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-[30px] gap-4">
            <div className="flex justify-between items-center">
              <h1 className="font-title text-[24px] xl:text-[28px] title-medium text-[#3B394D]">
                양도/양수 게시판
              </h1>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="xl:hidden flex w-[62px] items-center gap-[10px]"
                style={{
                  borderRadius: "999px 0px 0px 999px",
                  background: "var(--Box_Light, #FBFBFB)",
                  boxShadow: "0px 0px 12px 0px rgba(53, 53, 53, 0.12)",
                  padding: "8px 10px 8px 8px",
                  marginRight: "-16px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20.5 11.9995H9.14676M9.14676 11.9995C9.14676 12.5588 8.93478 13.0951 8.5591 13.4906C8.18342 13.886 7.67389 14.1082 7.14259 14.1082C6.6113 14.1082 6.10177 13.886 5.72609 13.4906C5.35041 13.0951 5.13935 12.5588 5.13935 11.9995M9.14676 11.9995C9.14676 11.4403 8.93478 10.9039 8.5591 10.5085C8.18342 10.113 7.67389 9.89084 7.14259 9.89084C6.6113 9.89084 6.10177 10.113 5.72609 10.5085C5.35041 10.9039 5.13935 11.4403 5.13935 11.9995M5.13935 11.9995H3.5M20.5 18.3904H15.2181M15.2181 18.3904C15.2181 18.9497 15.0065 19.4867 14.6307 19.8822C14.255 20.2778 13.7453 20.5 13.2139 20.5C12.6826 20.5 12.1731 20.2769 11.7974 19.8814C11.4217 19.486 11.2106 18.9496 11.2106 18.3904M15.2181 18.3904C15.2181 17.831 15.0065 17.295 14.6307 16.8994C14.255 16.5039 13.7453 16.2817 13.2139 16.2817C12.6826 16.2817 12.1731 16.5038 11.7974 16.8993C11.4217 17.2947 11.2106 17.8311 11.2106 18.3904M11.2106 18.3904H3.5M20.5 5.60868H17.6468M17.6468 5.60868C17.6468 5.88559 17.594 6.1598 17.4934 6.41563C17.3927 6.67147 17.2451 6.90393 17.0591 7.09974C16.8731 7.29555 16.6522 7.45087 16.4092 7.55684C16.1662 7.66281 15.9057 7.71735 15.6426 7.71735C15.1113 7.71735 14.6018 7.49519 14.2261 7.09974C13.8504 6.70428 13.6394 6.16793 13.6394 5.60868M17.6468 5.60868C17.6468 5.33176 17.594 5.05756 17.4934 4.80172C17.3927 4.54588 17.2451 4.31343 17.0591 4.11762C16.8731 3.92181 16.6522 3.76648 16.4092 3.66051C16.1662 3.55454 15.9057 3.5 15.6426 3.5C15.1113 3.5 14.6018 3.72216 14.2261 4.11762C13.8504 4.51307 13.6394 5.04942 13.6394 5.60868M13.6394 5.60868H3.5"
                    stroke="#4F5866"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <SearchBar
              value={appliedFilters.searchKeyword}
              onChange={handleSearchChange}
              placeholder="병원명 검색하기"
            />
          </div>

          {/* 필터링 영역 - Desktop Only (Show when width >= 1290px) */}
          <div className="hidden xl:block border border-[#EFEFF0] rounded-[8px] mb-[30px] bg-box-light py-[10px]">
            {/* 지역 구분 텍스트와 전체 초기화 버튼 */}
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "42px",
                padding: "10px 16px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 className="font-title text-[16px] title-light text-sub">
                지역 구분
              </h3>
              <button
                onClick={handleFilterReset}
                className="font-text text-[16px] text-medium text-[#9098A4] hover:text-[#3B394D] transition-colors underline"
              >
                전체 초기화
              </button>
            </div>

            {/* 시/도 선택부분과 시군구 선택 부분 */}
            <div
              style={{
                display: "flex",
                height: "146px",
                alignItems: "flex-start",
                flex: "1 0 0",
              }}
            >
              {/* 시/도 선택 */}
              <div
                style={{
                  width: "fit-contents",
                  height: "146px",
                  padding: "10px",
                  overflowY: "auto",
                  outline: "1px solid #EFEFF0",
                  backgroundColor: "white",
                }}
              >
                <div className="grid grid grid-cols-2">
                  {Object.keys(regionOptions).map((sido) => (
                    <button
                      key={sido}
                      className={`flex w-[164px] items-center justify-between p-2 rounded cursor-pointer transition-colors rounded-[8px] ${
                        activeSido === sido || selectedSido.includes(sido)
                          ? "bg-key5 text-key1"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setActiveSido(activeSido === sido ? null : sido);
                      }}
                    >
                      <div className="flex items-center gap-[10px]">
                        <span className="font-text text-bold text-[16px]">
                          {sido}
                        </span>
                        <span
                          className={`font-text text-[14px] ${
                            activeSido === sido || selectedSido.includes(sido)
                              ? "text-key2"
                              : "text-subtext2"
                          }`}
                        >
                          (
                          {
                            regionOptions[sido as keyof typeof regionOptions]
                              .length
                          }
                          )
                        </span>
                      </div>
                      {(activeSido === sido || selectedSido.includes(sido)) && (
                        <ArrowRightIcon
                          size="20"
                          currentColor={"currentColor"}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 시군구 선택 부분 - 항상 표시 */}
              <div
                style={{
                  display: "flex",
                  height: "146px",
                  padding: "16px",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  gap: "12px",
                  flex: "1 0 0",
                  flexWrap: "wrap",
                  overflowY: "auto",
                  outline: "1px solid #EFEFF0",
                  backgroundColor: "white",
                }}
              >
                {activeSido ? (
                  <>
                    <div className="w-full mb-2">
                      <h5 className="font-text text-[14px] text-semibold text-[#3B394D] border-b border-[#EFEFF0] pb-2">
                        {activeSido} 지역
                      </h5>
                    </div>

                    {/* 전체 선택 체크박스 */}
                    <Checkbox
                      value={activeSido}
                      checked={selectedSido.includes(activeSido)}
                      onChange={(checked) => {
                        const newSelectedSido = checked
                          ? [...selectedSido, activeSido]
                          : selectedSido.filter((s) => s !== activeSido);
                        setSelectedSido(newSelectedSido);

                        if (checked) {
                          // 전체 선택 시 activeSido를 regions에 추가
                          const newRegions = tempFilters.regions.includes(
                            activeSido
                          )
                            ? tempFilters.regions
                            : [...tempFilters.regions, activeSido];
                          handleTempFilterChange("regions", newRegions);
                        } else {
                          // 전체 선택 해제 시 activeSido와 모든 시군구 제거
                          const districtsToRemove =
                            regionOptions[
                              activeSido as keyof typeof regionOptions
                            ];
                          const newRegions = tempFilters.regions.filter(
                            (region: string) =>
                              region !== activeSido &&
                              !districtsToRemove.includes(region)
                          );
                          handleTempFilterChange("regions", newRegions);
                        }
                      }}
                    >
                      <span className="font-text text-[16px]">
                        {activeSido}전체
                      </span>
                    </Checkbox>

                    {regionOptions[
                      activeSido as keyof typeof regionOptions
                    ].map((district) => (
                      <Checkbox
                        key={district}
                        value={district}
                        checked={tempFilters.regions.includes(
                          `${activeSido}|${district}`
                        )}
                        onChange={(checked) => {
                          const regionKey = `${activeSido}|${district}`;
                          const newRegions = checked
                            ? [...tempFilters.regions, regionKey]
                            : tempFilters.regions.filter(
                                (r: string) => r !== regionKey
                              );
                          handleTempFilterChange("regions", newRegions);
                        }}
                      >
                        <span className="font-text text-[16px]">
                          {district}
                        </span>
                      </Checkbox>
                    ))}
                  </>
                ) : (
                  /* 지역 선택 안내 */
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-text text-[16px] text-medium text-[#9098A4] mb-2">
                        먼저 지역을 선택해주세요
                      </p>
                      <p className="font-text text-[14px] text-light text-[#CACAD2]">
                        왼쪽에서 시/도를 선택하시면
                        <br />
                        해당 지역의 시군구를 선택할 수 있습니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 카테고리와 금액/평수 부분 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                alignSelf: "stretch",
              }}
            >
              {/* 카테고리 제목과 각각의 카테고리 필터버튼을 wrap한 부분 */}
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "10px",
                  flex: "1 0 0",
                }}
              >
                <h4 className="font-title text-[16px] title-light text-sub">
                  카테고리
                </h4>
                <FilterBox.Group
                  value={tempFilters.category}
                  onChange={(value) =>
                    handleTempFilterChange("category", value)
                  }
                >
                  <FilterBox value="hospital">병원양도</FilterBox>
                  <FilterBox value="machine">기계장치</FilterBox>
                  <FilterBox value="device">의료장비</FilterBox>
                  <FilterBox value="interior">인테리어</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 금액과 평수 부분을 wrap한 부분 */}
              <div
                style={{
                  display: "flex",
                  padding: "10px 0px",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {/* 금액 내부 wrap */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <h4 className="font-title text-[16px] title-light text-sub">
                    금액
                  </h4>
                  <div className="flex items-center gap-[8px]">
                    <InputBox
                      value={tempFilters.minPrice}
                      onChange={(value) =>
                        handleTempFilterChange("minPrice", value)
                      }
                      placeholder="0"
                      suffix="만원"
                      type="number"
                      variant="compact"
                    />
                    <span className="text-[#9098A4]">-</span>
                    <InputBox
                      value={tempFilters.maxPrice}
                      onChange={(value) =>
                        handleTempFilterChange("maxPrice", value)
                      }
                      placeholder="0"
                      suffix="만원"
                      type="number"
                      variant="compact"
                    />
                  </div>
                </div>

                {/* 평수 내부 wrap */}
                <div
                  style={{
                    display: "flex",
                    padding: "0px 16px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <h4 className="font-title text-[16px] title-light text-sub">
                    평수
                  </h4>
                  <div className="flex items-center gap-[8px]">
                    <InputBox
                      value={tempFilters.minArea}
                      onChange={(value) =>
                        handleTempFilterChange("minArea", value)
                      }
                      placeholder="0"
                      suffix="평"
                      type="number"
                      variant="compact"
                    />
                    <span className="text-[#9098A4]">-</span>
                    <InputBox
                      value={tempFilters.maxArea}
                      onChange={(value) =>
                        handleTempFilterChange("maxArea", value)
                      }
                      placeholder="0"
                      suffix="평"
                      type="number"
                      variant="compact"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 선택된 필터 조건 버튼들과 적용하기 버튼을 wrap한 부분 */}
            <div
              style={{
                display: "flex",
                padding: "0px 16px",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <div className="flex flex-wrap gap-[8px]">
                {appliedFilterTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-[10px] px-[12px] py-[6px] bg-transparent text-subtext2"
                  >
                    <span className="font-text text-[16px] text-subtext2">
                      {tag.label}
                    </span>
                    <button
                      onClick={() => handleRemoveFilterTag(tag.id)}
                      className="flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-full"
                    >
                      <CloseIcon currentColor="#9098A4" size="10" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                variant="keycolor"
                size="medium"
                onClick={handleFilterApply}
              >
                적용하기
              </Button>
            </div>
          </div>

          {/* Mobile Filter Tags - Show when width < 1290px */}
          <div className="xl:hidden mb-4">
            {appliedFilterTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {appliedFilterTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-1 bg-[#FFF5F5] border border-[#FF6B6B] rounded-full"
                  >
                    <span className="font-text text-[12px] text-[#FF6B6B]">
                      {tag.label}
                    </span>
                    <button
                      onClick={() => handleRemoveFilterTag(tag.id)}
                      className="flex items-center justify-center"
                    >
                      <CloseIcon currentColor="#FF6B6B" size="10" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 검색바와 결과 정보 */}
          <div className="flex justify-between items-center mb-[30px]">
            <div className="flex items-center gap-[20px]">
              <p className="font-text text-[16px] text-medium text-[#9098A4]">
                총 {totalTransfers}건
              </p>
            </div>
            <SelectBox
              value={appliedFilters.sortBy}
              onChange={handleSortChange}
              placeholder="최신순"
              options={[
                { value: "recent", label: "최신순" },
                { value: "popular", label: "인기순" },
                { value: "priceHigh", label: "높은가격순" },
                { value: "priceLow", label: "낮은가격순" },
              ]}
            />
          </div>

          {/* 양도 게시글 목록 */}
          <div className="flex flex-col gap-[20px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {/* 9로 나눈 나머지가 1인 위치에 광고 표시 */}
              {shouldShowAd && (
                <AdCard
                  title="가산점"
                  subtitle="어떤 과목 선택도 부담없이!\n강의 들어 가산점으로 환산받자!"
                  variant="default"
                  onClick={() => console.log("광고 클릭")}
                />
              )}

              {transferData.map((transfer) => (
                <TransferCard
                  key={transfer.id}
                  title={transfer.title}
                  location={transfer.location}
                  hospitalType={transfer.hospitalType}
                  area={transfer.area}
                  price={transfer.price}
                  date={transfer.date}
                  views={transfer.views}
                  imageUrl={transfer.imageUrl}
                  categories={transfer.categories}
                  isAd={false}
                  isLiked={transfer.isLiked}
                  onLike={() => console.log("좋아요 클릭")}
                  onClick={() => console.log("카드 클릭")}
                />
              ))}

              {/* 빈 슬롯으로 높이 고정 (모바일 제외) */}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <div
                  key={`empty-slot-${index}`}
                  className="invisible hidden sm:block"
                >
                  <TransferCard
                    title="Placeholder"
                    location="Placeholder"
                    hospitalType="Placeholder"
                    area={0}
                    price="0"
                    date="2025-01-01"
                    views={0}
                    imageUrl=""
                    categories={[]}
                    isAd={false}
                    isLiked={false}
                    onLike={() => {}}
                    onClick={() => {}}
                  />
                </div>
              ))}
            </div>
            <Link
              href={"/transfers/create"}
              className="w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[18px] self-end mb-[20px]"
            >
              <EditIcon /> 글쓰기
            </Link>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center py-[50px]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
    </>
  );
}
