"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  LocationIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  WalletIcon,
} from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import JobInfoCard from "@/components/ui/JobInfoCard";
import HospitalCard from "@/components/ui/HospitalCard";
import { useJobDetail } from "@/hooks/api/useJobDetail";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/api/useAuth";
import { useHasDetailedResume } from "@/hooks/api/useDetailedResume";
import { useLikeStore } from "@/stores/likeStore";
import { useViewCountStore } from "@/stores/viewCountStore";
import axios from "axios";

// 토큰 만료 시 localStorage 정리
const clearExpiredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [resumeRequiredModalOpen, setResumeRequiredModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const router = useRouter();
  const { id } = use(params);
  const { data: jobData, isLoading, error, isError } = useJobDetail(id);

  const authStore = useAuthStore();
  const { user, isAuthenticated } = useAuth();

  // Zustand 스토어에서 좋아요 상태 관리
  const { setJobLike, toggleJobLike, isJobLiked } = useLikeStore();

  // Zustand 스토어에서 조회수 상태 관리
  const {
    setJobViewCount,
    incrementJobViewCount,
    getJobViewCount,
    markAsViewed,
    isAlreadyViewed,
  } = useViewCountStore();
  const {
    hasResume,
    isLoading: isResumeLoading,
    error: resumeError,
  } = useHasDetailedResume();

  // 초기 좋아요 상태 동기화
  useEffect(() => {
    if (jobData && jobData.isLiked) {
      console.log("[JobDetail] 서버에서 받은 좋아요 채용공고:", id);
      setJobLike(id, true);
    }
  }, [jobData, id, setJobLike]);

  // 조회수 초기화 및 실시간 증가 처리
  useEffect(() => {
    if (jobData) {
      console.log("[JobDetail] 서버에서 받은 채용공고 데이터:", {
        id,
        viewCount: jobData.viewCount,
      });

      // 조회수 초기화 및 실시간 증가 처리
      if (jobData.viewCount !== undefined) {
        // 서버에서 받은 조회수로 초기화
        setJobViewCount(id, jobData.viewCount);

        // 아직 조회하지 않은 경우 조회수 증가 (실시간 반영)
        if (!isAlreadyViewed("job", id)) {
          console.log("[JobDetail] 조회수 실시간 증가:", id);
          incrementJobViewCount(id);
          markAsViewed("job", id);
        }
      }
    }
  }, [
    jobData,
    id,
    setJobViewCount,
    incrementJobViewCount,
    markAsViewed,
    isAlreadyViewed,
  ]);

  // API 응답의 isOwner 값을 사용하되, 클라이언트에서도 추가 체크
  const isOwner =
    jobData?.isOwner === true ||
    (isAuthenticated &&
      user?.type === "hospital" &&
      user?.id &&
      jobData?.hospitalUserId === user.id);

  // 수의사 또는 수의학과 학생인지 확인
  const canApply = isAuthenticated && user?.type === "veterinarian" && !isOwner;

  // 디버깅: isOwner 상태 확인
  console.log("Owner check:", {
    jobDataIsOwner: jobData?.isOwner,
    hospitalUserId: jobData?.hospitalUserId,
    userId: user?.id,
    userType: user?.type,
    isOwner: isOwner,
    canApply: canApply,
  });

  // 디버깅: 지원 상태 확인
  console.log("Application check:", {
    hasApplied: jobData?.hasApplied,
    isAuthenticated: isAuthenticated,
    userType: user?.type,
    canApply: canApply,
  });

  // 디버깅: 이력서 상태 확인
  console.log("Resume check:", {
    hasResume: hasResume,
    isResumeLoading: isResumeLoading,
    resumeError: resumeError,
    userType: user?.type,
    isAuthenticated: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">불러오는 중...</h1>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              채용공고를 찾을 수 없습니다
            </h1>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              채용공고 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </>
    );
  }

  // 채용공고 좋아요/취소 토글 핸들러 (Zustand 스토어 사용)
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/member-select");
      return;
    }

    const isCurrentlyLiked = isJobLiked(id);

    console.log(
      `[JobDetail Like] ${id} - 현재 상태: ${
        isCurrentlyLiked ? "좋아요됨" : "좋아요안됨"
      } -> ${isCurrentlyLiked ? "좋아요 취소" : "좋아요"}`
    );

    // 낙관적 업데이트: UI를 먼저 변경
    toggleJobLike(id);

    try {
      const method = isCurrentlyLiked ? "DELETE" : "POST";
      const actionText = isCurrentlyLiked ? "좋아요 취소" : "좋아요";

      console.log(`[JobDetail Like] API 요청: ${method} /api/jobs/${id}/like`);

      const response = await fetch(`/api/jobs/${id}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`[JobDetail Like] ${actionText} 실패:`, result);

        // 오류 발생 시 상태 롤백
        setJobLike(id, isCurrentlyLiked);

        if (response.status === 404) {
          console.warn("채용공고를 찾을 수 없습니다:", id);
          return;
        } else if (response.status === 400) {
          if (result.message?.includes("이미 좋아요한")) {
            console.log(
              `[JobDetail Like] 서버에 이미 좋아요가 존재함. 상태를 동기화`
            );
            setJobLike(id, true);
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

      console.log(`[JobDetail Like] ${actionText} 성공:`, result);
    } catch (error) {
      console.error(
        `[JobDetail Like] ${isCurrentlyLiked ? "좋아요 취소" : "좋아요"} 오류:`,
        error
      );

      // 오류 발생 시 상태 롤백
      setJobLike(id, isCurrentlyLiked);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/member-select");
      return;
    }

    if (!canApply) {
      alert("수의사만 지원할 수 있습니다.");
      return;
    }

    // 이력서 로딩 중이면 잠시 대기
    if (isResumeLoading) {
      alert("이력서 정보를 확인하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 이력서 확인 중 에러가 발생한 경우 (토큰 만료 등)
    if (resumeError) {
      console.log("Resume error detected:", resumeError);
      clearExpiredAuth();
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      router.push("/member-select");
      return;
    }

    if (!hasResume) {
      setResumeRequiredModalOpen(true);
      return;
    }

    handleApply();
  };

  const handleApply = async () => {
    if (isApplying) return;

    setIsApplying(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      const response = await axios.post(
        `/api/jobs/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        alert("지원이 완료되었습니다!");
        // 지원 상태 업데이트를 위해 페이지 새로고침
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Apply error:", error);

      // 400 에러 (이미 지원한 경우)는 별도 처리
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || "이미 지원한 채용공고입니다.";
        alert(errorMessage);
        // 지원 상태를 업데이트하기 위해 페이지 새로고침
        window.location.reload();
      } else {
        const errorMessage =
          error.response?.data?.message || "지원 중 오류가 발생했습니다.";
        alert(errorMessage);
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancelApply = async () => {
    if (isCancelling) return;

    if (!confirm("지원을 취소하시겠습니까?")) return;

    setIsCancelling(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      const response = await axios.delete(`/api/jobs/${id}/apply/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        alert("지원이 취소되었습니다!");
        // 지원 상태 업데이트를 위해 페이지 새로고침
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Cancel apply error:", error);
      const errorMessage =
        error.response?.data?.message || "지원 취소 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactForm.subject || !contactForm.message) {
      alert("제목과 문의 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/inquiries",
        {
          subject: contactForm.subject,
          message: contactForm.message,
          recipientId: jobData.hospitalUserId || jobData.hospital?.userId,
          jobId: id,
          type: "job",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("문의가 성공적으로 전송되었습니다!");

        // 폼 초기화 및 모달 닫기
        setContactForm({
          subject: "",
          message: "",
        });
        setContactModalOpen(false);
      }
    } catch (error: any) {
      console.error("Contact submit error:", error);

      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        router.push("/member-select");
      } else {
        const errorMessage =
          error.response?.data?.error || "문의 전송 중 오류가 발생했습니다.";
        alert(errorMessage);
      }
    }
  };

  const resetContactForm = () => {
    setContactForm({
      subject: "",
      message: "",
    });
    setContactModalOpen(false);
  };

  const handleDeleteJob = async () => {
    if (!confirm("정말로 이 채용공고를 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        alert("채용공고가 삭제되었습니다.");
        router.push("/dashboard/hospital/my-jobs");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("채용공고 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FBFBFB]">
        <div className="max-w-[1095px] mx-auto pt-[20px] pb-[140px] px-4 lg:px-0">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/jobs"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MoreVerticalIcon size="28" currentColor="currentColor" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-2 w-[130px] bg-white border rounded-lg shadow-lg z-10">
                    <Link
                      href={`/dashboard/hospital/my-jobs/${id}/edit`}
                      className="flex justify-center items-center px-[20px] py-[10px] text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <EditIcon size="24" currentColor="currentColor" />
                      <span className="ml-2">수정하기</span>
                    </Link>
                    <button
                      onClick={handleDeleteJob}
                      className="flex justify-center items-center w-full px-[20px] py-[10px] text-sm text-[#ff8796] hover:bg-gray-50"
                    >
                      <TrashIcon currentColor="currentColor" />
                      <span className="ml-2">삭제하기</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <section className="max-w-[1095px] w-full px-[16px] pt-[20px] pb-[30px] sm:p-[60px] bg-white rounded-[20px] border border-[#EFEFF0]">
            {/* 채용공고 헤더 */}
            <div className="border-b border-[#EFEFF0] pb-[40px]">
              {/* 제목과 북마크 */}
              <div className="flex justify-between items-start mb-4">
                <h1 className="font-text text-[24px] lg:text-[32px] font-bold text-primary flex-1 pr-4">
                  {jobData.title}
                </h1>
                <div className="cursor-pointer" onClick={handleBookmarkClick}>
                  {isJobLiked(id) ? (
                    <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
                  ) : (
                    <BookmarkIcon currentColor="var(--Subtext2)" />
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[40px] mb-4">
                <div className="flex items-center gap-2">
                  <WalletIcon currentColor="#4F5866" />
                  <span className="font-text text-[16px] text-primary">
                    {jobData.experienceLevel || "경력무관"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon currentColor="#4F5866" />
                  <span className="font-text text-[16px] text-primary">
                    {jobData.location ||
                      jobData.hospital?.location ||
                      "위치 정보 없음"}
                  </span>
                </div>
              </div>

              {/* 키워드 태그와 마감일 */}
              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {jobData.keywords && jobData.keywords.length > 0 ? (
                    jobData.keywords.map((keyword, index) => (
                      <Tag key={index} variant={6}>
                        {keyword}
                      </Tag>
                    ))
                  ) : (
                    <Tag variant={6}>일반채용</Tag>
                  )}
                </div>
                <div className="text-right ml-4">
                  <span className="font-text text-[16px] text-[#FF8796]">
                    {jobData.deadline || "상시채용"}
                  </span>
                </div>
              </div>

              {/* 조회수
              <div className="flex items-center gap-2 mt-4">
                <EyeIcon currentColor="#9098A4" />
                <span className="font-text text-[14px] text-[#9098A4]">
                  조회 {getJobViewCount(id).toLocaleString()}
                </span>
              </div> */}
            </div>

            {/* 근무 조건 */}
            <div className="mt-[40px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                근무 조건
              </h2>
              <div className="space-y-4">
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 형태
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.workType || "정규직"}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 요일
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.workDays || "주 5일"}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 시간
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.workHours || "09:00 - 18:00"}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    급여
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.salary || "협의"}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    복리후생
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.benefits || "4대보험"}
                  </span>
                </div>
              </div>
            </div>

            {/* 자격 요구사항 */}
            <div className="mt-[60px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                자격 요구사항
              </h2>
              <div className="space-y-4">
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    학력
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications?.education || "학력무관"}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    자격증/면허
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications?.certificates || "수의사 면허"}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    경력
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications?.experience || "경력무관"}
                  </span>
                </div>
              </div>
            </div>

            {/* 우대사항 */}
            <div className="mt-[60px] border-b border-[#EFEFF0] pb-[40px]">
              <div className="flex gap-[50px]">
                <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                  우대사항
                </h2>
                <ul className="space-y-2">
                  {jobData.preferredQualifications &&
                  jobData.preferredQualifications.length > 0 ? (
                    jobData.preferredQualifications.map(
                      (qualification, index) => (
                        <li
                          key={index}
                          className="font-text text-[16px] text-sub"
                        >
                          • {qualification}
                        </li>
                      )
                    )
                  ) : (
                    <li className="font-text text-[16px] text-sub">
                      • 특별한 우대사항 없음
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* 병원 정보 */}
            <div className="mt-[40px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                병원 정보
              </h2>

              {/* 병원 카드 */}
              {jobData.hospital && <HospitalCard hospital={jobData.hospital} />}

              {/* 지원하기 버튼 */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-[40px] mt-[30px]">
                {canApply && (
                  <>
                    {!jobData.hasApplied ? (
                      <Button
                        variant="default"
                        size="large"
                        onClick={handleApplyClick}
                        disabled={isApplying || isResumeLoading}
                      >
                        {isApplying
                          ? "지원 중..."
                          : isResumeLoading
                          ? "확인 중..."
                          : "지원하기"}
                      </Button>
                    ) : (
                      <Button
                        variant="line"
                        size="large"
                        onClick={handleCancelApply}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "취소 중..." : "지원 취소"}
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant="weak"
                  size="large"
                  onClick={handleContactClick}
                >
                  문의하기
                </Button>
              </div>
            </div>
          </section>

          {/* 관련 채용 정보 */}
          <section className="mt-[60px]">
            <h2 className="font-title text-[20px] title-light text-primary mb-[20px]">
              관련 채용 정보
            </h2>

            {/* 데스크톱 그리드 */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {jobData.relatedJobs && jobData.relatedJobs.length > 0 ? (
                jobData.relatedJobs.map((job: any) => (
                  <JobInfoCard
                    key={job.id}
                    id={job.id}
                    hospital={job.hospitalName || job.title}
                    dDay={
                      job.recruitEndDate
                        ? Math.max(
                            0,
                            Math.ceil(
                              (new Date(job.recruitEndDate).getTime() -
                                Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        : null
                    }
                    position={job.position || "수의사"}
                    location={job.location || job.hospitalLocation}
                    jobType={
                      Array.isArray(job.workType)
                        ? job.workType[0]
                        : job.workType
                    }
                    tags={[
                      ...(Array.isArray(job.workType)
                        ? job.workType
                        : [job.workType].filter(Boolean)),
                      ...(Array.isArray(job.experience)
                        ? job.experience
                        : [job.experience].filter(Boolean)),
                    ].filter(Boolean)}
                    isBookmarked={false}
                    isLiked={isJobLiked(job.id)}
                    onLike={async (jobId) => {
                      const jobIdStr = jobId.toString();
                      const isCurrentlyLiked = isJobLiked(jobIdStr);

                      // 낙관적 업데이트
                      toggleJobLike(jobIdStr);

                      try {
                        const method = isCurrentlyLiked ? "DELETE" : "POST";
                        const response = await fetch(
                          `/api/jobs/${jobId}/like`,
                          {
                            method,
                            headers: { "Content-Type": "application/json" },
                          }
                        );

                        if (!response.ok) {
                          // 오류 시 롤백
                          setJobLike(jobIdStr, isCurrentlyLiked);
                          const result = await response.json();
                          if (
                            response.status === 400 &&
                            result.message?.includes("이미 좋아요한")
                          ) {
                            setJobLike(jobIdStr, true);
                          }
                        }
                      } catch (error) {
                        // 오류 시 롤백
                        setJobLike(jobIdStr, isCurrentlyLiked);
                      }
                    }}
                    isNew={
                      new Date(job.createdAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                    onClick={() => {
                      router.push(`/jobs/${job.id}`);
                    }}
                    className="w-full"
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  관련 채용공고가 없습니다.
                </div>
              )}
            </div>

            {/* 모바일 가로 스크롤 */}
            <div className="lg:hidden overflow-x-auto">
              {jobData.relatedJobs && jobData.relatedJobs.length > 0 ? (
                <div
                  className="flex gap-[40px] pb-4"
                  style={{ width: `${jobData.relatedJobs.length * 310}px` }}
                >
                  {jobData.relatedJobs.map((job: any) => (
                    <div key={job.id} className="flex-shrink-0 w-[294px]">
                      <JobInfoCard
                        id={job.id}
                        hospital={job.hospitalName || job.title}
                        dDay={
                          job.recruitEndDate
                            ? Math.max(
                                0,
                                Math.ceil(
                                  (new Date(job.recruitEndDate).getTime() -
                                    Date.now()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )
                            : null
                        }
                        position={job.position || "수의사"}
                        location={job.location || job.hospitalLocation}
                        jobType={
                          Array.isArray(job.workType)
                            ? job.workType[0]
                            : job.workType
                        }
                        tags={[
                          ...(Array.isArray(job.workType)
                            ? job.workType
                            : [job.workType].filter(Boolean)),
                          ...(Array.isArray(job.experience)
                            ? job.experience
                            : [job.experience].filter(Boolean)),
                        ].filter(Boolean)}
                        isBookmarked={false}
                        isLiked={isJobLiked(job.id)}
                        onLike={async (jobId) => {
                          const jobIdStr = jobId.toString();
                          const isCurrentlyLiked = isJobLiked(jobIdStr);

                          // 낙관적 업데이트
                          toggleJobLike(jobIdStr);

                          try {
                            const method = isCurrentlyLiked ? "DELETE" : "POST";
                            const response = await fetch(
                              `/api/jobs/${jobId}/like`,
                              {
                                method,
                                headers: { "Content-Type": "application/json" },
                              }
                            );

                            if (!response.ok) {
                              // 오류 시 롤백
                              setJobLike(jobIdStr, isCurrentlyLiked);
                              const result = await response.json();
                              if (
                                response.status === 400 &&
                                result.message?.includes("이미 좋아요한")
                              ) {
                                setJobLike(jobIdStr, true);
                              }
                            }
                          } catch (error) {
                            // 오류 시 롤백
                            setJobLike(jobIdStr, isCurrentlyLiked);
                          }
                        }}
                        isNew={
                          new Date(job.createdAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        }
                        onClick={() => {
                          router.push(`/jobs/${job.id}`);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  관련 채용공고가 없습니다.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">문의하기</h3>
              <p className="text-gray-600 mb-6">
                {jobData.hospital?.name || "병원"}의 {jobData.title} 포지션에
                대해 문의하세요.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8796] focus:border-transparent"
                    placeholder="문의 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문의 내용 *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8796] focus:border-transparent resize-none"
                    placeholder="문의하실 내용을 자세히 작성해 주세요..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetContactForm}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleContactSubmit}
                  className="flex-1 px-4 py-2 bg-[#ff8796] text-white rounded-md hover:bg-[#ff9aa6] transition-colors font-medium"
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Required Modal */}
      {resumeRequiredModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                이력서 작성 필요
              </h3>
              <p className="text-gray-600 mb-6">
                지원하기 위해서는 먼저 이력서를 작성해야 합니다. 이력서 작성
                페이지로 이동하시겠습니까?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setResumeRequiredModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setResumeRequiredModalOpen(false);
                    router.push("/dashboard/veterinarian/resume");
                  }}
                  className="flex-1 px-4 py-2 bg-[#ff8796] text-white rounded-md hover:bg-[#ff9aa6] transition-colors font-medium"
                >
                  이력서 작성하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
