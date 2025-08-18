"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import NotificationCard from "@/components/ui/NotificationCard";

interface NotificationData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  jobId?: number;
  type: "job_result" | "system" | "promotion";
}

const sortOptions = [
  { value: "recent", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

const filterOptions = [
  { value: "all", label: "전체" },
  { value: "unread", label: "읽지 않음" },
  { value: "read", label: "읽음" },
];

export default function HospitalMessagesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const itemsPerPage = 6;

  // 더미 알림 데이터 (페이지네이션 테스트를 위해 더 많은 데이터 생성)
  const [notifications, setNotifications] = useState<NotificationData[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title:
        i % 4 === 0
          ? "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 등록되었습니다."
          : i % 4 === 1
          ? "[면접 일정 안내] 네이버 면접 일정이 확정되었습니다."
          : i % 4 === 2
          ? "[계시판 댓글 알림] 내가 작성한 Q&A에 댓글이 달렸습니다."
          : "[시스템 알림] 개인정보 보호정책이 업데이트 되었습니다.",
      content:
        "감사드립니다. 지원하신 포지션의 결과를 확인할 수 있습니다. 지원 현황 페이지에서 확인해 주세요.",
      createdAt: `2025-04-${15 - Math.floor(i / 5)} 09:45`, // 날짜를 다르게 설정하여 정렬 테스트
      isRead: i % 3 === 0, // 3개 중 1개는 읽음 처리
      jobId: i + 1,
      type:
        i % 4 === 0 || i % 4 === 1
          ? "job_result"
          : i % 4 === 2
          ? "system"
          : "promotion",
    }))
  );

  // 알림 읽음 처리
  const handleMarkAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 필터링 및 정렬 로직
  const filteredAndSortedNotifications = useMemo(() => {
    let filtered = [...notifications];

    // 필터링
    switch (filterBy) {
      case "unread":
        filtered = filtered.filter((notification) => !notification.isRead);
        break;
      case "read":
        filtered = filtered.filter((notification) => notification.isRead);
        break;
      default:
        break;
    }

    // 정렬 (읽음 상태 우선 정렬 후 날짜 정렬)
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => {
          // 먼저 읽지 않은 알림을 우선 정렬
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1; // 읽지 않은 것이 먼저
          }
          // 같은 읽음 상태 내에서 최신순 정렬
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          // 먼저 읽지 않은 알림을 우선 정렬
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1; // 읽지 않은 것이 먼저
          }
          // 같은 읽음 상태 내에서 오래된순 정렬
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [notifications, filterBy, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(
    filteredAndSortedNotifications.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = filteredAndSortedNotifications.slice(
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
          {/* 헤더: 제목과 SelectBox들 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-text text-[24px] text-bold">
              알림 목록
            </h1>
            <div className="flex gap-3">
              <SelectBox
                value={filterBy}
                onChange={setFilterBy}
                placeholder="전체"
                options={filterOptions}
              />
              <SelectBox
                value={sortBy}
                onChange={setSortBy}
                placeholder="최신순"
                options={sortOptions}
              />
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="space-y-4">
            {currentNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                title={notification.title}
                content={notification.content}
                createdAt={notification.createdAt}
                isRead={notification.isRead}
                jobId={notification.jobId}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8">
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
