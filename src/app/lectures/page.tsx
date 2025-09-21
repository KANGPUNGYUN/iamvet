"use client";

import { FilterBox } from "@/components/ui/FilterBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import LectureCard from "@/components/ui/LectureCard/LectureCard";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: number;
  category: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function LecturesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 필터 상태 관리 (UI용 - 아직 적용되지 않은 상태)
  const [filters, setFilters] = useState({
    medicalField: [] as string[],
    animalType: [] as string[],
    difficulty: [] as string[],
    searchKeyword: "",
    sortBy: "latest",
  });

  // 실제 적용된 필터 (URL과 동기화)
  const [appliedFilters, setAppliedFilters] = useState({
    medicalField: [] as string[],
    animalType: [] as string[],
    difficulty: [] as string[],
    searchKeyword: "",
    sortBy: "latest",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // API 상태 관리
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalLectures, setTotalLectures] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 모바일 필터 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isMobileFilterOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // URL에서 필터 파라미터 파싱
  const parseFiltersFromURL = () => {
    const medicalField =
      searchParams.get("medicalField")?.split(",").filter(Boolean) || [];
    const animalType =
      searchParams.get("animalType")?.split(",").filter(Boolean) || [];
    const difficulty =
      searchParams.get("difficulty")?.split(",").filter(Boolean) || [];
    const searchKeyword = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "latest";
    const page = parseInt(searchParams.get("page") || "1");

    return {
      medicalField,
      animalType,
      difficulty,
      searchKeyword,
      sortBy,
      page,
    };
  };

  // URL 업데이트
  const updateURL = (newFilters: typeof appliedFilters, page: number = 1) => {
    const params = new URLSearchParams();

    if (newFilters.medicalField.length > 0) {
      params.set("medicalField", newFilters.medicalField.join(","));
    }
    if (newFilters.animalType.length > 0) {
      params.set("animalType", newFilters.animalType.join(","));
    }
    if (newFilters.difficulty.length > 0) {
      params.set("difficulty", newFilters.difficulty.join(","));
    }
    if (newFilters.searchKeyword.trim()) {
      params.set("search", newFilters.searchKeyword.trim());
    }
    if (newFilters.sortBy !== "latest") {
      params.set("sort", newFilters.sortBy);
    }
    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    const newPath = queryString ? `/lectures?${queryString}` : "/lectures";

    router.replace(newPath);
  };

  // API 호출 함수
  const fetchLectures = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (appliedFilters.searchKeyword.trim()) {
        params.set("keyword", appliedFilters.searchKeyword.trim());
      }
      if (appliedFilters.medicalField.length > 0) {
        params.set("medicalField", appliedFilters.medicalField.join(","));
      }
      if (appliedFilters.difficulty.length > 0) {
        params.set("difficulty", appliedFilters.difficulty.join(","));
      }
      
      params.set("page", currentPage.toString());
      params.set("limit", "9"); // 3x3 그리드
      params.set("sort", appliedFilters.sortBy);

      const response = await fetch(`/api/lectures?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("강의 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      
      if (result.status === "success") {
        const lecturesData = result.data.lectures;
        setLectures(lecturesData.data || []);
        setTotalLectures(lecturesData.total || 0);
        setTotalPages(lecturesData.totalPages || 0);
      } else {
        throw new Error(result.message || "강의 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("강의 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 시 URL에서 필터 읽어오기
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();

    const newFilters = {
      medicalField: urlFilters.medicalField,
      animalType: urlFilters.animalType,
      difficulty: urlFilters.difficulty,
      searchKeyword: urlFilters.searchKeyword,
      sortBy: urlFilters.sortBy,
    };

    setAppliedFilters(newFilters);
    setFilters(newFilters);
    setCurrentPage(urlFilters.page);
  }, [searchParams]);

  // 필터나 페이지가 변경될 때마다 API 호출
  useEffect(() => {
    fetchLectures();
  }, [appliedFilters, currentPage]);

  // 강의 데이터 변환 함수
  const transformLectureData = (lecture: Lecture) => {
    return {
      id: lecture.id,
      title: lecture.title,
      date: new Date(lecture.createdAt).toLocaleDateString("ko-KR"),
      views: lecture.viewCount,
      imageUrl: lecture.thumbnail || "/assets/images/lecture/default.png",
      category: lecture.category,
      isLiked: false, // 추후 좋아요 기능 구현 시 수정
    };
  };

  const handleFilterChange = (type: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleFilterApply = () => {
    const newAppliedFilters = {
      ...appliedFilters,
      medicalField: filters.medicalField,
      animalType: filters.animalType,
      difficulty: filters.difficulty,
    };
    setAppliedFilters(newAppliedFilters);

    updateURL(filters, 1);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      medicalField: [],
      animalType: [],
      difficulty: [],
      searchKeyword: "",
      sortBy: "latest",
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    updateURL(resetFilters, 1);
    setCurrentPage(1);
  };

  // 검색어 변경 시 즉시 URL 업데이트
  const handleSearchChange = (searchKeyword: string) => {
    setFilters((prev) => ({ ...prev, searchKeyword }));
    const newFilters = { ...filters, searchKeyword };
    updateURL({ ...appliedFilters, ...newFilters }, 1);
    setCurrentPage(1);
  };

  // 정렬 변경 시 즉시 적용
  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    const newFilters = { ...filters, sortBy };
    updateURL({ ...appliedFilters, ...newFilters }, 1);
    setCurrentPage(1);
  };

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(appliedFilters, page);
  };

  console.log("lectures", lectures);

  return (
    <>

      <main className="pt-[50px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[16px]">
          <div className="hidden xl:flex xl:gap-[30px] xl:py-8">
            {/* 왼쪽: 필터링 영역 */}
            <div className="flex-shrink-0 w-[308px] sticky top-[70px] h-fit flex p-[20px] gap-[32px] flex-col border border-[1px] border-[#EFEFF0] rounded-[8px]">
              {/* 의료 분야 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  의료 분야
                </h3>
                <FilterBox.Group
                  value={filters.medicalField}
                  onChange={(value) =>
                    handleFilterChange("medicalField", value)
                  }
                >
                  <FilterBox value="surgery">수술 강의</FilterBox>
                  <FilterBox value="behavior">행동/심리학</FilterBox>
                  <FilterBox value="emergency">응급의학</FilterBox>
                  <FilterBox value="dermatology">피부과</FilterBox>
                  <FilterBox value="internal">내과</FilterBox>
                  <FilterBox value="radiology">영상진단</FilterBox>
                  <FilterBox value="anesthesia">마취학</FilterBox>
                  <FilterBox value="dentistry">치과</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 동물 종류 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  동물 종류
                </h3>
                <FilterBox.Group
                  value={filters.animalType}
                  onChange={(value) => handleFilterChange("animalType", value)}
                >
                  <FilterBox value="dog">강아지</FilterBox>
                  <FilterBox value="cat">고양이</FilterBox>
                  <FilterBox value="other">기타</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 난이도 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  난이도
                </h3>
                <FilterBox.Group
                  value={filters.difficulty}
                  onChange={(value) => handleFilterChange("difficulty", value)}
                >
                  <FilterBox value="beginner">입문</FilterBox>
                  <FilterBox value="basic">초급</FilterBox>
                  <FilterBox value="intermediate">중급</FilterBox>
                  <FilterBox value="advanced">고급</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 필터 적용/초기화 버튼 */}
              <div className="space-y-3">
                <Button
                  variant="default"
                  size="medium"
                  fullWidth
                  onClick={handleFilterApply}
                >
                  필터 적용
                </Button>
                <Button variant="text" size="small" onClick={handleFilterReset}>
                  필터 초기화
                </Button>
              </div>
            </div>

            {/* 중앙: 메인 콘텐츠 */}
            <div className="flex-1 space-y-6">
              {/* 제목 */}
              <div className="flex justify-between items-center self-stretch">
                <h1 className="text-[28px] font-title title-medium text-[#3B394D]">
                  강의 영상
                </h1>

                {/* 검색바 */}
                <SearchBar
                  value={filters.searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="키워드로 검색"
                />
              </div>

              {/* 결과 정보 및 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[16px] text-[#9098A4]">
                  총 {totalLectures}건
                </p>
                <SelectBox
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  placeholder="최신순"
                  options={[
                    { value: "latest", label: "최신순" },
                    { value: "oldest", label: "오래된순" },
                    { value: "view", label: "조회순" },
                    { value: "rating", label: "평점순" },
                  ]}
                />
              </div>

              {/* 로딩 상태 */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                    <p className="text-[#9098A4]">강의 목록을 불러오는 중...</p>
                  </div>
                </div>
              )}

              {/* 에러 상태 */}
              {error && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                      onClick={fetchLectures}
                      className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {/* 강의 목록 - 3x3 그리드 */}
              {!loading && !error && (
                <div className="grid grid-cols-3 gap-6">
                  {lectures.map((lecture) => {
                    const transformedLecture = transformLectureData(lecture);
                    return (
                      <LectureCard
                        key={lecture.id}
                        title={transformedLecture.title}
                        date={transformedLecture.date}
                        views={transformedLecture.views}
                        imageUrl={transformedLecture.imageUrl}
                        category={transformedLecture.category}
                        isLiked={transformedLecture.isLiked}
                        onLike={() => {
                          // 좋아요 기능 구현
                          console.log("Like clicked for lecture:", lecture.id);
                        }}
                        onClick={() => {
                          window.location.href = `/lectures/${lecture.id}`;
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* 데이터 없음 상태 */}
              {!loading && !error && lectures.length === 0 && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-[#9098A4] text-lg">검색 결과가 없습니다.</p>
                    <p className="text-[#9098A4] text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
                  </div>
                </div>
              )}

              {/* 페이지네이션 */}
              {!loading && !error && totalPages > 1 && (
                <div className="py-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 모바일/태블릿 버전 (1280px 미만) */}
          <div className="xl:hidden py-4">
            <div className="space-y-4">
              {/* 제목과 필터 버튼 */}
              <div className="flex justify-between items-center">
                <h1 className="font-title text-[28px] title-light text-[#3B394D]">
                  강의 영상
                </h1>
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex w-[62px] items-center gap-[10px]"
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

              {/* 검색바 */}
              <SearchBar
                className="flex self-end"
                value={filters.searchKeyword}
                onChange={handleSearchChange}
                placeholder="키워드로 검색"
              />

              {/* 총 결과 수와 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-[#9098A4]">
                  총 {totalLectures}건
                </p>
                <SelectBox
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  placeholder="최신순"
                  options={[
                    { value: "latest", label: "최신순" },
                    { value: "oldest", label: "오래된순" },
                    { value: "view", label: "조회순" },
                    { value: "rating", label: "평점순" },
                  ]}
                />
              </div>

              {/* 로딩 상태 (모바일) */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                    <p className="text-[#9098A4]">강의 목록을 불러오는 중...</p>
                  </div>
                </div>
              )}

              {/* 에러 상태 (모바일) */}
              {error && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                      onClick={fetchLectures}
                      className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {/* 강의 목록 */}
              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                  {lectures.map((lecture) => {
                    const transformedLecture = transformLectureData(lecture);
                    return (
                      <LectureCard
                        key={lecture.id}
                        title={transformedLecture.title}
                        date={transformedLecture.date}
                        views={transformedLecture.views}
                        imageUrl={transformedLecture.imageUrl}
                        category={transformedLecture.category}
                        isLiked={transformedLecture.isLiked}
                        onLike={() => {
                          console.log("Like clicked for lecture:", lecture.id);
                        }}
                        onClick={() => {
                          window.location.href = `/lectures/${lecture.id}`;
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* 데이터 없음 상태 (모바일) */}
              {!loading && !error && lectures.length === 0 && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-[#9098A4] text-lg">검색 결과가 없습니다.</p>
                    <p className="text-[#9098A4] text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
                  </div>
                </div>
              )}

              {/* 페이지네이션 */}
              {!loading && !error && totalPages > 1 && (
                <div className="py-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    maxVisiblePages={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 모바일 필터 모달 */}
          {isMobileFilterOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 xl:hidden"
              style={{
                height: "100dvh",
                width: "100vw",
                overflow: "hidden",
              }}
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] max-h-[80vh] overflow-y-auto"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin",
                  msOverflowStyle: "scrollbar",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* 헤더 */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[20px] font-bold text-[#3B394D]">
                      필터
                    </h2>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="#3B394D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 필터 내용 */}
                  <div className="space-y-6">
                    {/* 의료 분야 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        의료 분야
                      </h3>
                      <FilterBox.Group
                        value={filters.medicalField}
                        onChange={(value) =>
                          handleFilterChange("medicalField", value)
                        }
                      >
                        <FilterBox value="surgery">수술 강의</FilterBox>
                        <FilterBox value="behavior">행동/심리학</FilterBox>
                        <FilterBox value="emergency">응급의학</FilterBox>
                        <FilterBox value="dermatology">피부과</FilterBox>
                        <FilterBox value="internal">내과</FilterBox>
                        <FilterBox value="radiology">영상진단</FilterBox>
                        <FilterBox value="anesthesia">마취학</FilterBox>
                        <FilterBox value="dentistry">치과</FilterBox>
                      </FilterBox.Group>
                    </div>

                    {/* 동물 종류 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        동물 종류
                      </h3>
                      <FilterBox.Group
                        value={filters.animalType}
                        onChange={(value) =>
                          handleFilterChange("animalType", value)
                        }
                      >
                        <FilterBox value="dog">강아지</FilterBox>
                        <FilterBox value="cat">고양이</FilterBox>
                        <FilterBox value="other">기타</FilterBox>
                      </FilterBox.Group>
                    </div>

                    {/* 난이도 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        난이도
                      </h3>
                      <FilterBox.Group
                        value={filters.difficulty}
                        onChange={(value) =>
                          handleFilterChange("difficulty", value)
                        }
                      >
                        <FilterBox value="beginner">입문</FilterBox>
                        <FilterBox value="basic">초급</FilterBox>
                        <FilterBox value="intermediate">중급</FilterBox>
                        <FilterBox value="advanced">고급</FilterBox>
                      </FilterBox.Group>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex flex-col gap-[16px] w-full">
                      <Button
                        variant="default"
                        size="medium"
                        onClick={handleFilterApply}
                        fullWidth
                        className="max-w-none"
                      >
                        필터 적용
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleFilterReset}
                      >
                        초기화
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

    </>
  );
}
