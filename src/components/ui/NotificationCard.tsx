"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";

interface NotificationCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  onMarkAsRead?: (id: string) => void;
  jobId?: number;
  basePath?: string;
  type?: "notification" | "inquiry";
  notificationType?: string;
  inquiryType?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  content,
  createdAt,
  isRead,
  onMarkAsRead,
  jobId,
  basePath = "/dashboard/veterinarian/messages",
  type = "notification",
  notificationType,
  inquiryType,
}) => {
  const getTagLabel = () => {
    if (type === "inquiry") {
      switch (inquiryType) {
        case "job":
          return "채용 문의";
        case "resume":
          return "이력서 문의";
        default:
          return "일반 문의";
      }
    } else {
      switch (notificationType) {
        case "ANNOUNCEMENT":
          return "공지사항";
        case "INQUIRY":
          return "문의 알림";
        case "COMMENT":
          return "댓글 알림";
        case "REPLY":
          return "답글 알림";
        case "APPLICATION_STATUS":
          return "지원 결과";
        case "APPLICATION_NEW":
          return "새 지원";
        default:
          return "일반 알림";
      }
    }
  };

  const handleCardClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
    // 모바일에서 카드 클릭 시 상세 페이지로 이동
    window.location.href = `${basePath}/${id}?type=${type}`;
  };

  return (
    <div
      className={`border border-[#EFEFF0] rounded-[12px] p-6 mb-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow ${
        isRead ? "bg-white" : "bg-[#FFF9F9]"
      }`}
      onClick={handleCardClick}
    >
      {/* 데스크톱 레이아웃 */}
      <div className="hidden lg:flex items-start justify-between lg:mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* 읽지 않은 알림 인디케이터 */}
          <div
            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              isRead ? "bg-transparent" : "bg-[#FF8796]"
            }`}
          />
          <div className="flex-1">
            <h3
              className={`text-[16px] font-bold mb-2 ${
                isRead ? "text-[#666666]" : "text-[#333333]"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-[14px] leading-[1.5] ${
                isRead ? "text-[#999999]" : "text-[#666666]"
              }`}
            >
              {content}
            </p>
          </div>
        </div>
        <span
          className={`text-[12px] flex-shrink-0 ${
            isRead ? "text-[#CCCCCC]" : "text-[#999999]"
          }`}
        >
          {createdAt}
        </span>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex flex-col lg:hidden">
        <div className="flex items-start gap-3 mb-2">
          {/* 읽지 않은 알림 인디케이터 */}
          <div
            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              isRead ? "bg-transparent" : "bg-[#FF8796]"
            }`}
          />
          <h3
            className={`text-[16px] font-bold flex-1 ${
              isRead ? "text-[#666666]" : "text-[#333333]"
            }`}
          >
            {title}
          </h3>
        </div>
        <span
          className={`text-[12px] self-end ${
            isRead ? "text-[#CCCCCC]" : "text-[#999999]"
          }`}
        >
          {createdAt}
        </span>
      </div>

      {/* 데스크톱에서만 태그와 링크 표시 */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex gap-2">
          <Tag variant={isRead ? 3 : 4}>{getTagLabel()}</Tag>
        </div>

        <Link
          href={`${basePath}/${id}?type=${type}`}
          className={`text-[12px] font-medium transition-colors ${
            isRead
              ? "text-[#CCCCCC] hover:text-[#999999]"
              : "text-[#FF8796] hover:text-[#FF5A6B]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          자세히 보기
        </Link>
      </div>
    </div>
  );
};

export default NotificationCard;
