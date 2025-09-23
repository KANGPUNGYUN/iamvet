"use client";

import { Tab } from "@/components/ui/Tab";
import {
  ArrowRightIcon,
  PlusIcon,
} from "public/icons";
import banner1Img from "@/assets/images/banner1.png";
import banner2Img from "@/assets/images/banner2.png";
import banner3Img from "@/assets/images/banner3.png";
import lightbombImg from "@/assets/images/lightbomb.png";
import hospitalImg from "@/assets/images/hospital.png";
import lecture1Img from "@/assets/images/lecture/lecture1.png";
import AdvertisementSlider from "@/components/ui/AdvertisementSlider";
import { advertisementsData } from "@/data/advertisementsData";
import { useState } from "react";
import BannerSlider, {
  BannerItem,
} from "@/components/features/main/BannerSlider";
import AITalentButton from "@/components/features/main/AITalentButton";
import JobFamousList from "@/components/features/main/JobFamousList";
import JobInfoCard from "@/components/ui/JobInfoCard";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import LectureCard from "@/components/ui/LectureCard/LectureCard";
import Link from "next/link";
import { useResumes } from "@/hooks/useResumes";
import { useJobs } from "@/hooks/useJobs";
import { useLectures } from "@/hooks/api/useLectures";
import { useTransfers } from "@/hooks/api/useTransfers";
import { useLikeStore } from "@/stores/likeStore";
import React from "react";

export default function HomePage() {
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

  // 이력서 목록 조회
  const { data: resumesData, isLoading: resumesLoading } = useResumes({
    limit: 5,
    sort: "latest",
  });

  // 채용공고 목록 조회
  const { data: jobsData, isLoading: jobsLoading } = useJobs({
    limit: 5,
    sort: "latest",
  });

  // 인기 카테고리별 강의 조회 (조회수 기준)
  const { data: emergencyLecturesData, isLoading: emergencyLoading } =
    useLectures({
      medicalField: "emergency",
      sort: "view",
      limit: 4,
    });

  const { data: dermatologyLecturesData, isLoading: dermatologyLoading } =
    useLectures({
      medicalField: "dermatology",
      sort: "view",
      limit: 4,
    });

  const { data: internalLecturesData, isLoading: internalLoading } =
    useLectures({
      medicalField: "internal",
      sort: "view",
      limit: 4,
    });

  // API 응답에서 실제 데이터 추출
  const emergencyLectures = emergencyLecturesData?.data?.lectures?.data || [];
  const dermatologyLectures =
    dermatologyLecturesData?.data?.lectures?.data || [];
  const internalLectures = internalLecturesData?.data?.lectures?.data || [];

  // 구직정보 데이터는 useResumes 훅에서 가져옴

  // 현재 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState("internal");

  // 양수양도 데이터 API 조회 (최대 32개 가져와서 카테고리별로 8개씩 분배)
  const {
    data: transfersData,
    isLoading: transfersLoading,
    error: transfersError,
  } = useTransfers({
    limit: 32,
    sort: "latest",
  });

  // API 응답에서 실제 데이터 추출 및 카테고리별 필터링
  const allTransfers = transfersData?.data?.transfers || [];

  // 디버깅을 위한 로그
  React.useEffect(() => {
    if (transfersData) {
      console.log("[HomePage] Transfers data received:", transfersData);
      console.log("[HomePage] All transfers count:", allTransfers.length);
      console.log("[HomePage] First transfer item:", allTransfers[0]);

      // 카테고리별 개수 확인
      const hospitalCount = allTransfers.filter(
        (item: any) => item.category === "hospital"
      ).length;
      const machineCount = allTransfers.filter(
        (item: any) => item.category === "machine"
      ).length;
      const deviceCount = allTransfers.filter(
        (item: any) => item.category === "device"
      ).length;
      const interiorCount = allTransfers.filter(
        (item: any) => item.category === "interior"
      ).length;

      console.log("[HomePage] Category counts:", {
        hospital: hospitalCount,
        machine: machineCount,
        device: deviceCount,
        interior: interiorCount,
      });

      // 실제 카테고리 값들 확인
      const uniqueCategories = Array.from(
        new Set(allTransfers.map((item: any) => item.category))
      );
      console.log("[HomePage] Unique categories found:", uniqueCategories);
    }
    if (transfersError) {
      console.error("[HomePage] Transfers error:", transfersError);
    }
  }, [transfersData, transfersError, allTransfers.length]);

  const hospitalTransfers = allTransfers
    .filter((item: any) => item.category === "병원양도")
    .slice(0, 8);

  const machineTransfers = allTransfers
    .filter((item: any) => item.category === "기계장치")
    .slice(0, 8);

  const deviceTransfers = allTransfers
    .filter((item: any) => item.category === "의료장비")
    .slice(0, 8);

  const interiorTransfers = allTransfers
    .filter((item: any) => item.category === "인테리어")
    .slice(0, 8);




  const handleAITalentSearch = () => {
    console.log("AI로 인재 찾기 클릭");
    window.location.href = "/resumes";
  };

  const handleAIHospitalSearch = () => {
    console.log("AI로 병원 찾기 클릭");
    window.location.href = "/jobs";
  };

  // Zustand 스토어에서 좋아요 상태 관리
  const {
    likedResumes,
    likedJobs,
    setResumeLike,
    setJobLike,
    toggleResumeLike,
    toggleJobLike,
    initializeResumeLikes,
    initializeJobLikes,
    isResumeLiked,
    isJobLiked
  } = useLikeStore();

  // 초기 좋아요 상태 동기화 (Zustand 스토어 사용)
  React.useEffect(() => {
    const resumes = resumesData?.data || [];
    if (resumes.length > 0) {
      const likedResumeIds = resumes
        .filter((resume: any) => resume.isLiked)
        .map((resume: any) => resume.id);
      
      if (likedResumeIds.length > 0) {
        console.log('[Resume Like] 서버에서 받은 좋아요 이력서:', likedResumeIds);
        initializeResumeLikes(likedResumeIds);
      }
    }
  }, [resumesData, initializeResumeLikes]);

  React.useEffect(() => {
    const jobs = jobsData?.data?.jobs || [];
    if (jobs.length > 0) {
      const likedJobIds = jobs
        .filter((job: any) => job.isLiked)
        .map((job: any) => job.id);
      
      if (likedJobIds.length > 0) {
        console.log('[Job Like] 서버에서 받은 좋아요 채용공고:', likedJobIds);
        initializeJobLikes(likedJobIds);
      }
    }
  }, [jobsData, initializeJobLikes]);

  // 이력서 좋아요/취소 토글 핸들러 (Zustand 스토어 사용)
  const handleResumeLike = async (resumeId: string | number) => {
    const id = resumeId.toString();
    const isCurrentlyLiked = isResumeLiked(id);
    
    console.log(`[Resume Like] ${id} - 현재 상태: ${isCurrentlyLiked ? '좋아요됨' : '좋아요안됨'} -> ${isCurrentlyLiked ? '좋아요 취소' : '좋아요'}`);
    
    // 낙관적 업데이트: UI를 먼저 변경
    toggleResumeLike(id);

    try {
      const method = isCurrentlyLiked ? 'DELETE' : 'POST';
      const actionText = isCurrentlyLiked ? '좋아요 취소' : '좋아요';
      
      console.log(`[Resume Like] API 요청: ${method} /api/resumes/${resumeId}/like`);
      
      const response = await fetch(`/api/resumes/${resumeId}/like`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`[Resume Like] ${actionText} 실패:`, result);
        
        // 오류 발생 시 상태 롤백
        setResumeLike(id, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn('이력서를 찾을 수 없습니다:', resumeId);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes('이미 좋아요한')) {
            console.log(`[Resume Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`);
            setResumeLike(id, true);
            return;
          }
          console.warn(`${actionText} 실패:`, result.message);
          return;
        } else if (response.status === 401) {
          console.warn('로그인이 필요합니다.');
          return;
        }
        throw new Error(result.message || `${actionText} 요청에 실패했습니다.`);
      }

      console.log(`[Resume Like] ${actionText} 성공:`, result);
    } catch (error) {
      console.error(`[Resume Like] ${isCurrentlyLiked ? '좋아요 취소' : '좋아요'} 오류:`, error);
      
      // 오류 발생 시 상태 롤백
      setResumeLike(id, isCurrentlyLiked);
    }
  };

  // 채용공고 좋아요/취소 토글 핸들러 (Zustand 스토어 사용)
  const handleJobLike = async (jobId: string | number) => {
    const id = jobId.toString();
    const isCurrentlyLiked = isJobLiked(id);
    
    console.log(`[Job Like] ${id} - 현재 상태: ${isCurrentlyLiked ? '좋아요됨' : '좋아요안됨'} -> ${isCurrentlyLiked ? '좋아요 취소' : '좋아요'}`);
    
    // 낙관적 업데이트: UI를 먼저 변경
    toggleJobLike(id);

    try {
      const method = isCurrentlyLiked ? 'DELETE' : 'POST';
      const actionText = isCurrentlyLiked ? '좋아요 취소' : '좋아요';
      
      console.log(`[Job Like] API 요청: ${method} /api/jobs/${jobId}/like`);
      
      const response = await fetch(`/api/jobs/${jobId}/like`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`[Job Like] ${actionText} 실패:`, result);
        
        // 오류 발생 시 상태 롤백
        setJobLike(id, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn('채용공고를 찾을 수 없습니다:', jobId);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes('이미 좋아요한')) {
            console.log(`[Job Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`);
            setJobLike(id, true);
            return;
          }
          console.warn(`${actionText} 실패:`, result.message);
          return;
        } else if (response.status === 401) {
          console.warn('로그인이 필요합니다.');
          return;
        }
        throw new Error(result.message || `${actionText} 요청에 실패했습니다.`);
      }

      console.log(`[Job Like] ${actionText} 성공:`, result);
    } catch (error) {
      console.error(`[Job Like] ${isCurrentlyLiked ? '좋아요 취소' : '좋아요'} 오류:`, error);
      
      // 오류 발생 시 상태 롤백
      setJobLike(id, isCurrentlyLiked);
    }
  };

  const sampleBanners: BannerItem[] = [
    {
      id: "1",
      imageUrl: banner1Img,
      alt: "첫 번째 배너",
      buttonText: "확인하러 가기",
      buttonLink: "/member-select",
    },
    {
      id: "2",
      imageUrl: banner2Img,
      alt: "두 번째 배너",
      buttonText: "확인하러 가기",
      buttonLink: "/member-select",
    },
    {
      id: "3",
      imageUrl: banner3Img,
      alt: "세 번째 배너",
      buttonText: "확인하러 가기",
      buttonLink: "/member-select",
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto md:px-[60px] py-[30px] px-[15px]">
          {/* 데스크톱: 가로 배치, 모바일: 세로 배치 */}
          <div className="flex flex-col xl:flex-row xl:items-start xl:gap-[30px] gap-8">
            <div className="flex-1 max-w-[982px]">
              <BannerSlider
                banners={sampleBanners}
                autoSlideInterval={4000}
                showButton={true}
              />
            </div>

            <div className="flex items-center xl:items-start gap-[12px] xl:flex-shrink-0 xl:flex-col flex-col-reverse xl:w-auto w-full">
              <div className="flex flex-col gap-[12px] xl:w-auto w-full">
                <AITalentButton
                  title="AI로 인재 찾기"
                  description="AI로 인재를 찾아 고용해보세요!"
                  variant="lightbomb"
                  imageSrc={lightbombImg.src}
                  onClick={handleAITalentSearch}
                />

                <AITalentButton
                  title="AI로 병원 찾기"
                  description="필요한 병원을 빠르고 신속하게!"
                  variant="hospital"
                  imageSrc={hospitalImg.src}
                  onClick={handleAIHospitalSearch}
                />
              </div>
              <JobFamousList />
            </div>
          </div>
          <Tab
            defaultTab="internal"
            variant="default"
            className="bg-box-light xl:px-[32px] py-[36px] px-[16px] rounded-[16px] mt-[30px]"
            onTabChange={setActiveTab}
          >
            <Tab.List className="flex md:justify-between md:items-center flex-col md:flex-row gap-[16px] md:gap-0">
              <div className="flex gap-4">
                <Tab.Item value="internal">구직정보</Tab.Item>
                <Tab.Item value="surgery">구인정보</Tab.Item>
              </div>
              <Link
                className="flex font-title title-light text-[16px] text-sub hover:underline self-end md:self-auto"
                href={activeTab === "internal" ? "/resumes" : "/jobs"}
              >
                {<PlusIcon size="21" />} 전체보기
              </Link>
            </Tab.List>
            <Tab.Content value="internal">
              <div className="flex items-start gap-[10px] overflow-x-auto custom-scrollbar pb-4">
                {resumesLoading
                  ? // 로딩 스켈레톤
                    [...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-sm w-[294px] h-[310px] flex-shrink-0 animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))
                  : (() => {
                      const resumes = resumesData?.data || [];
                      const emptyCards = 5 - resumes.length;

                      return (
                        <>
                          {resumes.map((resume) => {
                            // 한국어 라벨 변환
                            const getKoreanLabel = (keyword: string) => {
                              const labelMap: { [key: string]: string } = {
                                internal: "내과",
                                surgery: "외과",
                                dermatology: "피부과",
                                orthopedics: "정형외과",
                                veterinarian: "수의사",
                                assistant: "수의테크니션",
                                manager: "병원장",
                                beginner: "초급",
                                intermediate: "중급",
                                advanced: "고급",
                                expert: "전문가",
                              };
                              return (
                                labelMap[keyword?.toLowerCase()] || keyword
                              );
                            };

                            // 태그 준비
                            const tags = resume.specialties
                              ? resume.specialties
                                  .map((spec) => getKoreanLabel(spec))
                                  .slice(0, 5)
                              : [];

                            // 위치 정보
                            const location =
                              resume.preferredRegions &&
                              resume.preferredRegions.length > 0
                                ? getKoreanRegionName(
                                    resume.preferredRegions[0]
                                  )
                                : "지역 미정";

                            // 경력 정보
                            const position = resume.position
                              ? getKoreanLabel(resume.position)
                              : "수의사";

                            // 날짜 계산 (수정일로부터 며칠 지났는지)
                            const updatedDate = new Date(
                              resume.updatedAt || resume.createdAt
                            );
                            const today = new Date();
                            const diffTime =
                              today.getTime() - updatedDate.getTime();
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            const dDay = diffDays;

                            return (
                              <JobInfoCard
                                key={resume.id}
                                id={resume.id}
                                hospital={resume.name}
                                dDay={dDay}
                                position={position}
                                location={location}
                                jobType="구직자"
                                tags={tags}
                                isBookmarked={false}
                                isLiked={isResumeLiked(resume.id)}
                                onLike={handleResumeLike}
                                onClick={() =>
                                  (window.location.href = `/resumes/${resume.id}`)
                                }
                              />
                            );
                          })}
                          {/* 빈 카드 채우기 */}
                          {emptyCards > 0 &&
                            [...Array(emptyCards)].map((_, i) => (
                              <div
                                key={`empty-resume-${i}`}
                                className="bg-gray-200 rounded-xl border border-gray-200 p-6 max-w-sm w-[294px] h-[310px] flex-shrink-0 opacity-50"
                              ></div>
                            ))}
                        </>
                      );
                    })()}
              </div>
            </Tab.Content>
            <Tab.Content value="surgery">
              <div className="flex items-start gap-[10px] overflow-x-auto custom-scrollbar pb-4">
                {jobsLoading
                  ? // 로딩 스켈레톤
                    [...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-sm w-[294px] h-[310px] flex-shrink-0 animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))
                  : (() => {
                      const jobs = jobsData?.data?.jobs || [];
                      const emptyCards = 5 - jobs.length;

                      return (
                        <>
                          {jobs.map((job: any) => {
                            return (
                              <JobInfoCard
                                key={job.id}
                                id={job.id}
                                hospital={job.hospital?.name || job.hospital}
                                dDay={job.dDay || 0}
                                position={job.title}
                                location={job.location}
                                jobType={job.employmentType || job.jobType}
                                tags={job.specialties || job.tags || []}
                                isBookmarked={job.isBookmarked || false}
                                isLiked={isJobLiked(job.id)}
                                onLike={handleJobLike}
                                onClick={() =>
                                  (window.location.href = `/jobs/${job.id}`)
                                }
                              />
                            );
                          })}
                          {/* 빈 카드 채우기 */}
                          {emptyCards > 0 &&
                            [...Array(emptyCards)].map((_, i) => (
                              <div
                                key={`empty-job-${i}`}
                                className="bg-gray-200 rounded-xl border border-gray-200 p-6 max-w-sm w-[294px] h-[310px] flex-shrink-0 opacity-50"
                              ></div>
                            ))}
                        </>
                      );
                    })()}
              </div>
            </Tab.Content>
            <Tab.Content value="regular">
              <div className="p-4">
                <h4 className="font-semibold mb-2">정규직 정보</h4>
                <p>정규직 채용 관련 정보를 확인하실 수 있습니다.</p>
              </div>
            </Tab.Content>
          </Tab>

          {/* 광고 슬라이더 섹션 */}
          <section className="pt-[40px] md:pt-[42px]">
            <AdvertisementSlider
              advertisements={advertisementsData}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          </section>

          {/* 기존 강의 섹션을 이 코드로 교체 */}
          <section className="py-[60px]">
            <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-[16px] md:gap-0 mb-[30px]">
              <h3 className="font-title text-[28px] md:text-[44px] title-bold">
                주요 분야 인기 강좌
              </h3>
              <Link
                className="flex font-title title-light text-[16px] text-sub hover:underline items-center gap-1 self-end md:self-auto"
                href="/lectures"
              >
                <PlusIcon size="21" /> 전체보기
              </Link>
            </div>

            {/* 응급의학 강의 섹션 */}
            <div className="relative mb-[60px] md:mb-[120px] h-auto md:h-[400px]">
              {/* 카테고리 카드 - 핑크 */}
              <div
                className="relative md:absolute z-10 w-full md:w-[366px] h-auto md:h-[289px] p-[0px] md:p-[24px] md:pr-[113px] md:pb-[24px] flex flex-col justify-center items-start gap-[20px] md:gap-[102px] rounded-[16px] bg-transparent md:bg-[#FF8796] md:cursor-pointer md:shadow-lg mb-[20px] md:mb-0"
                onClick={() =>
                  (window.location.href = "/lectures?medicalField=emergency")
                }
              >
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-title title-light text-[22px] md:text-[28px] text-[#3B394D] md:text-white mb-[px] leading-[135%]">
                    응급의학
                  </h4>
                  <p className="hidden md:block font-text text-[14px] md:text-[16px] text-regular text-white opacity-90">
                    응급 상황 대처부터 응급수술까지
                    <br />
                    응급의학 전문 역량을 쌓습니다
                  </p>
                </div>
                <button className="hidden md:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] border border-white bg-white bg-opacity-20 rounded-full items-center justify-center hover:bg-opacity-30 transition-all duration-200">
                  <ArrowRightIcon currentColor="white" size="16px" />
                </button>
              </div>

              {/* 강의 리스트 */}
              <div className="relative md:absolute z-20 md:top-[150px] md:left-[213px] flex items-center gap-[16px] overflow-x-auto custom-scrollbar">
                {emergencyLoading
                  ? // 로딩 스켈레톤
                    [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[294px] h-[240px] bg-gray-200 rounded-xl animate-pulse flex-shrink-0"
                      ></div>
                    ))
                  : emergencyLectures.map((lecture: any) => (
                      <LectureCard
                        key={lecture.id}
                        title={lecture.title}
                        date={new Date(lecture.createdAt).toLocaleDateString(
                          "ko-KR"
                        )}
                        views={lecture.viewCount || 0}
                        category={lecture.category}
                        imageUrl={lecture.thumbnailUrl || lecture1Img.src}
                        isLiked={lecture.isLiked || false}
                        onClick={() =>
                          (window.location.href = `/lectures/${lecture.id}`)
                        }
                      />
                    ))}
              </div>
            </div>

            {/* 피부과 섹션 */}
            <div className="relative mb-[60px] md:mb-[120px] h-auto md:h-[400px]">
              {/* 카테고리 카드 - 흰색 */}
              <div
                className="relative md:absolute z-10 w-full md:w-[366px] h-auto md:h-[289px] p-[0px] md:p-[24px] md:pr-[113px] md:pb-[24px] flex flex-col justify-center items-start gap-[20px] md:gap-[102px] rounded-[16px] bg-transparent md:bg-box md:cursor-pointer md:shadow-lg mb-[20px] md:mb-0"
                onClick={() =>
                  (window.location.href = "/lectures?medicalField=dermatology")
                }
              >
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-title title-light text-[22px] md:text-[28px] text-[#3B394D] md:text-black mb-[px] leading-[135%]">
                    피부과
                  </h4>
                  <p className="hidden md:block font-text text-[14px] md:text-[16px] text-regular text-[#6B6B6B]">
                    피부질환 진단부터 치료까지
                    <br />
                    피부과 전문 지식을 습득합니다
                  </p>
                </div>
                <button className="hidden md:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#F8F8F9] border border-[#FF8796] rounded-full items-center justify-center hover:bg-[#EFEFF0] transition-all duration-200">
                  <ArrowRightIcon currentColor="#3B394D" size="16px" />
                </button>
              </div>

              {/* 강의 리스트 */}
              <div className="relative md:absolute z-20 md:top-[150px] md:left-[213px] flex items-center gap-[16px] overflow-x-auto custom-scrollbar">
                {dermatologyLoading
                  ? // 로딩 스켈레톤
                    [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[294px] h-[240px] bg-gray-200 rounded-xl animate-pulse flex-shrink-0"
                      ></div>
                    ))
                  : dermatologyLectures.map((lecture: any) => (
                      <LectureCard
                        key={lecture.id}
                        title={lecture.title}
                        date={new Date(lecture.createdAt).toLocaleDateString(
                          "ko-KR"
                        )}
                        views={lecture.viewCount || 0}
                        category={lecture.category}
                        imageUrl={lecture.thumbnailUrl || lecture1Img.src}
                        isLiked={lecture.isLiked || false}
                        onClick={() =>
                          (window.location.href = `/lectures/${lecture.id}`)
                        }
                      />
                    ))}
              </div>
            </div>

            {/* 내과 섹션 (세 번째) */}
            <div className="relative h-auto md:h-[400px]">
              {/* 카테고리 카드 - 핑크 */}
              <div
                className="relative md:absolute z-10 w-full md:w-[366px] h-auto md:h-[289px] p-[0px] md:p-[24px] md:pr-[113px] md:pb-[24px] flex flex-col justify-center items-start gap-[20px] md:gap-[102px] rounded-[16px] bg-transparent md:bg-[#FF8796] md:cursor-pointer md:shadow-lg mb-[20px] md:mb-0"
                onClick={() =>
                  (window.location.href = "/lectures?medicalField=internal")
                }
              >
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-title title-light text-[22px] md:text-[28px] text-[#3B394D] md:text-white mb-[px] leading-[135%]">
                    내과
                  </h4>
                  <p className="hidden md:block font-text text-[14px] md:text-[16px] text-regular text-white opacity-90">
                    내과 질환 진단부터 치료까지
                    <br />
                    내과 전문 지식을 체계적으로 학습합니다
                  </p>
                </div>
                <button className="hidden md:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] border border-white bg-white bg-opacity-20 rounded-full items-center justify-center hover:bg-opacity-30 transition-all duration-200">
                  <ArrowRightIcon currentColor="white" size="16px" />
                </button>
              </div>

              {/* 강의 리스트 */}
              <div className="relative md:absolute z-20 md:top-[150px] md:left-[213px] flex items-center gap-[16px] overflow-x-auto custom-scrollbar">
                {internalLoading
                  ? // 로딩 스켈레톤
                    [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[294px] h-[240px] bg-gray-200 rounded-xl animate-pulse flex-shrink-0"
                      ></div>
                    ))
                  : internalLectures.map((lecture: any) => (
                      <LectureCard
                        key={lecture.id}
                        title={lecture.title}
                        date={new Date(lecture.createdAt).toLocaleDateString(
                          "ko-KR"
                        )}
                        views={lecture.viewCount || 0}
                        category={lecture.category}
                        imageUrl={lecture.thumbnailUrl || lecture1Img.src}
                        isLiked={lecture.isLiked || false}
                        onClick={() =>
                          (window.location.href = `/lectures/${lecture.id}`)
                        }
                      />
                    ))}
              </div>
            </div>
          </section>

          <section className="py-[60px]">
            <h3 className="font-title text-[28px] md:text-[44px] title-bold mb-[47px] text-center">
              인기 양도 매물
            </h3>

            <Tab
              defaultTab="transfer"
              variant="filled"
              className="items-center"
            >
              <Tab.List className="flex justify-center">
                <Tab.Item value="transfer">병원 양도</Tab.Item>
                <Tab.Item value="machine">기계 장치</Tab.Item>
                <Tab.Item value="device">의료 장비</Tab.Item>
                <Tab.Item value="Interior">인테리어</Tab.Item>
              </Tab.List>

              <Tab.Content value="transfer">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {transfersLoading ? (
                    // 로딩 스켈레톤
                    [...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-xl h-[300px] animate-pulse"
                      ></div>
                    ))
                  ) : transfersError ? (
                    // 에러 상태
                    <div className="col-span-full text-center py-8 text-red-500">
                      <p>양수양도 데이터를 불러오는 중 오류가 발생했습니다.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        잠시 후 다시 시도해주세요.
                      </p>
                    </div>
                  ) : hospitalTransfers.length === 0 ? (
                    // 빈 데이터 상태
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>현재 등록된 병원 양도 매물이 없습니다.</p>
                    </div>
                  ) : (
                    hospitalTransfers.map((transfer: any) => (
                      <TransferCard
                        key={transfer.id}
                        id={transfer.id}
                        title={transfer.title}
                        location={transfer.location}
                        hospitalType={transfer.hospitalType}
                        area={transfer.area}
                        price={transfer.price}
                        categories={transfer.categories}
                        isAd={transfer.isAd}
                        date={transfer.createdAt}
                        views={transfer.views}
                        imageUrl={transfer.images?.[0] || ""}
                        isLiked={transfer.isLiked}
                        onLike={() => console.log("좋아요 클릭")}
                        onClick={() =>
                          (window.location.href = `/transfers/${transfer.id}`)
                        }
                      />
                    ))
                  )}
                </div>
                <div className="flex justify-center">
                  <Link
                    className="flex font-title title-light text-[16px] text-primary hover:underline items-center justfy-center px-[30px] py-[8px] border border-[1px] border-[#35313C] rounded-full"
                    href="/transfers"
                  >
                    {<PlusIcon size="21" />} 전체보기
                  </Link>
                </div>
              </Tab.Content>
              <Tab.Content value="machine">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {transfersLoading ? (
                    // 로딩 스켈레톤
                    [...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-xl h-[300px] animate-pulse"
                      ></div>
                    ))
                  ) : transfersError ? (
                    // 에러 상태
                    <div className="col-span-full text-center py-8 text-red-500">
                      <p>양수양도 데이터를 불러오는 중 오류가 발생했습니다.</p>
                    </div>
                  ) : machineTransfers.length === 0 ? (
                    // 빈 데이터 상태
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>현재 등록된 기계장치 양도 매물이 없습니다.</p>
                    </div>
                  ) : (
                    machineTransfers.map((transfer: any) => (
                      <TransferCard
                        key={transfer.id}
                        id={transfer.id}
                        title={transfer.title}
                        location={transfer.location}
                        hospitalType={transfer.hospitalType}
                        area={transfer.area}
                        price={transfer.price}
                        categories={transfer.categories}
                        isAd={transfer.isAd}
                        date={transfer.createdAt}
                        views={transfer.views}
                        imageUrl={transfer.images?.[0] || ""}
                        isLiked={transfer.isLiked}
                        onLike={() => console.log("좋아요 클릭")}
                        onClick={() =>
                          (window.location.href = `/transfers/${transfer.id}`)
                        }
                      />
                    ))
                  )}
                </div>
              </Tab.Content>
              <Tab.Content value="device">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {transfersLoading ? (
                    // 로딩 스켈레톤
                    [...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-xl h-[300px] animate-pulse"
                      ></div>
                    ))
                  ) : transfersError ? (
                    // 에러 상태
                    <div className="col-span-full text-center py-8 text-red-500">
                      <p>양수양도 데이터를 불러오는 중 오류가 발생했습니다.</p>
                    </div>
                  ) : deviceTransfers.length === 0 ? (
                    // 빈 데이터 상태
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>현재 등록된 의료장비 양도 매물이 없습니다.</p>
                    </div>
                  ) : (
                    deviceTransfers.map((transfer: any) => (
                      <TransferCard
                        key={transfer.id}
                        id={transfer.id}
                        title={transfer.title}
                        location={transfer.location}
                        hospitalType={transfer.hospitalType}
                        area={transfer.area}
                        price={transfer.price}
                        categories={transfer.categories}
                        isAd={transfer.isAd}
                        date={transfer.createdAt}
                        views={transfer.views}
                        imageUrl={transfer.images?.[0] || ""}
                        isLiked={transfer.isLiked}
                        onLike={() => console.log("좋아요 클릭")}
                        onClick={() =>
                          (window.location.href = `/transfers/${transfer.id}`)
                        }
                      />
                    ))
                  )}
                </div>
              </Tab.Content>
              <Tab.Content value="Interior">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {transfersLoading ? (
                    // 로딩 스켈레톤
                    [...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-xl h-[300px] animate-pulse"
                      ></div>
                    ))
                  ) : transfersError ? (
                    // 에러 상태
                    <div className="col-span-full text-center py-8 text-red-500">
                      <p>양수양도 데이터를 불러오는 중 오류가 발생했습니다.</p>
                    </div>
                  ) : interiorTransfers.length === 0 ? (
                    // 빈 데이터 상태
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>현재 등록된 인테리어 양도 매물이 없습니다.</p>
                    </div>
                  ) : (
                    interiorTransfers.map((transfer: any) => (
                      <TransferCard
                        key={transfer.id}
                        id={transfer.id}
                        title={transfer.title}
                        location={transfer.location}
                        hospitalType={transfer.hospitalType}
                        area={transfer.area}
                        price={transfer.price}
                        categories={transfer.categories}
                        isAd={transfer.isAd}
                        date={transfer.createdAt}
                        views={transfer.views}
                        imageUrl={transfer.images?.[0] || ""}
                        isLiked={transfer.isLiked}
                        onLike={() => console.log("좋아요 클릭")}
                        onClick={() =>
                          (window.location.href = `/transfers/${transfer.id}`)
                        }
                      />
                    ))
                  )}
                </div>
              </Tab.Content>
            </Tab>
          </section>
        </div>
      </div>
    </>
  );
}
