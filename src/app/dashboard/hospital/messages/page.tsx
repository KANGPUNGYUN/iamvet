"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import NotificationCard from "@/components/ui/NotificationCard";
import { useMessages, MessageData } from "@/hooks/api/useMessages";

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

  const { 
    messages, 
    pagination, 
    isLoading, 
    error, 
    markAsRead 
  } = useMessages({
    type: 'all',
    filter: filterBy as 'all' | 'read' | 'unread',
    sort: sortBy as 'recent' | 'oldest',
    page: currentPage,
    limit: itemsPerPage
  });

  const handleMarkAsRead = async (messageId: string, messageData: MessageData) => {
    const success = await markAsRead(messageId, messageData.type);
    if (!success) {
      // 에러 처리 (필요시 토스트 메시지 등)
      console.error('Failed to mark message as read');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getJobId = (message: MessageData) => {
    if (message.type === 'inquiry' && message.job) {
      return message.job.id;
    }
    return undefined;
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/hospital" className="p-2">
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>
          </div>
          <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">메시지를 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
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
          {/* 헤더: 제목과 SelectBox들 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-text text-[24px] text-bold">알림 및 문의</h1>
            <div className="flex gap-3">
              <SelectBox
                value={filterBy}
                onChange={(value) => {
                  setFilterBy(value);
                  setCurrentPage(1); // 필터 변경 시 첫 페이지로
                }}
                placeholder="전체"
                options={filterOptions}
              />
              <SelectBox
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1); // 정렬 변경 시 첫 페이지로
                }}
                placeholder="최신순"
                options={sortOptions}
              />
            </div>
          </div>

          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-key1 mx-auto mb-4"></div>
              <p className="text-gray-600">메시지를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 메시지 목록 */}
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <NotificationCard
                      key={`${message.type}-${message.id}`}
                      id={message.id}
                      title={message.title}
                      content={message.content}
                      createdAt={formatDate(message.createdAt)}
                      isRead={message.isRead}
                      jobId={getJobId(message) ? parseInt(getJobId(message)!) : undefined}
                      onMarkAsRead={() => handleMarkAsRead(message.id, message)}
                      basePath="/dashboard/hospital/messages"
                      type={message.type}
                      notificationType={message.notificationType}
                      inquiryType={message.inquiryType}
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-600">표시할 메시지가 없습니다.</p>
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}