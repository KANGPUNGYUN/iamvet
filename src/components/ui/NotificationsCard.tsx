"use client";

import React from "react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface NotificationsCardProps {
  notifications?: Notification[];
  advertisements?: Array<{
    id: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    description?: string;
  }>;
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({
  notifications = [
    {
      id: "1",
      title: "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 올라왔습니다.",
      message: "지원 결과 안내",
      createdAt: "2024.05.03",
    },
    {
      id: "2",
      title: "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 올라왔습니다.",
      message: "지원 결과 안내",
      createdAt: "2024.05.03",
    },
    {
      id: "3",
      title: "[지원 결과 안내] 지원하신 '포엔트벳 개병원' 결과가 올라왔습니다.",
      message: "지원 결과 안내",
      createdAt: "2024.05.03",
    },
  ],
}) => {
  return (
    <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
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
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-[10px] p-[12px] hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <div className="w-2 h-2 bg-key1 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-900 font-medium mb-1">
              {notification.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsCard;
