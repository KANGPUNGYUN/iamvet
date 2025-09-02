"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon } from "public/icons";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { FilterBoxGroup } from "@/components/ui/FilterBox/FilterBoxGroup";
import { FilterBoxItem } from "@/components/ui/FilterBox/FilterBoxItem";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import TransferCard from "@/components/ui/TransferCard/TransferCard";

interface TransferData {
  id: number;
  title: string;
  location: string;
  hospitalType: string;
  area: number;
  price: string;
  date: string;
  views: number;
  imageUrl?: string;
  categories: string;
  isAd?: boolean;
  isLiked: boolean;
}

const transferCategories = ["병원양도", "기계장치", "의료장비", "인테리어"];

export default function HospitalTransferBookmarksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const itemsPerPage = 9;

  // 더미 데이터 (실제로는 API에서 가져올 데이터)
  const allTransfers: TransferData[] = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    title: `[양도] 강남 소재 ${
      i % 3 === 0 ? "내과" : i % 3 === 1 ? "외과" : "영상의학과"
    } 병원 양도합니다`,
    location:
      i % 4 === 0
        ? "서울 강남구"
        : i % 4 === 1
        ? "서울 강독구"
        : i % 4 === 2
        ? "경기 성남시"
        : "경기 수원시",
    hospitalType: i % 3 === 0 ? "내과" : i % 3 === 1 ? "외과" : "영상의학과",
    area: 100 + i * 10,
    price: `${3 + (i % 5)}억 양도`,
    date: `2025-04-${String((i % 30) + 1).padStart(2, "0")}`,
    views: 100 + i * 27,
    categories: transferCategories[i % transferCategories.length],
    isAd: i % 8 === 0,
    isLiked: true, // 찜 목록이므로 모두 좋아요 상태
  }));

  // 검색 및 필터링 로직
  const filteredTransfers = useMemo(() => {
    return allTransfers.filter((transfer) => {
      const matchesSearch =
        transfer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.hospitalType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(transfer.categories);

      return matchesSearch && matchesCategory;
    });
  }, [allTransfers, searchQuery, selectedCategories]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransfers = filteredTransfers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1); // 필터 시 첫 페이지로 리셋
  };

  const handleLike = (id: number) => {
    // 좋아요 제거 로직 (실제로는 API 호출)
    console.log(`Transfer ${id} unliked`);
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
                양도양수 찜 목록
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
              총 {filteredTransfers.length}개의 양도양수 정보
            </p>
          </div>

          {/* 카드 그리드 */}
          {currentTransfers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentTransfers.map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    id={transfer.id}
                    title={transfer.title}
                    location={transfer.location}
                    hospitalType={transfer.hospitalType}
                    area={transfer.area}
                    price={transfer.price}
                    date={transfer.date}
                    views={transfer.views}
                    imageUrl={transfer.imageUrl}
                    categories={transfer.categories}
                    isAd={transfer.isAd}
                    isLiked={transfer.isLiked}
                    onLike={() => handleLike(transfer.id)}
                  />
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-[16px]">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
