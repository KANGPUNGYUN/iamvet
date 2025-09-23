"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import ResumeCard from "@/components/ui/ResumeCard/ResumeCard";
import { useLikeStore } from "@/stores/likeStore";

interface ResumeData {
  id: string;
  name: string;
  experience: string;
  preferredLocation: string;
  keywords: string[];
  lastAccessDate: string;
  profileImage?: string;
  isNew: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
}

const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "popular", label: "인기순" },
];

export default function TalentManagementPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResumes, setTotalResumes] = useState(0);
  const itemsPerPage = 12;
  
  // Zustand 스토어에서 좋아요 상태 관리
  const {
    setResumeLike,
    toggleResumeLike,
    initializeResumeLikes,
    isResumeLiked
  } = useLikeStore();

  // API에서 북마크한 이력서 가져오기
  const fetchBookmarkedResumes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("bookmarked", "true"); // 북마크된 이력서만 조회
      params.set("page", currentPage.toString());
      params.set("limit", itemsPerPage.toString());
      params.set("sort", sortBy);

      const response = await fetch(`/api/resumes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("북마크한 이력서 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      
      if (result.status === "success") {
        // API 응답 구조 확인
        console.log('[TalentManagement] API 응답:', result);
        
        let resumesData = [];
        let totalCount = 0;
        let pages = 0;
        
        // API 응답 구조에 따라 데이터 추출
        if (result.data) {
          // 북마크 조회의 경우 result.data.data 구조
          if (result.data.data && Array.isArray(result.data.data)) {
            resumesData = result.data.data;
            totalCount = result.data.total || 0;
            pages = result.data.totalPages || 0;
          }
          // 일반 조회의 경우 result.data.resumes 구조
          else if (result.data.resumes && Array.isArray(result.data.resumes.data)) {
            resumesData = result.data.resumes.data;
            totalCount = result.data.resumes.total || result.data.resumes.data.length;
            pages = result.data.resumes.totalPages || Math.ceil(totalCount / itemsPerPage);
          }
          // 북마크 조회에서 직접 배열이 오는 경우
          else if (Array.isArray(result.data)) {
            resumesData = result.data;
            totalCount = result.total || result.data.length;
            pages = result.totalPages || Math.ceil(totalCount / itemsPerPage);
          }
        }
        
        console.log('[TalentManagement] 추출된 resumesData:', resumesData);
        
        setResumes(resumesData);
        setTotalPages(pages);
        setTotalResumes(totalCount);
        
        // 초기 좋아요 상태 동기화
        if (Array.isArray(resumesData)) {
          const likedResumeIds = resumesData
            .filter((resume: any) => resume.isLiked)
            .map((resume: any) => resume.userId || resume.id);
          
          if (likedResumeIds.length > 0) {
            console.log('[TalentManagement] 서버에서 받은 좋아요 이력서:', likedResumeIds);
            initializeResumeLikes(likedResumeIds);
          }
        }
      } else {
        throw new Error(result.message || "북마크한 이력서 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("북마크 이력서 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 페이지나 정렬이 변경될 때마다 API 호출
  useEffect(() => {
    fetchBookmarkedResumes();
  }, [currentPage, sortBy]);

  // 이력서 데이터 변환 함수
  const transformResumeData = (resume: ResumeData) => {
    return {
      ...resume,
      isBookmarked: isResumeLiked((resume as any).userId || resume.id), // Zustand 스토어에서 좋아요 상태 가져오기 (userId 기준)
    };
  };

  // 이력서 좋아요/취소 핸들러
  const handleBookmark = async (resumeId: string) => {
    // resumeId로 해당 resume 찾기
    const resume = resumes.find(r => r.id === resumeId);
    const userId = (resume as any)?.userId || resumeId;
    
    const isCurrentlyLiked = isResumeLiked(userId);
    
    console.log(`[TalentManagement Like] ${resumeId} - 현재 상태: ${isCurrentlyLiked ? '좋아요됨' : '좋아요안됨'} -> ${isCurrentlyLiked ? '좋아요 취소' : '좋아요'}`);
    
    // 낙관적 업데이트: UI를 먼저 변경
    toggleResumeLike(userId);

    try {
      const method = isCurrentlyLiked ? 'DELETE' : 'POST';
      const actionText = isCurrentlyLiked ? '좋아요 취소' : '좋아요';
      
      console.log(`[TalentManagement Like] API 요청: ${method} /api/resumes/${resumeId}/like`);
      
      const response = await fetch(`/api/resumes/${resumeId}/like`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`[TalentManagement Like] ${actionText} 실패:`, result);
        
        // 오류 발생 시 상태 롤백
        setResumeLike(userId, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn('이력서를 찾을 수 없습니다:', resumeId);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes('이미 좋아요한')) {
            console.log(`[TalentManagement Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`);
            setResumeLike(userId, true);
            return;
          }
          console.warn(`${actionText} 실패:`, result.message);
          return;
        } else if (response.status === 401) {
          console.warn('로그인이 필요합니다.');
          alert("로그인이 필요합니다.");
          router.push("/login/hospital");
          return;
        }
        throw new Error(result.message || `${actionText} 요청에 실패했습니다.`);
      }

      console.log(`[TalentManagement Like] ${actionText} 성공:`, result);
      
      // 북마크 페이지에서 좋아요 취소 시 목록 새로고침
      if (isCurrentlyLiked) {
        await fetchBookmarkedResumes();
      }
    } catch (error) {
      console.error(`[TalentManagement Like] ${isCurrentlyLiked ? '좋아요 취소' : '좋아요'} 오류:`, error);
      
      // 오류 발생 시 상태 롤백
      setResumeLike(userId, isCurrentlyLiked);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleResumeClick = (id: string) => {
    // 이력서 상세 페이지로 이동
    router.push(`/resumes/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        {/* 컨텐츠 영역 */}
        <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
          {/* 헤더: 제목과 정렬 SelectBox */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-text text-[24px] text-bold">
              인재 정보
            </h1>
            <SelectBox
              value={sortBy}
              onChange={setSortBy}
              placeholder="최신순"
              options={sortOptions}
            />
          </div>

          {/* 결과 수 */}
          <div className="mb-6">
            <p className="text-[14px] text-gray-600">
              총 {totalResumes}명
            </p>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                <p className="text-[#9098A4]">북마크한 인재들을 불러오는 중...</p>
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchBookmarkedResumes}
                  className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 이력서 카드 그리드 */}
          {!loading && !error && resumes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resumes.map((resume) => {
                  const transformedResume = transformResumeData(resume);
                  return (
                    <ResumeCard
                      key={resume.id}
                      id={resume.id}
                      name={transformedResume.name}
                      experience={transformedResume.experience}
                      preferredLocation={transformedResume.preferredLocation}
                      keywords={transformedResume.keywords}
                      lastAccessDate={transformedResume.lastAccessDate}
                      profileImage={transformedResume.profileImage}
                      isNew={transformedResume.isNew}
                      isBookmarked={transformedResume.isBookmarked}
                      onClick={() => handleResumeClick(resume.id)}
                      onBookmarkClick={() => handleBookmark(resume.id)}
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
                북마크한 인재가 없습니다.
              </p>
              <p className="text-gray-400 text-[14px] mt-2">
                인재 목록에서 관심있는 인재를 북마크해보세요.
              </p>
              <button 
                onClick={() => router.push('/resumes')}
                className="mt-4 px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
              >
                인재 둘러보기
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
