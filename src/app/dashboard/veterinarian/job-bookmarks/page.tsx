"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "public/icons";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { FilterBoxGroup } from "@/components/ui/FilterBox/FilterBoxGroup";
import { FilterBoxItem } from "@/components/ui/FilterBox/FilterBoxItem";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import JobInfoCard from "@/components/ui/JobInfoCard";
// import { useLikeStore } from "@/stores/likeStore"; // 주석 처리 - 북마크 페이지에서는 불필요

interface JobData {
  id: string;
  hospital: string; // 새로운 API에서는 문자열로 반환
  dDay: string; // "D-5", "신규", "상시" 등
  position: string;
  location: string; // 위치 정보
  jobType: string; // 경력/근무형태 등
  tags: string[];
  isBookmarked: boolean;
}

const workTypeCategories = ["정규직", "계약직", "파트타임", "인턴"];
const experienceCategories = ["신입", "1년 이상", "3년 이상", "5년 이상"];

export default function VeterinarianJobBookmarksPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const itemsPerPage = 9;

  // Zustand 스토어에서 좋아요 상태 관리 (주석 처리 - 북마크 페이지에서는 북마크 기능만 사용)
  // const { setJobLike, toggleJobLike, initializeJobLikes, isJobLiked } = useLikeStore();

  // API에서 북마크한 채용공고 정보 가져오기
  const fetchBookmarkedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // 북마크된 공고 전용 API 사용 (좋아요한 공고를 북마크로 표시)
      const response = await fetch('/api/veterinarians/bookmarked-jobs', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("북마크한 채용공고 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      const jobsData = result.jobs || [];
      
      // 필터링 로직 (클라이언트 사이드)
      let filteredJobs = jobsData;
      
      // 검색 키워드 필터링
      if (searchQuery.trim()) {
        const keyword = searchQuery.trim().toLowerCase();
        filteredJobs = filteredJobs.filter((job: any) => 
          job.position?.toLowerCase().includes(keyword) ||
          job.hospital?.toLowerCase().includes(keyword) ||
          job.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
        );
      }
      
      // 근무형태 필터링
      if (selectedWorkTypes.length > 0) {
        filteredJobs = filteredJobs.filter((job: any) =>
          selectedWorkTypes.some(workType => 
            job.tags?.includes(workType) || job.jobType?.includes(workType)
          )
        );
      }
      
      // 경력 필터링
      if (selectedExperiences.length > 0) {
        filteredJobs = filteredJobs.filter((job: any) =>
          selectedExperiences.some(exp => 
            job.jobType?.includes(exp)
          )
        );
      }

      // 페이지네이션
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      setJobs(paginatedJobs);
      setTotalPages(Math.ceil(filteredJobs.length / itemsPerPage));
      setTotalJobs(filteredJobs.length);

      // 초기 좋아요 상태 동기화 (주석 처리 - 북마크 페이지에서는 불필요)
      // const likedJobIds = paginatedJobs.map((job: any) => job.id);
      // if (likedJobIds.length > 0) {
      //   console.log("[VeterinarianJobBookmarks] 서버에서 받은 좋아요 채용공고:", likedJobIds);
      //   initializeJobLikes(likedJobIds);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("북마크 채용공고 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 필터나 페이지가 변경될 때마다 API 호출
  useEffect(() => {
    fetchBookmarkedJobs();
  }, [searchQuery, selectedWorkTypes, selectedExperiences, currentPage]);

  // 채용공고 데이터 변환 함수 (제거됨 - 새로운 API 구조에서는 불필요)

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  const handleWorkTypeChange = (workTypes: string[]) => {
    setSelectedWorkTypes(workTypes);
    setCurrentPage(1); // 필터 시 첫 페이지로 리셋
  };

  const handleExperienceChange = (experiences: string[]) => {
    setSelectedExperiences(experiences);
    setCurrentPage(1); // 필터 시 첫 페이지로 리셋
  };

  // 채용공고 좋아요/취소 핸들러 (주석 처리 - 북마크 페이지에서는 불필요)
  // const handleLike = async (jobId: string) => { ... };

  // 북마크 해제 핸들러 (좋아요 해제와 동일한 기능)
  const handleBookmarkToggle = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/like`, {
        method: 'DELETE', // 좋아요(북마크) 해제
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 북마크 해제 성공 시 목록 새로고침
        await fetchBookmarkedJobs();
        console.log(`[VeterinarianJobBookmarks] 북마크 해제 성공: ${jobId}`);
      } else {
        throw new Error('북마크 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크 해제 실패:', error);
      alert('북마크 해제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        {/* 뒤로가기 버튼 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/veterinarian" className="p-2">
            <ArrowLeftIcon currentColor="currentColor" />
          </Link>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
          {/* 헤더: 제목 */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <h1 className="text-primary font-text text-[24px] text-bold mb-6">
                채용공고 북마크
              </h1>

              {/* 검색바 */}
              <div className="w-full lg:w-auto">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="채용공고 검색"
                />
              </div>
            </div>

            {/* 필터 */}
            <div className="my-[30px] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* 근무형태 필터 */}
              <div className="w-full lg:w-auto">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    근무형태
                  </span>
                  <FilterBoxGroup
                    value={selectedWorkTypes}
                    onChange={handleWorkTypeChange}
                    orientation="horizontal"
                  >
                    {workTypeCategories.map((workType) => (
                      <FilterBoxItem key={workType} value={workType}>
                        {workType}
                      </FilterBoxItem>
                    ))}
                  </FilterBoxGroup>
                </div>

                {/* 경력 필터 */}
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    경력
                  </span>
                  <FilterBoxGroup
                    value={selectedExperiences}
                    onChange={handleExperienceChange}
                    orientation="horizontal"
                  >
                    {experienceCategories.map((experience) => (
                      <FilterBoxItem key={experience} value={experience}>
                        {experience}
                      </FilterBoxItem>
                    ))}
                  </FilterBoxGroup>
                </div>
              </div>
            </div>
          </div>

          {/* 결과 수 */}
          <div className="mb-6">
            <p className="text-[14px] text-gray-600">
              총 {totalJobs}개의 채용공고
            </p>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                <p className="text-[#9098A4]">
                  북마크한 채용공고를 불러오는 중...
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
                  onClick={fetchBookmarkedJobs}
                  className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 카드 그리드 */}
          {!loading && !error && jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {jobs.map((job) => {
                  // D-Day를 숫자로 변환 (기존 dDay는 문자열 "D-5" 형태)
                  let dDayNumber = null;
                  if (job.dDay && job.dDay !== "신규" && job.dDay !== "상시" && job.dDay !== "마감") {
                    const match = job.dDay.match(/D-?(\d+)/);
                    if (match) {
                      dDayNumber = parseInt(match[1]);
                    }
                  }

                  return (
                    <JobInfoCard
                      key={job.id}
                      id={job.id}
                      hospital={job.hospital}
                      position={job.position}
                      location={job.location}
                      jobType={job.jobType}
                      tags={job.tags}
                      dDay={dDayNumber}
                      isBookmarked={true} // 북마크된 공고 페이지이므로 항상 true
                      onBookmark={() => handleBookmarkToggle(job.id)}
                      onClick={() => router.push(`/jobs/${job.id}`)}
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
                북마크한 채용공고가 없습니다.
              </p>
              <p className="text-gray-400 text-[14px] mt-2">
                채용공고 목록에서 관심있는 공고를 북마크해보세요.
              </p>
              <button
                onClick={() => router.push("/jobs")}
                className="mt-4 px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
              >
                채용공고 둘러보기
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
