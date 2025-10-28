"use client";

import React from "react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface HospitalNotificationsCardProps {
  notifications?: Notification[];
  isLoading?: boolean;
}

const HospitalNotificationsCard: React.FC<HospitalNotificationsCardProps> = ({
  notifications = [],
  isLoading = false,
}) => {
  // 시간을 상대적으로 표시하는 함수
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "방금 전";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR").replace(/\.$/, "");
    }
  };
  return (
    <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">신규 알림</h2>
        <Link
          href="/dashboard/hospital/messages"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="flex items-start gap-[10px] p-[12px]">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex items-start gap-[10px] p-[12px]">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[40px]">
            <div className="w-[60px] h-[60px] bg-[#F5F5F5] rounded-full flex items-center justify-center mb-[16px]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-gray-400"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                />
              </svg>
            </div>
            <p className="text-[14px] text-[#666666] text-center">
              아직 받은 신규 알림이 없습니다
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              href="/dashboard/hospital/messages"
              className="no-underline"
            >
              <div className="flex flex-col p-[12px] hover:bg-gray-50 rounded-lg cursor-pointer border-b border-[#EFEFF0] last:border-b-0">
                <div className="flex items-start gap-[10px]">
                  <div className="w-2 h-2 bg-key1 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-900 font-semibold mb-1">
                      {notification.title}
                    </p>
                    <p className="text-[13px] text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalNotificationsCard;
