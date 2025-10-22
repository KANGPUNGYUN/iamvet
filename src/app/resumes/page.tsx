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
import { useResumes } from "@/hooks/useResumes";
import { useLikeStore } from "@/stores/likeStore";
import { useHospitalAuth } from "@/utils/hospitalAuthGuard";
import { useHospitalAuthModal } from "@/hooks/useHospitalAuthModal";
import { HospitalAuthModal } from "@/components/ui/HospitalAuthModal";

export default function ResumesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, userType, isLoading: isAuthLoading } = useHospitalAuth();
  const { isModalOpen, closeModal, modalReturnUrl } = useHospitalAuthModal();

  // 모든 Hooks를 early return 이전에 호출
  // Zustand 스토어에서 좋아요 상태 관리
  const {
    setResumeLike,
    toggleResumeLike,
    isResumeLiked,
    likedResumes,
  } = useLikeStore();

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

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // 좋아요 요청 상태 관리 (동시 요청 방지)
  const [likingResumes, setLikingResumes] = useState<Set<string>>(new Set());
  
  // 스토어 초기화 상태 추적
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);

  // API 데이터 가져오기 (전체 데이터를 가져온 후 클라이언트에서 필터링)
  const {
    data: apiData,
    isLoading,
    error,
  } = useResumes({
    page: 1, // 전체 데이터를 가져오기 위해 첫 페이지부터
    limit: 1000, // 충분히 큰 수로 설정
    sort: appliedFilters.sortBy === "recent" ? "latest" : appliedFilters.sortBy,
  });


  // 초기 좋아요 상태 동기화 (Zustand 스토어 사용)
  React.useEffect(() => {
    if (apiData?.data) {
      console.log(
        "[ResumesPage] 모든 이력서의 좋아요 상태 초기화 시작"
      );
      
      // 모든 이력서에 대해 좋아요 상태를 명시적으로 설정
      apiData.data.forEach((resume: any) => {
        setResumeLike(resume.id, resume.isLiked || false);
        console.log(
          `[ResumesPage] ${resume.id}: ${resume.isLiked ? "좋아요됨" : "좋아요안됨"}`
        );
      });
      
      setIsStoreInitialized(true);
    }
  }, [apiData, setResumeLike]);

  // URL에서 필터 상태 초기화
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    const { page, ...filterData } = urlFilters;

    setAppliedFilters(filterData);
    setTempFilters(filterData);
    setCurrentPage(page);
  }, [searchParams]);

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

  // 지역 이름 한국어 맵핑 함수
  const getKoreanRegionName = (englishName: string) => {
    if (!englishName) return "";

    const regionMap: { [key: string]: string } = {
      seoul: "서울",
      busan: "부산",
      daegu: "대구",
      incheon: "인천",
      gwangju: "광주",
      daejeon: "대전",
      ulsan: "울산",
      gyeonggi: "경기",
      gangwon: "강원",
      chungbuk: "충북",
      chungnam: "충남",
      jeonbuk: "전북",
      jeonnam: "전남",
      gyeongbuk: "경북",
      gyeongnam: "경남",
      jeju: "제주",
      sejong: "세종",
      // 영어 전체 이름도 추가
      "seoul-si": "서울",
      "seoul-city": "서울",
      "busan-si": "부산",
      "busan-city": "부산",
      "gyeonggi-do": "경기",
      "gyeonggi-province": "경기",
      // 이미 한국어인 경우도 처리
      서울: "서울",
      부산: "부산",
      대구: "대구",
      인천: "인천",
      광주: "광주",
      대전: "대전",
      울산: "울산",
      경기: "경기",
      강원: "강원",
      충북: "충북",
      충남: "충남",
      전북: "전북",
      전남: "전남",
      경북: "경북",
      경남: "경남",
      제주: "제주",
      세종: "세종",
    };

    // 소문자로 변환해서 매핑 시도
    const lowerCase = englishName.toLowerCase().trim();
    const mapped = regionMap[lowerCase];

    // 매핑된 값이 있으면 반환, 없으면 원본 반환
    return mapped || englishName;
  };

  // 태그 한국어 맵핑 함수
  const getKoreanLabel = (keyword: string) => {
    const labelMap: { [key: string]: string } = {
      // 전공 분야 (specialties)
      internal: "내과",
      surgery: "외과",
      dermatology: "피부과",
      orthopedics: "정형외과",
      ophthalmology: "안과",
      dentistry: "치과",
      emergency: "응급의학과",
      cardiology: "심장내과",
      neurology: "신경과",
      oncology: "종양학과",
      anesthesiology: "마취과",
      radiology: "영상의학과",
      pathology: "병리과",
      laboratory: "임상병리과",

      // 직무 (position)
      veterinarian: "수의사",
      assistant: "수의테크니션",
      manager: "병원장",
      intern: "인턴",
      resident: "전공의",

      // 근무 형태 (workTypes)
      "full-time": "정규직",
      "part-time": "파트타임",
      contract: "계약직",
      freelance: "프리랜서",
      internship: "인턴십",

      // 숙련도 (proficiency)
      beginner: "초급",
      intermediate: "중급",
      advanced: "고급",
      expert: "전문가",
    };

    return labelMap[keyword.toLowerCase()] || keyword;
  };

  // 필터링 로직 (API 데이터 직접 사용, 빈 값으로 기본값 설정)
  const getFilteredData = () => {
    if (!apiData?.data) return [];

    // 경력 계산 함수
    const calculateExperience = (experiences: any[]) => {
      if (!experiences || experiences.length === 0) return "경력 없음";

      let totalMonths = 0;
      experiences.forEach((exp) => {
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
          totalMonths += months;
        }
      });

      if (totalMonths === 0) return "경력 없음";

      const years = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;

      if (years === 0) return `${remainingMonths}개월`;
      if (remainingMonths === 0) return `${years}년`;
      return `${years}년 ${remainingMonths}개월`;
    };

    // API 데이터를 ResumeCard 형식에 맞게 변환하되 빈 값으로 기본값 설정
    const convertedData = apiData.data.map((resume: any) => ({
      id: resume.id,
      name: resume.name || "",
      experience: calculateExperience(resume.experiences),
      preferredLocation:
        resume.preferredRegions
          ?.map((region: string) => getKoreanRegionName(region))
          .join(", ") || "",
      keywords: [
        ...(resume.specialties || []),
        ...(resume.workTypes || []),
        ...(resume.position ? [resume.position] : []),
      ]
        .filter(Boolean)
        .map((keyword: string) => getKoreanLabel(keyword)),
      lastAccessDate: new Date(resume.updatedAt)
        .toLocaleDateString("ko-KR")
        .replace(/\//g, "."),
      lastLoginAt: resume.lastLoginAt || null, // 최근 로그인 정보 추가
      profileImage: resume.photo || undefined,
      createdAt: new Date(resume.createdAt),
      // 원본 데이터도 보관 (필터링용)
      originalData: resume,
    }));

    let filtered = [...convertedData];

    // 키워드 검색
    if (appliedFilters.searchKeyword.trim()) {
      const keyword = appliedFilters.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(
        (resume) =>
          resume.name.toLowerCase().includes(keyword) ||
          resume.preferredLocation.toLowerCase().includes(keyword) ||
          resume.keywords.some((k: string) =>
            k.toLowerCase().includes(keyword)
          ) ||
          resume.originalData.introduction?.toLowerCase().includes(keyword)
      );
    }

    // 근무 형태 필터
    if (appliedFilters.workType.length > 0) {
      filtered = filtered.filter((resume) =>
        appliedFilters.workType.some((type) => {
          const workTypes = resume.originalData.workTypes || [];
          // 한국어로 저장되므로 직접 비교
          return (
            workTypes.includes(type) ||
            // 영어로 저장된 경우를 위한 변환
            workTypes.some((wt: string) => getKoreanLabel(wt) === type)
          );
        })
      );
    }

    // 경력 필터
    if (appliedFilters.experience.length > 0) {
      filtered = filtered.filter((resume) => {
        const experienceText = resume.experience;

        return appliedFilters.experience.some((expFilter) => {
          switch (expFilter) {
            case "신입":
              return experienceText === "경력 없음";
            case "1-3년":
              // 1년 이상 3년 미만
              if (experienceText.includes("년")) {
                const years = parseInt(
                  experienceText.match(/(\d+)년/)?.[1] || "0"
                );
                return years >= 1 && years < 3;
              }
              return false;
            case "3-5년":
              // 3년 이상 5년 미만
              if (experienceText.includes("년")) {
                const years = parseInt(
                  experienceText.match(/(\d+)년/)?.[1] || "0"
                );
                return years >= 3 && years < 5;
              }
              return false;
            case "5년 이상":
              // 5년 이상
              if (experienceText.includes("년")) {
                const years = parseInt(
                  experienceText.match(/(\d+)년/)?.[1] || "0"
                );
                return years >= 5;
              }
              return false;
            default:
              return false;
          }
        });
      });
    }

    // 자격증 필터 (직무로 매핑)
    if (appliedFilters.certificate && appliedFilters.certificate !== "all") {
      filtered = filtered.filter((resume) => {
        const position = resume.originalData.position;
        // 영어와 한국어 둘 다 확인
        return (
          position === appliedFilters.certificate ||
          getKoreanLabel(position) === appliedFilters.certificate
        );
      });
    }

    // 지역 필터
    if (appliedFilters.location && appliedFilters.location !== "all") {
      filtered = filtered.filter((resume) => {
        const preferredRegions = resume.originalData.preferredRegions || [];

        return preferredRegions.some((region: string) => {
          // 영어 키에서 한국어로 변환해서 비교
          const koreanRegion = getKoreanRegionName(region);

          // 정확한 매칭: 영어 -> 한국어 변환 후 비교
          return (
            koreanRegion === appliedFilters.location ||
            region === appliedFilters.location ||
            // 포함 관계도 확인 (ex: "서울 강남구"에서 "서울" 찾기)
            koreanRegion.includes(appliedFilters.location) ||
            region.toLowerCase().includes(appliedFilters.location.toLowerCase())
          );
        });
      });
    }

    // 정렬
    switch (appliedFilters.sortBy) {
      case "recent":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
    setCurrentPage(1);
    updateURL(resetFilters, 1);
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

  // 이력서 좋아요/취소 토글 핸들러 (Zustand 스토어 사용)
  const handleResumeLike = async (resumeId: string) => {
    // 이미 처리 중인 경우 무시
    if (likingResumes.has(resumeId)) {
      console.log(`[ResumesPage Like] ${resumeId} - 이미 처리 중, 요청 무시`);
      return;
    }

    const isCurrentlyLiked = isResumeLiked(resumeId);

    console.log(
      `[ResumesPage Like] ${resumeId} - 현재 상태: ${
        isCurrentlyLiked ? "좋아요됨" : "좋아요안됨"
      } -> ${isCurrentlyLiked ? "좋아요 취소" : "좋아요"}`
    );

    // 요청 시작 상태로 설정
    setLikingResumes(prev => new Set(prev).add(resumeId));

    // 낙관적 업데이트: UI를 먼저 변경
    toggleResumeLike(resumeId);

    try {
      const method = isCurrentlyLiked ? "DELETE" : "POST";
      const actionText = isCurrentlyLiked ? "좋아요 취소" : "좋아요";

      console.log(
        `[ResumesPage Like] API 요청: ${method} /api/resumes/${resumeId}/like`
      );

      const response = await fetch(`/api/resumes/${resumeId}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // 쿠키 포함
      });

      console.log(
        `[ResumesPage Like] API 응답: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        let result: any = {};
        let responseText = '';
        
        try {
          responseText = await response.text();
          if (responseText) {
            result = JSON.parse(responseText);
          }
        } catch (parseError) {
          console.warn(`[ResumesPage Like] 응답 파싱 실패:`, parseError);
          console.warn(`[ResumesPage Like] 원본 응답:`, responseText);
        }

        console.error(`[ResumesPage Like] ${actionText} 실패:`, {
          status: response.status,
          statusText: response.statusText,
          result,
          responseText
        });

        // 오류 발생 시 상태 롤백
        setResumeLike(resumeId, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn("이력서를 찾을 수 없습니다:", resumeId);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes("이미 좋아요한")) {
            console.log(
              `[ResumesPage Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`
            );
            setResumeLike(resumeId, true);
            return;
          }
          console.warn(`${actionText} 실패:`, result.message);
          return;
        } else if (response.status === 401) {
          console.warn("로그인이 필요합니다.");
          alert("로그인이 필요합니다.");
          router.push("/member-select");
          return;
        }
        throw new Error(result.message || `${actionText} 요청에 실패했습니다.`);
      }

      const result = await response.json();
      console.log(`[ResumesPage Like] ${actionText} 성공:`, result);
    } catch (error) {
      console.error(
        `[ResumesPage Like] ${
          isCurrentlyLiked ? "좋아요 취소" : "좋아요"
        } 오류:`,
        error
      );

      // 오류 발생 시 상태 롤백
      setResumeLike(resumeId, isCurrentlyLiked);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      // 요청 완료 후 상태 해제
      setLikingResumes(prev => {
        const newSet = new Set(prev);
        newSet.delete(resumeId);
        return newSet;
      });
    }
  };

  return (
    <>
      {/* 로딩 상태 처리 */}
      {isLoading && (
        <main className="pt-[50px] bg-white">
          <div className="max-w-[1440px] mx-auto px-[16px] py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-key1 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">
                  이력서 목록을 불러오는 중...
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 에러 상태 처리 */}
      {error && (
        <main className="pt-[50px] bg-white">
          <div className="max-w-[1440px] mx-auto px-[16px] py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">오류가 발생했습니다</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-key1 text-white rounded-md hover:bg-key1/90"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 정상 상태 처리 */}
      {!isLoading && !error && (
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
                    { value: "수의테크니션", label: "수의테크니션" },
                    { value: "병원장", label: "병원장" },
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
                <h1 className="text-[28px] font-title title-bold text-[#3B394D]">
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
                    lastLoginAt={resume.lastLoginAt}
                    isBookmarked={isStoreInitialized ? likedResumes.has(resume.id) : (resume.originalData?.isLiked || false)}
                    profileImage={resume.profileImage}
                    onClick={() => {
                      window.location.href = `/resumes/${resume.id}`;
                    }}
                    onBookmarkClick={() => {
                      handleResumeLike(resume.id);
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
                <h1 className="font-title text-[28px] title-bold text-[#3B394D]">
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
              <div className="flex flex-wrap gap-[20px]">
                {resumeData.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    name={resume.name}
                    experience={resume.experience}
                    preferredLocation={resume.preferredLocation}
                    keywords={resume.keywords}
                    lastAccessDate={resume.lastAccessDate}
                    lastLoginAt={resume.lastLoginAt}
                    isBookmarked={isStoreInitialized ? likedResumes.has(resume.id) : (resume.originalData?.isLiked || false)}
                    profileImage={resume.profileImage}
                    onClick={() => {
                      window.location.href = `/resumes/${resume.id}`;
                    }}
                    onBookmarkClick={() => {
                      handleResumeLike(resume.id);
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
                          { value: "수의테크니션", label: "수의테크니션" },
                          { value: "병원장", label: "병원장" },
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
      )}
      
      {/* 병원 인증 모달 */}
      <HospitalAuthModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        returnUrl={modalReturnUrl}
      />
    </>
  );
}
