"use client";

import { FilterBox } from "@/components/ui/FilterBox";
import { SearchBar } from "@/components/ui/SearchBar";
import { SelectBox } from "@/components/ui/SelectBox";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ForumCard } from "@/components/ui/ForumCard";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EditIcon } from "public/icons";

export default function ForumsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 필터 상태 관리 (UI용 - 아직 적용되지 않은 상태)
  const [filters, setFilters] = useState({
    animal: [] as string[],
    field: [] as string[],
    searchKeyword: "",
    sortBy: "recent",
  });

  // 실제 적용된 필터 (URL과 동기화)
  const [appliedFilters, setAppliedFilters] = useState({
    animal: [] as string[],
    field: [] as string[],
    searchKeyword: "",
    sortBy: "recent",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // URL에서 필터 파라미터 파싱
  const parseFiltersFromURL = () => {
    const animal = searchParams.get("animal")?.split(",").filter(Boolean) || [];
    const field = searchParams.get("field")?.split(",").filter(Boolean) || [];
    const searchKeyword = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "recent";
    const page = parseInt(searchParams.get("page") || "1");

    return {
      animal,
      field,
      searchKeyword,
      sortBy,
      page,
    };
  };

  // 초기 로드 시 URL에서 필터 읽어오기
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    const { page, ...filterData } = urlFilters;

    setAppliedFilters(filterData);
    setFilters(filterData); // UI 필터도 동기화
    setCurrentPage(page);
  }, [searchParams]);

  // URL 업데이트
  const updateURL = (newFilters: typeof appliedFilters, page: number = 1) => {
    const params = new URLSearchParams();

    if (newFilters.animal.length > 0) {
      params.set("animal", newFilters.animal.join(","));
    }
    if (newFilters.field.length > 0) {
      params.set("field", newFilters.field.join(","));
    }
    if (newFilters.searchKeyword.trim()) {
      params.set("search", newFilters.searchKeyword.trim());
    }
    if (newFilters.sortBy !== "recent") {
      params.set("sort", newFilters.sortBy);
    }
    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    const newPath = queryString ? `/forums?${queryString}` : "/forums";

    router.replace(newPath);
  };

  interface ForumPost {
    id: string;
    title: string;
    tags: string[];
    viewCount: number;
    commentCount: number;
    createdAt: Date;
  }

  const [forumData, setForumData] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 포럼 데이터 가져오기
  useEffect(() => {
    const fetchForums = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/forums');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            const forums = data.data.forums.map((forum: any) => {
              const tags = [];
              if (forum.animalType) tags.push(forum.animalType);
              if (forum.medicalField) tags.push(forum.medicalField);
              
              return {
                id: forum.id, // parseInt 제거하여 문자열 ID 그대로 사용
                title: forum.title,
                tags,
                viewCount: forum.viewCount || 0,
                commentCount: forum.commentCount || 0,
                createdAt: new Date(forum.createdAt),
              };
            });
            setForumData(forums);
          }
        }
      } catch (error) {
        console.error('Failed to fetch forums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForums();
  }, []);

  // 필터링 및 정렬 로직 (검색과 정렬은 즉시 적용, 나머지는 appliedFilters 사용)
  const getFilteredData = () => {
    let filtered = [...forumData];

    // 키워드 검색 (즉시 적용)
    if (filters.searchKeyword.trim()) {
      const keyword = filters.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword) ||
          post.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }

    // 동물 필터 (필터 적용 버튼 필요)
    if (appliedFilters.animal.length > 0) {
      filtered = filtered.filter((post) =>
        appliedFilters.animal.some((animal) => post.tags.includes(animal))
      );
    }

    // 분야 필터 (필터 적용 버튼 필요)
    if (appliedFilters.field.length > 0) {
      filtered = filtered.filter((post) =>
        appliedFilters.field.some((field) => post.tags.includes(field))
      );
    }

    // 정렬 (즉시 적용)
    switch (filters.sortBy) {
      case "recent":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "comments":
        filtered.sort((a, b) => b.commentCount - a.commentCount);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPosts = filteredData.length;
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredData.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const handleFilterChange = (type: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleFilterApply = () => {
    // 검색과 정렬을 제외한 필터만 적용
    const newAppliedFilters = {
      ...appliedFilters,
      animal: filters.animal,
      field: filters.field,
    };
    setAppliedFilters(newAppliedFilters);

    // URL에는 모든 필터 반영 (검색과 정렬 포함)
    updateURL(filters, 1);
    setCurrentPage(1);

    // 모바일에서 필터 닫기
    setIsMobileFilterOpen(false);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      animal: [],
      field: [],
      searchKeyword: "",
      sortBy: "recent",
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

  return (
    <>

      <main className="pt-[50px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[16px]">
          <div className="hidden xl:flex xl:gap-[30px] xl:py-8">
            {/* 왼쪽: 필터링 영역 */}
            <div className="flex-shrink-0 w-[308px] sticky top-[70px] h-fit flex p-[20px] gap-[32px] flex-col border border-[1px] border-[#EFEFF0] rounded-[8px]">
              {/* 분야 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  진료 과목
                </h3>
                <FilterBox.Group
                  value={filters.field}
                  onChange={(value) => handleFilterChange("field", value)}
                >
                  <FilterBox value="내과">내과</FilterBox>
                  <FilterBox value="외과">외과</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 동물 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  동물
                </h3>
                <FilterBox.Group
                  value={filters.animal}
                  onChange={(value) => handleFilterChange("animal", value)}
                >
                  <FilterBox value="개">개</FilterBox>
                  <FilterBox value="고양이">고양이</FilterBox>
                  <FilterBox value="대동물">대동물</FilterBox>
                  <FilterBox value="특수동물">특수동물</FilterBox>
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
                  임상 포럼
                </h1>

                {/* 검색바 */}
                <SearchBar
                  value={filters.searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="제목, 태그 검색"
                />
              </div>

              {/* 결과 정보 및 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[16px] text-[#9098A4]">총 {totalPosts}건</p>
                <div className="flex items-center gap-4">
                  <SelectBox
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    placeholder="최신순"
                    options={[
                      { value: "recent", label: "최신순" },
                      { value: "popular", label: "인기순" },
                      { value: "comments", label: "댓글순" },
                    ]}
                  />
                  <Link
                    href="/forums/create"
                    className="h-[44px] w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[18px]"
                  >
                    <EditIcon size="20" /> 글쓰기
                  </Link>
                </div>
              </div>

              {/* 게시글 목록 */}
              <div className="space-y-0">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-[#9098A4]">로딩 중...</p>
                  </div>
                ) : currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <ForumCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      tags={post.tags}
                      viewCount={post.viewCount}
                      commentCount={post.commentCount}
                      createdAt={post.createdAt}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#9098A4]">등록된 게시글이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              <div className="py-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>

          {/* 모바일/태블릿 버전 (1290px 미만) */}
          <div className="xl:hidden py-4">
            <div className="space-y-4">
              {/* 제목과 필터 버튼 */}
              <div className="flex justify-between items-center">
                <h1 className="font-title text-[28px] title-light text-[#3B394D]">
                  임상 포럼
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
                placeholder="제목, 태그 검색"
              />

              {/* 총 결과 수와 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-[#9098A4]">총 {totalPosts}건</p>
                <div className="flex items-center gap-3">
                  <SelectBox
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    placeholder="최신순"
                    options={[
                      { value: "recent", label: "최신순" },
                      { value: "popular", label: "인기순" },
                      { value: "comments", label: "댓글순" },
                    ]}
                  />
                  <Link
                    href="/forums/create"
                    className="h-[44px] w-[100px] sm:w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[12px] sm:text-[18px]"
                  >
                    <EditIcon size="14" /> 글쓰기
                  </Link>
                </div>
              </div>

              {/* 게시글 목록 */}
              <div className="space-y-0">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-[#9098A4]">로딩 중...</p>
                  </div>
                ) : currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <ForumCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      tags={post.tags}
                      viewCount={post.viewCount}
                      commentCount={post.commentCount}
                      createdAt={post.createdAt}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#9098A4]">등록된 게시글이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              <div className="py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  maxVisiblePages={3}
                />
              </div>
            </div>
          </div>

          {/* 모바일 필터 모달 */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 xl:hidden">
              <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] max-h-[80vh] overflow-y-auto">
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
                    {/* 분야 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        진료 과목
                      </h3>
                      <FilterBox.Group
                        value={filters.field}
                        onChange={(value) => handleFilterChange("field", value)}
                      >
                        <FilterBox value="내과">내과</FilterBox>
                        <FilterBox value="외과">외과</FilterBox>
                      </FilterBox.Group>
                    </div>

                    {/* 동물 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        동물
                      </h3>
                      <FilterBox.Group
                        value={filters.animal}
                        onChange={(value) =>
                          handleFilterChange("animal", value)
                        }
                      >
                        <FilterBox value="개">개</FilterBox>
                        <FilterBox value="고양이">고양이</FilterBox>
                        <FilterBox value="대동물">대동물</FilterBox>
                        <FilterBox value="특수동물">특수동물</FilterBox>
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
