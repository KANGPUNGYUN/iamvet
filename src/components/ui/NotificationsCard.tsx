"use client";

import React from "react";
import Link from "next/link";
import { useMessages } from "@/hooks/api/useMessages";

interface NotificationsCardProps {
  className?: string;
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({
  className = "",
}) => {
  const { messages, isLoading, error } = useMessages({
    type: 'notifications',
    filter: 'unread',
    limit: 3,
    sort: 'recent'
  });

  // Transform API data to display format
  const notifications = messages.map(msg => ({
    id: msg.id,
    title: msg.title,
    message: msg.content,
    createdAt: new Date(msg.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, ''),
    type: msg.type
  }));

  // Fallback to mock data if no real notifications
  const fallbackNotifications = [
    {
      id: "1",
      title: "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 올라왔습니다.",
      message: "지원 결과 안내",
      createdAt: "2024.05.03",
      type: "notification" as const
    },
    {
      id: "2", 
      title: "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 올라왔습니다.",
      message: "지원 결과 안내",
      createdAt: "2024.05.03",
      type: "notification" as const
    },
    {
      id: "3",
      title: "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 올라왔습니다.",
      message: "지원 결과 안내", 
      createdAt: "2024.05.03",
      type: "notification" as const
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : fallbackNotifications;
  if (error) {
    console.error('Notifications loading error:', error);
  }

  return (
    <div className={`bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px] ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">신규 알림</h2>
        <Link
          href="/dashboard/veterinarian/messages"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          // Loading state
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-[10px] p-[12px] animate-pulse"
              >
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </>
        ) : displayNotifications.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">새로운 알림이 없습니다</p>
          </div>
        ) : (
          // Notifications list
          displayNotifications.slice(0, 3).map((notification) => (
            <Link
              key={notification.id}
              href={`/dashboard/veterinarian/messages/${notification.id}?type=${notification.type}`}
              className="flex items-start gap-[10px] p-[12px] hover:bg-gray-50 rounded-lg cursor-pointer text-decoration-none"
            >
              <div className="w-2 h-2 bg-key1 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium mb-1 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500">
                  {notification.createdAt}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsCard;
