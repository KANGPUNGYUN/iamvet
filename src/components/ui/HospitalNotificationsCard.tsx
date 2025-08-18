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
}

const HospitalNotificationsCard: React.FC<HospitalNotificationsCardProps> = ({
  notifications = [],
}) => {
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
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[40px]">
            <div className="w-[60px] h-[60px] bg-[#F5F5F5] rounded-full flex items-center justify-center mb-[16px]">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-400">
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
          notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-[10px] p-[12px] hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="w-2 h-2 bg-key1 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                {notification.title}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalNotificationsCard;