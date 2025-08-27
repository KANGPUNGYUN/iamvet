"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ArrowLeftIcon } from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import profileImg from "@/assets/images/profile.png";

interface ApplicationData {
  id: number;
  applicationDate: string;
  applicant: string;
  position: string;
  contact: string;
  status: "서류 합격" | "면접 대기" | "불합격" | "최종합격";
  profileImage?: string;
}

const getStatusVariant = (status: ApplicationData["status"]) => {
  switch (status) {
    case "서류 합격":
      return 2;
    case "면접 대기":
      return 1;
    case "불합격":
      return 6;
    case "최종합격":
      return 1;
    default:
      return 3;
  }
};

const MobileApplicationCard: React.FC<{ application: ApplicationData }> = ({
  application,
}) => {
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
            {application.applicant}
          </span>
        </div>
        <Link href={`/jobs/${application.id}`}>
          <ArrowRightIcon currentColor="currentColor" size="20" />
        </Link>
      </div>

      <div className="flex flex-col gap-[4px]">
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            지원 포지션
          </span>
          <span className="text-[14px] text-primary font-medium">
            {application.position}
          </span>
        </div>
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            연락처
          </span>
          <span className="text-[14px] text-gray-700">
            {application.contact}
          </span>
        </div>
      </div>

      <div className="mt-[20px] flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          {application.applicationDate}
        </span>
        <Tag variant={getStatusVariant(application.status)}>
          {application.status}
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

export default function VeterinarianApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const itemsPerPage = 10;

  // 더미 데이터 (실제로는 API에서 가져올 데이터)
  const allApplications: ApplicationData[] = Array.from(
    { length: 45 },
    (_, i) => ({
      id: i + 1,
      applicationDate: `2024.05.0${(i % 9) + 1} 19:01`,
      applicant: `강남 동물병원${i + 1}`,
      position:
        i % 3 === 0
          ? "내과 전문의"
          : i % 3 === 1
          ? "일반 수의사"
          : "야간 수의사",
      contact: "010-1234-5678 / duwxr335@naver.com",
      status:
        i % 4 === 0
          ? "서류 합격"
          : i % 4 === 1
          ? "면접 대기"
          : i % 4 === 2
          ? "불합격"
          : "최종합격",
      profileImage: i % 5 === 0 ? undefined : profileImg.src,
    })
  );

  // 정렬 로직
  const sortedApplications = useMemo(() => {
    const sorted = [...allApplications];
    switch (sortBy) {
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        );
      case "popular":
        return sorted.sort((a, b) => a.applicant.localeCompare(b.applicant));
      case "deadline":
        return sorted.sort(
          (a, b) =>
            new Date(a.applicationDate).getTime() -
            new Date(b.applicationDate).getTime()
        );
      default:
        return sorted;
    }
  }, [allApplications, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = sortedApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
          {/* 헤더: 제목과 정렬 SelectBox */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-text text-[24px] text-bold">
              지원 내역
            </h1>
            <SelectBox
              value={sortBy}
              onChange={setSortBy}
              placeholder="최신순"
              options={sortOptions}
            />
          </div>
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
                    지원한 병원
                  </th>
                  <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                    병원 연락처/이메일
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
                      {application.applicationDate}
                    </td>
                    <td className="py-[22px] text-sm text-gray-900">
                      {application.applicant}
                    </td>
                    <td className="py-[22px] text-sm text-gray-600">
                      {application.contact}
                    </td>
                    <td className="py-[22px]">
                      <Tag variant={getStatusVariant(application.status)}>
                        {application.status}
                      </Tag>
                    </td>
                    <td className="py-[22px] pr-[30px]">
                      <Link
                        href={`/jobs/${application.id}`}
                        className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
                      >
                        상세보기
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
        </div>
      </div>
    </div>
  );
}
