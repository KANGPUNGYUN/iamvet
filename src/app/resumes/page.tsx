"use client";

import { FilterBox } from "@/components/ui/FilterBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import ResumeCard from "@/components/ui/ResumeCard/ResumeCard";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { allResumeData } from "@/data/resumesData";

export default function ResumesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 적용된 필터 상태 (실제 필터링에 사용)
  const [appliedFilters, setAppliedFilters] = useState({
    workType: [] as string[],
    experience: [] as string[],
    certificate: "",
    location: "",
    searchKeyword: "",
    sortBy: "recent",
  });

  // 임시 필터 상태 (사용자가 선택 중인 필터)
  const [tempFilters, setTempFilters] = useState({
    workType: [] as string[],
    experience: [] as string[],
    certificate: "",
    location: "",
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // URL 쿼리 스트링에서 필터 상태 파싱
  const parseFiltersFromURL = () => {
    const workType =
      searchParams.get("workType")?.split(",").filter(Boolean) || [];
    const experience =
      searchParams.get("experience")?.split(",").filter(Boolean) || [];
    const certificate = searchParams.get("certificate") || "";
    const location = searchParams.get("location") || "";
    const searchKeyword = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "recent";
    const page = parseInt(searchParams.get("page") || "1");

    return {
      workType,
      experience,
      certificate,
      location,
      searchKeyword,
      sortBy,
      page,
    };
  };

  // 필터 상태를 URL 쿼리 스트링으로 업데이트
  const updateURL = (filters: typeof appliedFilters, page: number = 1) => {
    const params = new URLSearchParams();

    if (filters.workType.length > 0)
      params.set("workType", filters.workType.join(","));
    if (filters.experience.length > 0)
      params.set("experience", filters.experience.join(","));
    if (filters.certificate && filters.certificate !== "all")
      params.set("certificate", filters.certificate);
    if (filters.location && filters.location !== "all")
      params.set("location", filters.location);
    if (filters.searchKeyword) params.set("search", filters.searchKeyword);
    if (filters.sortBy !== "recent") params.set("sort", filters.sortBy);
    if (page !== 1) params.set("page", page.toString());

    const queryString = params.toString();
    const newURL = queryString ? `/resumes?${queryString}` : "/resumes";

    router.push(newURL, { scroll: false });
  };

  // 필터링 로직 (적용된 필터 사용)
  const getFilteredData = () => {
    let filtered = [...allResumeData];

    // 키워드 검색
    if (appliedFilters.searchKeyword.trim()) {
      const keyword = appliedFilters.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(
        (resume) =>
          resume.name.toLowerCase().includes(keyword) ||
          resume.experience.toLowerCase().includes(keyword) ||
          resume.preferredLocation.toLowerCase().includes(keyword) ||
          resume.keywords.some((k) => k.toLowerCase().includes(keyword))
      );
    }

    // 근무 형태 필터
    if (appliedFilters.workType.length > 0) {
      filtered = filtered.filter((resume) =>
        appliedFilters.workType.some((type) => resume.keywords.includes(type))
      );
    }

    // 경력 필터
    if (appliedFilters.experience.length > 0) {
      filtered = filtered.filter((resume) =>
        appliedFilters.experience.some((exp) => resume.experience.includes(exp))
      );
    }

    // 자격증 필터
    if (appliedFilters.certificate && appliedFilters.certificate !== "all") {
      filtered = filtered.filter((resume) =>
        resume.keywords.includes(appliedFilters.certificate)
      );
    }

    // 지역 필터
    if (appliedFilters.location && appliedFilters.location !== "all") {
      filtered = filtered.filter((resume) =>
        resume.preferredLocation.includes(appliedFilters.location)
      );
    }

    // 정렬
    switch (appliedFilters.sortBy) {
      case "recent":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "experience":
        filtered.sort((a, b) => {
          const aExp = parseInt(a.experience.match(/\d+/)?.[0] || "0");
          const bExp = parseInt(b.experience.match(/\d+/)?.[0] || "0");
          return bExp - aExp;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalResumes = filteredData.length;

  // 페이지네이션
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalResumes / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const resumeData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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

    // 모바일에서 필터 닫기
    setIsMobileFilterOpen(false);
  };

  // 전체 초기화
  const handleFilterReset = () => {
    const resetFilters = {
      workType: [],
      experience: [],
      certificate: "",
      location: "",
      searchKeyword: "",
      sortBy: "recent",
    };
    setTempFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setAppliedFilterTags([]);
    setCurrentPage(1);
    updateURL(resetFilters, 1);
  };

  // 필터 태그 생성
  const generateFilterTags = (filterData: typeof appliedFilters) => {
    const tags: Array<{ id: string; label: string; type: string }> = [];

    // 근무 형태 태그
    filterData.workType.forEach((type) => {
      tags.push({ id: `workType-${type}`, label: type, type: "workType" });
    });

    // 경력 태그
    filterData.experience.forEach((exp) => {
      tags.push({ id: `experience-${exp}`, label: exp, type: "experience" });
    });

    // 자격증 태그
    if (filterData.certificate && filterData.certificate !== "all") {
      tags.push({
        id: `certificate-${filterData.certificate}`,
        label: filterData.certificate,
        type: "certificate",
      });
    }

    // 지역 태그
    if (filterData.location && filterData.location !== "all") {
      tags.push({
        id: `location-${filterData.location}`,
        label: filterData.location,
        type: "location",
      });
    }

    setAppliedFilterTags(tags);
  };

  // 임시 필터 변경 시 자동으로 태그 생성 (선택하자마자 표시)
  useEffect(() => {
    generateFilterTags(tempFilters);
  }, [
    tempFilters.workType,
    tempFilters.experience,
    tempFilters.certificate,
    tempFilters.location,
  ]);

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

  // 북마크 클릭 처리
  const handleBookmarkClick = (resumeId: string) => {
    console.log(`북마크 클릭: ${resumeId}`);
    // 실제 북마크 기능 구현
  };

  // 이력서 클릭 처리
  const handleResumeClick = (resumeId: string) => {
    router.push(`/resumes/${resumeId}`);
  };

  return (
    <>

      <main className="pt-[50px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[16px]">
          <div className="hidden xl:flex xl:gap-[30px] xl:py-8">
            {/* 왼쪽: 필터링 영역 */}
            <div className="flex-shrink-0 w-[308px] sticky top-[70px] h-fit flex p-[20px] gap-[32px] flex-col border border-[1px] border-[#EFEFF0] rounded-[8px]">
              {/* 근무 형태 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  근무 형태
                </h3>
                <FilterBox.Group
                  value={tempFilters.workType}
                  onChange={(value) =>
                    handleTempFilterChange("workType", value)
                  }
                >
                  <FilterBox value="정규직">정규직</FilterBox>
                  <FilterBox value="파트타임">파트타임</FilterBox>
                  <FilterBox value="계약직">계약직</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 경력 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  경력
                </h3>
                <FilterBox.Group
                  value={tempFilters.experience}
                  onChange={(value) =>
                    handleTempFilterChange("experience", value)
                  }
                >
                  <FilterBox value="신입">신입</FilterBox>
                  <FilterBox value="1-3년">1-3년</FilterBox>
                  <FilterBox value="3-5년">3-5년</FilterBox>
                  <FilterBox value="5년 이상">5년 이상</FilterBox>
                </FilterBox.Group>
              </div>

              {/* 자격증 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  자격증
                </h3>
                <SelectBox
                  value={tempFilters.certificate}
                  onChange={(value) =>
                    handleTempFilterChange("certificate", value)
                  }
                  placeholder="자격증 선택"
                  options={[
                    { value: "all", label: "전체" },
                    { value: "수의사", label: "수의사" },
                    { value: "간호조무사", label: "간호조무사" },
                    { value: "동물간호복지사", label: "동물간호복지사" },
                    { value: "반려동물관리사", label: "반려동물관리사" },
                    { value: "펫시터", label: "펫시터" },
                  ]}
                />
              </div>

              {/* 지역 */}
              <div>
                <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                  지역
                </h3>
                <SelectBox
                  value={tempFilters.location}
                  onChange={(value) =>
                    handleTempFilterChange("location", value)
                  }
                  placeholder="지역 선택"
                  options={[
                    { value: "all", label: "전체" },
                    { value: "서울", label: "서울" },
                    { value: "부산", label: "부산" },
                    { value: "대구", label: "대구" },
                    { value: "인천", label: "인천" },
                    { value: "광주", label: "광주" },
                    { value: "대전", label: "대전" },
                    { value: "울산", label: "울산" },
                    { value: "경기", label: "경기" },
                    { value: "강원", label: "강원" },
                    { value: "충북", label: "충북" },
                    { value: "충남", label: "충남" },
                    { value: "전북", label: "전북" },
                    { value: "전남", label: "전남" },
                    { value: "경북", label: "경북" },
                    { value: "경남", label: "경남" },
                    { value: "제주", label: "제주" },
                  ]}
                />
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
                  인재 채용
                </h1>

                {/* 검색바 */}
                <SearchBar
                  value={appliedFilters.searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="이름, 경력, 지역 검색하기"
                />
              </div>

              {/* 결과 정보 및 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[16px] text-[#9098A4]">
                  총 {totalResumes}건
                </p>
                <SelectBox
                  value={appliedFilters.sortBy}
                  onChange={handleSortChange}
                  placeholder="최신순"
                  options={[
                    { value: "recent", label: "최신순" },
                    { value: "experience", label: "경력순" },
                    { value: "name", label: "이름순" },
                  ]}
                />
              </div>

              {/* 이력서 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumeData.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    name={resume.name}
                    experience={resume.experience}
                    preferredLocation={resume.preferredLocation}
                    keywords={resume.keywords}
                    lastAccessDate={resume.lastAccessDate}
                    isBookmarked={resume.isBookmarked}
                    onClick={() => {
                      window.location.href = `/resumes/${resume.id}`;
                    }}
                    onBookmarkClick={() => {
                      console.log("북마크:", resume.id);
                    }}
                  />
                ))}
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
                  인재 채용
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
                value={appliedFilters.searchKeyword}
                onChange={handleSearchChange}
                placeholder="이름, 경력, 지역 검색하기"
              />

              {/* 총 결과 수와 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-[#9098A4]">
                  총 {totalResumes}건
                </p>
                <SelectBox
                  value={appliedFilters.sortBy}
                  onChange={handleSortChange}
                  placeholder="최신순"
                  options={[
                    { value: "recent", label: "최신순" },
                    { value: "experience", label: "경력순" },
                    { value: "name", label: "이름순" },
                  ]}
                />
              </div>

              {/* 이력서 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resumeData.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    name={resume.name}
                    experience={resume.experience}
                    preferredLocation={resume.preferredLocation}
                    keywords={resume.keywords}
                    lastAccessDate={resume.lastAccessDate}
                    isBookmarked={resume.isBookmarked}
                    onClick={() => {
                      window.location.href = `/resumes/${resume.id}`;
                    }}
                    onBookmarkClick={() => {
                      console.log("북마크:", resume.id);
                    }}
                  />
                ))}
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
                    {/* 근무 형태 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        근무 형태
                      </h3>
                      <FilterBox.Group
                        value={tempFilters.workType}
                        onChange={(value) =>
                          handleTempFilterChange("workType", value)
                        }
                      >
                        <FilterBox value="정규직">정규직</FilterBox>
                        <FilterBox value="파트타임">파트타임</FilterBox>
                        <FilterBox value="계약직">계약직</FilterBox>
                      </FilterBox.Group>
                    </div>

                    {/* 경력 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        경력
                      </h3>
                      <FilterBox.Group
                        value={tempFilters.experience}
                        onChange={(value) =>
                          handleTempFilterChange("experience", value)
                        }
                      >
                        <FilterBox value="신입">신입</FilterBox>
                        <FilterBox value="1-3년">1-3년</FilterBox>
                        <FilterBox value="3-5년">3-5년</FilterBox>
                        <FilterBox value="5년 이상">5년 이상</FilterBox>
                      </FilterBox.Group>
                    </div>

                    {/* 자격증 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        자격증
                      </h3>
                      <SelectBox
                        value={tempFilters.certificate}
                        onChange={(value) =>
                          handleTempFilterChange("certificate", value)
                        }
                        placeholder="자격증 선택"
                        options={[
                          { value: "all", label: "전체" },
                          { value: "수의사", label: "수의사" },
                          { value: "간호조무사", label: "간호조무사" },
                          { value: "동물간호복지사", label: "동물간호복지사" },
                          { value: "반려동물관리사", label: "반려동물관리사" },
                          { value: "펫시터", label: "펫시터" },
                        ]}
                      />
                    </div>

                    {/* 지역 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        지역
                      </h3>
                      <SelectBox
                        value={tempFilters.location}
                        onChange={(value) =>
                          handleTempFilterChange("location", value)
                        }
                        placeholder="지역 선택"
                        options={[
                          { value: "all", label: "전체" },
                          { value: "서울", label: "서울" },
                          { value: "부산", label: "부산" },
                          { value: "대구", label: "대구" },
                          { value: "인천", label: "인천" },
                          { value: "광주", label: "광주" },
                          { value: "대전", label: "대전" },
                          { value: "울산", label: "울산" },
                          { value: "경기", label: "경기" },
                          { value: "강원", label: "강원" },
                          { value: "충북", label: "충북" },
                          { value: "충남", label: "충남" },
                          { value: "전북", label: "전북" },
                          { value: "전남", label: "전남" },
                          { value: "경북", label: "경북" },
                          { value: "경남", label: "경남" },
                          { value: "제주", label: "제주" },
                        ]}
                      />
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
