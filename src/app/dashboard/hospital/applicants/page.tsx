"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ArrowLeftIcon } from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { useAuth } from "@/hooks/api/useAuth";
import profileImg from "@/assets/images/profile.png";
import axios from "axios";

interface ApplicationData {
  id: string;
  appliedAt: string;
  status: string;
  veterinarianId: string;
  jobId: string;
  nickname: string;
  email: string;
  phone?: string;
  profileImage?: string;
  realName: string;
  job_title: string;
  job_position: string;
  resume_id?: string;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return 2;
    case "REVIEWING":
      return 1;
    case "REJECTED":
      return 6;
    case "PENDING":
      return 3;
    default:
      return 3;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "지원서 접수";
    case "REVIEWING":
      return "검토 중";
    case "ACCEPTED":
      return "승인됨";
    case "REJECTED":
      return "거부됨";
    default:
      return status;
  }
};

const MobileApplicationCard: React.FC<{ 
  application: ApplicationData;
}> = ({ application }) => {
  return (
    <div className="bg-white border border-[#EFEFF0] rounded-[12px] p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={application.profileImage || profileImg}
            alt="프로필"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-[16px] font-bold text-primary">
            {application.realName || application.nickname}
          </span>
        </div>
        <Link href={`/resumes/${application.resume_id || application.veterinarianId}`}>
          <ArrowRightIcon currentColor="currentColor" size="20" />
        </Link>
      </div>

      <div className="flex flex-col gap-[4px]">
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            지원 포지션
          </span>
          <span className="text-[14px] text-primary font-medium">
            {application.job_position}
          </span>
        </div>
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            연락처
          </span>
          <span className="text-[14px] text-gray-700">
            {application.phone} / {application.email}
          </span>
        </div>
      </div>

      <div className="mt-[20px] flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
        </span>
        <Tag variant={getStatusVariant(application.status)}>
          {getStatusText(application.status)}
        </Tag>
      </div>
    </div>
  );
};

const sortOptions = [
  { value: "recent", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "deadline", label: "마감순" },
];

export default function HospitalApplicantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.type === "hospital") {
      fetchApplications();
    }
  }, [isAuthenticated, user]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const response = await axios.get("/api/dashboard/hospital/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setApplications(response.data.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch applications:", error);
      setError("지원자 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


  // 정렬 로직
  const sortedApplications = useMemo(() => {
    const sorted = [...applications];
    switch (sortBy) {
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.appliedAt).getTime() -
            new Date(a.appliedAt).getTime()
        );
      case "popular":
        return sorted.sort((a, b) => a.veterinarian.name.localeCompare(b.veterinarian.name));
      case "deadline":
        return sorted.sort(
          (a, b) =>
            new Date(a.appliedAt).getTime() -
            new Date(b.appliedAt).getTime()
        );
      default:
        return sorted;
    }
  }, [applications, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = sortedApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (!isAuthenticated || user?.type !== "hospital") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">병원 계정만 접근 가능합니다</h1>
          <Link href="/login/hospital" className="text-blue-600 hover:underline">
            병원 로그인
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">지원자 목록을 불러오는 중...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4 text-red-600">{error}</h1>
          <button 
            onClick={fetchApplications}
            className="text-blue-600 hover:underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

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
          {/* 헤더: 제목과 정렬 SelectBox */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-text text-[24px] text-bold">
              지원자 정보 ({applications.length}명)
            </h1>
            <SelectBox
              value={sortBy}
              onChange={setSortBy}
              placeholder="최신순"
              options={sortOptions}
            />
          </div>
          
          {applications.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">아직 지원자가 없습니다.</p>
            </div>
          ) : (
            <>
              {/* 모바일 버전 (xl 이하) */}
              <div className="block xl:hidden">
                {currentApplications.map((application) => (
                  <MobileApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>

              {/* 데스크톱 버전 (xl 이상) */}
              <div className="hidden xl:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-box-light">
                      <th className="text-left py-[22px] pl-[30px] text-sm font-medium text-gray-500 border border-[#EFEFF0] border-r-0 rounded-l-[8px]">
                        지원일자
                      </th>
                      <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                        지원자
                      </th>
                      <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                        지원 포지션
                      </th>
                      <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                        연락처/이메일
                      </th>
                      <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                        상태
                      </th>
                      <th className="text-left py-[22px] pr-[30px] text-sm font-medium text-gray-500 border border-[#EFEFF0] border-l-0 rounded-r-[8px]">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-100">
                        <td className="py-[22px] pl-[30px] text-sm text-gray-900">
                          {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="py-[22px] text-sm text-gray-900">
                          {application.realName || application.nickname}
                        </td>
                        <td className="py-[22px] text-sm text-gray-900">
                          {application.job_position}
                        </td>
                        <td className="py-[22px] text-sm text-gray-600">
                          {application.phone} / {application.email}
                        </td>
                        <td className="py-[22px]">
                          <Tag variant={getStatusVariant(application.status)}>
                            {getStatusText(application.status)}
                          </Tag>
                        </td>
                        <td className="py-[22px] pr-[30px]">
                          <Link
                            href={`/resumes/${application.resume_id || application.veterinarianId}`}
                            className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
                          >
                            이력서 보기
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
