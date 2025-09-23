"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import axios from "axios";

interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  announcement: {
    priority: string;
    targetUserTypes: string[];
    expiresAt: string | null;
  };
  sender: {
    nickname: string | null;
    realName: string;
  };
}

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncementDetail();
  }, [id]);

  const fetchAnnouncementDetail = async () => {
    try {
      setIsLoading(true);
      // 현재는 전체 목록에서 필터링 (추후 개별 API 엔드포인트 필요)
      const response = await axios.get("/api/notices");
      if (response.data.success) {
        const found = response.data.data.find((item: AnnouncementDetail) => item.id === id);
        if (found) {
          setAnnouncement(found);
        }
      }
    } catch (error) {
      console.error("Failed to fetch announcement detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "중요";
      case "NORMAL":
        return "보통";
      case "LOW":
        return "낮음";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "NORMAL":
        return "bg-gray-100 text-gray-700";
      case "LOW":
        return "bg-gray-50 text-gray-500";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">공지사항을 찾을 수 없습니다.</p>
          <Link href="/notices" className="text-primary hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        {/* 뒤로가기 버튼 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/notices" className="p-2">
            <ArrowLeftIcon currentColor="currentColor" />
          </Link>
          <h2 className="text-lg font-medium">공지사항 상세</h2>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[24px] xl:p-[32px]">
          {/* 중요도 표시 */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(
                announcement.announcement.priority
              )}`}
            >
              {getPriorityLabel(announcement.announcement.priority)}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(announcement.createdAt)}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {announcement.title}
          </h1>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gray-200">
            <span className="text-sm text-gray-600">작성자:</span>
            <span className="text-sm font-medium">
              {announcement.sender.nickname || announcement.sender.realName || "시스템 관리자"}
            </span>
          </div>

          {/* 내용 */}
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {announcement.content}
            </pre>
          </div>

          {/* 대상 사용자 정보 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">대상</h3>
            <div className="flex gap-2">
              {announcement.announcement.targetUserTypes.includes("VETERINARIAN") && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                  수의사
                </span>
              )}
              {announcement.announcement.targetUserTypes.includes("HOSPITAL") && (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                  병원
                </span>
              )}
              {announcement.announcement.targetUserTypes.includes("VETERINARY_STUDENT") && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                  수의대생
                </span>
              )}
            </div>
          </div>

          {/* 만료일 정보 (있는 경우) */}
          {announcement.announcement.expiresAt && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">만료일</h3>
              <p className="text-sm text-gray-700">
                {formatDate(announcement.announcement.expiresAt)}
              </p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-center mt-12">
            <Link
              href="/notices"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}