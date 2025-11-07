"use client";

import { FilterBox } from "@/components/ui/FilterBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import { TransferCardSkeleton } from "@/components/ui/TransferCard/TransferCardSkeleton";
import AdCard from "@/components/ui/AdCard";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { InputBox } from "@/components/ui/Input/InputBox";
import MobileFilterModal from "@/components/ui/MobileFilterModal";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React from "react";
import { regionOptions } from "@/data/regionOptions";
import { CloseIcon, ArrowRightIcon, EditIcon } from "public/icons";
import Link from "next/link";
import { useLikeStore } from "@/stores/likeStore";
import { handleNumberInputChange } from "@/utils/validation";
import { useCardAds } from "@/hooks/api/useAdvertisements";

export default function TransfersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand 스토어에서 좋아요 상태 관리
  const {
    setTransferLike,
    toggleTransferLike,
    initializeTransferLikes,
    isTransferLiked,
  } = useLikeStore();

  // API에서 가져온 양도양수 데이터
  const [transfersData, setTransfersData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // AD_CARD 광고 데이터 조회
  const { data: cardAdsData, isLoading: isLoadingAd } = useCardAds();

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

  // API에서 양도양수 데이터 가져오기 (임시저장 제외)
  useEffect(() => {
    const fetchTransfers = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch("/api/transfers");
        console.log("API Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("API Response data:", data);

          if (data.data?.transfers) {
            console.log("Raw transfers:", data.data.transfers);

            // 임시저장이 아닌 게시글만 필터링 (필수 필드가 모두 있는 것만)
            const activeTransfers = data.data.transfers.filter(
              (transfer: any) => {
                const hasRequiredFields =
                  transfer.title &&
                  transfer.description &&
                  transfer.location &&
                  transfer.price !== null &&
                  transfer.category;

                console.log("Transfer filtering:", {
                  id: transfer.id,
                  title: transfer.title,
                  hasRequiredFields,
                  fields: {
                    title: !!transfer.title,
                    description: !!transfer.description,
                    location: !!transfer.location,
                    price: transfer.price,
                    category: !!transfer.category,
                  },
                });

                return hasRequiredFields;
              }
            );

            console.log("Active transfers after filtering:", activeTransfers);
            setTransfersData(activeTransfers);
          }
        }
      } catch (error) {
        console.error("양도양수 목록 조회 오류:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTransfers();
  }, []);

  // 카드 광고 데이터 변환
  const adData = React.useMemo(() => {
    if (!cardAdsData?.data || cardAdsData.data.length === 0) {
      return null;
    }

    const ad = cardAdsData.data[0]; // 첫 번째 활성 광고 사용
    return {
      id: ad.id,
      title: ad.title,
      description: ad.description || ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      variant: (ad.variant as "default" | "blue") || "default",
    };
  }, [cardAdsData]);

  // Transfer 좋아요 상태 동기화
  useEffect(() => {
    if (transfersData.length > 0) {
      const likedTransferIds = transfersData
        .filter((transfer: any) => transfer.isLiked)
        .map((transfer: any) => transfer.id);

      console.log(
        "[Transfer Like] 서버에서 받은 좋아요 양도양수:",
        likedTransferIds
      );
      initializeTransferLikes(likedTransferIds);
    }
  }, [transfersData, initializeTransferLikes]);

  // 양도양수 좋아요/취소 토글 핸들러
  const handleTransferLike = async (transferId: string | number) => {
    const id = transferId.toString();
    const isCurrentlyLiked = isTransferLiked(id);

    console.log(
      `[Transfer Like] ${id} - 현재 상태: ${
        isCurrentlyLiked ? "좋아요됨" : "좋아요안됨"
      } -> ${isCurrentlyLiked ? "좋아요 취소" : "좋아요"}`
    );

    // 낙관적 업데이트: UI를 먼저 변경
    toggleTransferLike(id);

    try {
      const method = isCurrentlyLiked ? "DELETE" : "POST";
      const actionText = isCurrentlyLiked ? "좋아요 취소" : "좋아요";

      console.log(
        `[Transfer Like] API 요청: ${method} /api/transfers/${transferId}/like`
      );

      const response = await fetch(`/api/transfers/${transferId}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`[Transfer Like] ${actionText} 실패:`, result);

        // 오류 발생 시 상태 롤백
        setTransferLike(id, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn("양도양수를 찾을 수 없습니다:", transferId);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes("이미 좋아요한")) {
            console.log(
              `[Transfer Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`
            );
            setTransferLike(id, true);
            return;
          }
          console.warn(`${actionText} 실패:`, result.message);
          return;
        } else if (response.status === 401) {
          console.warn("로그인이 필요합니다.");
          return;
        }
        throw new Error(result.message || `${actionText} 요청에 실패했습니다.`);
      }

      console.log(`[Transfer Like] ${actionText} 성공:`, result);
    } catch (error) {
      console.error(
        `[Transfer Like] ${isCurrentlyLiked ? "좋아요 취소" : "좋아요"} 오류:`,
        error
      );

      // 오류 발생 시 상태 롤백
      setTransferLike(id, isCurrentlyLiked);
    }
  };

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
    let filtered = [...transfersData];

    // 키워드 검색
    if (appliedFilters.searchKeyword.trim()) {
      const keyword = appliedFilters.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(
        (transfer) =>
          transfer.title.toLowerCase().includes(keyword) ||
          transfer.location.toLowerCase().includes(keyword) ||
          transfer.category.toLowerCase().includes(keyword)
      );
    }

    // 카테고리 필터
    if (appliedFilters.category.length > 0) {
      filtered = filtered.filter((transfer) => {
        // 카테고리 매핑
        const categoryMap: Record<string, string> = {
          hospital: "병원양도",
          machine: "기계장치",
          device: "의료장비",
          interior: "인테리어",
        };

        return appliedFilters.category.some(
          (filterCat) => categoryMap[filterCat] === transfer.category
        );
      });
    }

    // 지역 필터
    if (appliedFilters.regions.length > 0) {
      filtered = filtered.filter((transfer) => {
        return appliedFilters.regions.some((region) => {
          // transfer.location에서 지역 정보 추출
          const location = transfer.location || "";

          // 전체 시/도 선택 시
          if (Object.keys(regionOptions).includes(region)) {
            return location.includes(region);
          }

          // 시군구 필터링
          if (region.includes("|")) {
            const [filterSido, filterSigungu] = region.split("|");
            return (
              location.includes(filterSido) && location.includes(filterSigungu)
            );
          }

          return location.includes(region);
        });
      });
    }

    // 가격 필터
    if (appliedFilters.minPrice || appliedFilters.maxPrice) {
      filtered = filtered.filter((transfer) => {
        const price = transfer.price || 0;
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
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "priceHigh":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "priceLow":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
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
                      className="w-[100px]"
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
                        className="w-[100px]"
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
                        handleNumberInputChange(value, (formattedValue) =>
                          handleTempFilterChange("minPrice", formattedValue)
                        )
                      }
                      placeholder="0"
                      suffix="만원"
                      variant="compact"
                    />
                    <span className="text-[#9098A4]">-</span>
                    <InputBox
                      value={tempFilters.maxPrice}
                      onChange={(value) =>
                        handleNumberInputChange(value, (formattedValue) =>
                          handleTempFilterChange("maxPrice", formattedValue)
                        )
                      }
                      placeholder="0"
                      suffix="만원"
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
                        handleNumberInputChange(value, (formattedValue) =>
                          handleTempFilterChange("minArea", formattedValue)
                        )
                      }
                      placeholder="0"
                      suffix="평"
                      variant="compact"
                    />
                    <span className="text-[#9098A4]">-</span>
                    <InputBox
                      value={tempFilters.maxArea}
                      onChange={(value) =>
                        handleNumberInputChange(value, (formattedValue) =>
                          handleTempFilterChange("maxArea", formattedValue)
                        )
                      }
                      placeholder="0"
                      suffix="평"
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
            {isLoadingData ? (
              // 스켈레톤 로딩
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {Array.from({ length: 9 }).map((_, index) => (
                  <TransferCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : transferData.length === 0 ? (
              // 데이터가 없는 경우
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <div className="text-lg font-medium mb-2">
                  등록된 양도양수가 없습니다
                </div>
                <div className="text-sm">첫 번째 양도양수를 등록해보세요!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {/* 9로 나눈 나머지가 1인 위치에 광고 표시 */}
                {shouldShowAd &&
                  (adData ? (
                    <AdCard
                      title={adData.title}
                      subtitle={adData.description}
                      variant={adData.variant}
                      onClick={() => {
                        if (adData.linkUrl) {
                          window.open(adData.linkUrl, "_blank");
                        }
                      }}
                    />
                  ) : !isLoadingAd ? (
                    // 광고가 없는 경우 표시할 기본 카드
                    <div className="w-full bg-white shadow-sm rounded-[16px] border border-[#EFEFF0] p-6 flex flex-col justify-center items-center min-h-[192px]">
                      <div className="text-center">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="mx-auto mb-4 text-gray-300"
                        >
                          <path
                            d="M13 7H22V20H13V7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 7H11V12H2V7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 17H11V20H2V17Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-500 font-medium">
                          광고를 원하시나요?
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          관리자에게 문의하세요
                        </p>
                      </div>
                    </div>
                  ) : null)}

                {transferData.map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    id={transfer.id}
                    title={transfer.title}
                    location={`${transfer.sido} ${transfer.sigungu}`}
                    hospitalType={transfer.category}
                    area={
                      transfer.category === "병원양도" ? transfer.area || 0 : 0
                    }
                    price={`${(transfer.price / 10000).toFixed(0)}만원`}
                    date={new Date(transfer.createdAt)
                      .toLocaleDateString("ko-KR")
                      .replace(/\.$/, "")}
                    views={transfer.views || 0}
                    imageUrl={transfer.images?.[0] || ""}
                    categories={transfer.category}
                    isAd={false}
                    isLiked={isTransferLiked(transfer.id)}
                    onLike={() => handleTransferLike(transfer.id)}
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2 self-end mb-[20px]">
              <Link
                href={"/transfers/drafts"}
                className="w-[140px] p-[10px] border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-[6px] font-text text-semibold text-[18px] flex items-center justify-center"
              >
                임시저장 목록
              </Link>
              <Link
                href={"/transfers/create"}
                className="w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[18px]"
              >
                <EditIcon size="20" /> 글쓰기
              </Link>
            </div>
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
