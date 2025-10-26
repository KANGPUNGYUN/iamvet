"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, EditIcon } from "public/icons";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { FilterBoxGroup } from "@/components/ui/FilterBox/FilterBoxGroup";
import { FilterBoxItem } from "@/components/ui/FilterBox/FilterBoxItem";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import { useLikeStore } from "@/stores/likeStore";

interface TransferData {
  id: string;
  title: string;
  location: string;
  sido: string;
  sigungu: string;
  hospitalType: string;
  area: number;
  price: string;
  date: string;
  views: number;
  images?: string[];
  categories: string;
  isAd?: boolean;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

const transferCategories = ["병원양도", "기계장치", "의료장비", "인테리어"];

export default function HospitalTransferBookmarksPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const itemsPerPage = 9;

  // Zustand 스토어에서 좋아요 상태 관리
  const {
    setTransferLike,
    toggleTransferLike,
    initializeTransferLikes,
    isTransferLiked,
  } = useLikeStore();

  // API에서 북마크한 양도양수 정보 가져오기
  const fetchBookmarkedTransfers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("bookmarked", "true"); // 북마크된 항목만 조회

      if (searchQuery.trim()) {
        params.set("keyword", searchQuery.trim());
      }
      if (selectedCategories.length > 0) {
        params.set("category", selectedCategories.join(","));
      }

      params.set("page", currentPage.toString());
      params.set("limit", itemsPerPage.toString());

      const response = await fetch(`/api/transfers?${params.toString()}`);

      if (!response.ok) {
        throw new Error("북마크한 양도양수 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();

      if (result.status === "success") {
        const transfersData = result.data.transfers || [];
        setTransfers(transfersData);
        setTotalPages(result.data.totalPages || 0);
        setTotalTransfers(result.data.total || 0);

        // 초기 좋아요 상태 동기화
        const likedTransferIds = transfersData
          .filter((transfer: any) => transfer.isLiked)
          .map((transfer: any) => transfer.id);

        if (likedTransferIds.length > 0) {
          console.log(
            "[TransferBookmarks] 서버에서 받은 좋아요 양도양수:",
            likedTransferIds
          );
          initializeTransferLikes(likedTransferIds);
        }
      } else {
        throw new Error(
          result.message || "북마크한 양도양수 목록을 불러오는데 실패했습니다."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("북마크 양도양수 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 필터나 페이지가 변경될 때마다 API 호출
  useEffect(() => {
    fetchBookmarkedTransfers();
  }, [searchQuery, selectedCategories, currentPage]);

  // 양도양수 데이터 변환 함수
  const transformTransferData = (transfer: TransferData) => {
    return {
      ...transfer,
      isLiked: isTransferLiked(transfer.id), // Zustand 스토어에서 좋아요 상태 가져오기
    };
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1); // 필터 시 첫 페이지로 리셋
  };

  // 양도양수 좋아요/취소 핸들러
  const handleLike = async (transferId: string) => {
    const isCurrentlyLiked = isTransferLiked(transferId);

    console.log(
      `[TransferBookmarks Like] ${transferId} - 현재 상태: ${
        isCurrentlyLiked ? "좋아요됨" : "좋아요안됨"
      } -> ${isCurrentlyLiked ? "좋아요 취소" : "좋아요"}`
    );

    // 낙관적 업데이트: UI를 먼저 변경
    toggleTransferLike(transferId);

    try {
      const method = isCurrentlyLiked ? "DELETE" : "POST";
      const actionText = isCurrentlyLiked ? "좋아요 취소" : "좋아요";

      console.log(
        `[TransferBookmarks Like] API 요청: ${method} /api/transfers/${transferId}/like`
      );

      const response = await fetch(`/api/transfers/${transferId}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`[TransferBookmarks Like] ${actionText} 실패:`, result);

        // 오류 발생 시 상태 롤백
        setTransferLike(transferId, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn("양도양수 정보를 찾을 수 없습니다:", transferId);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes("이미 좋아요한")) {
            console.log(
              `[TransferBookmarks Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`
            );
            setTransferLike(transferId, true);
            return;
          }
          console.warn(`${actionText} 실패:`, result.message);
          return;
        } else if (response.status === 401) {
          console.warn("로그인이 필요합니다.");
          alert("로그인이 필요합니다.");
          router.push("/login/hospital");
          return;
        }
        throw new Error(result.message || `${actionText} 요청에 실패했습니다.`);
      }

      console.log(`[TransferBookmarks Like] ${actionText} 성공:`, result);

      // 북마크 페이지에서 좋아요 취소 시 목록 새로고침
      if (isCurrentlyLiked) {
        await fetchBookmarkedTransfers();
      }
    } catch (error) {
      console.error(
        `[TransferBookmarks Like] ${
          isCurrentlyLiked ? "좋아요 취소" : "좋아요"
        } 오류:`,
        error
      );

      // 오류 발생 시 상태 롤백
      setTransferLike(transferId, isCurrentlyLiked);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        {/* 뒤로가기 버튼 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/hospital" className="p-2">
            <ArrowLeftIcon currentColor="currentColor" />
          </Link>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
          {/* 헤더: 제목 */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <h1 className="text-primary font-text text-[24px] text-bold mb-6">
                양도양수 북마크
              </h1>

              {/* 검색바 */}
              <div className="w-full lg:w-auto">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="양도양수 검색"
                />
              </div>
            </div>

            {/* 필터와 생성버튼 */}
            <div className="my-[30px] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* 카테고리 필터 */}
              <div className="w-full lg:w-auto">
                <FilterBoxGroup
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  orientation="horizontal"
                >
                  {transferCategories.map((category) => (
                    <FilterBoxItem key={category} value={category}>
                      {category}
                    </FilterBoxItem>
                  ))}
                </FilterBoxGroup>
              </div>

              <Link
                href={"/transfers/create"}
                className="w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[18px] self-end"
              >
                <EditIcon size="20" /> 글쓰기
              </Link>
            </div>
          </div>

          {/* 결과 수 */}
          <div className="mb-6">
            <p className="text-[14px] text-gray-600">
              총 {totalTransfers}개의 양도양수 정보
            </p>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                <p className="text-[#9098A4]">
                  북마크한 양도양수를 불러오는 중...
                </p>
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchBookmarkedTransfers}
                  className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 카드 그리드 */}
          {!loading && !error && transfers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {transfers.map((transfer) => {
                  const transformedTransfer = transformTransferData(transfer);
                  return (
                    <TransferCard
                      key={transfer.id}
                      id={transfer.id}
                      title={transformedTransfer.title}
                      location={`${transformedTransfer.sido} ${transformedTransfer.sigungu}`}
                      hospitalType={transformedTransfer.hospitalType}
                      area={transformedTransfer.area}
                      price={transformedTransfer.price}
                      date={transformedTransfer.date}
                      views={transformedTransfer.views}
                      imageUrl={transformedTransfer.images?.[0] || ""}
                      categories={transformedTransfer.categories}
                      isAd={transformedTransfer.isAd}
                      isLiked={transformedTransfer.isLiked}
                      onLike={() => handleLike(transfer.id)}
                    />
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : !loading && !error ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-[16px]">
                북마크한 양도양수가 없습니다.
              </p>
              <p className="text-gray-400 text-[14px] mt-2">
                양도양수 목록에서 관심있는 정보를 북마크해보세요.
              </p>
              <button
                onClick={() => router.push("/transfers")}
                className="mt-4 px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
              >
                양도양수 둘러보기
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
