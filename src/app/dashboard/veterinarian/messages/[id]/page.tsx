"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "public/icons";
import { Tag } from "@/components/ui/Tag";
import profileImg from "@/assets/images/profile.png";
import { useMessageDetail } from "@/hooks/api/useMessageDetail";
import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VeterinarianMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messageType, setMessageType] = useState<'notification' | 'inquiry'>('notification');

  // URL에서 타입 파라미터 확인
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'inquiry' || type === 'notification') {
      setMessageType(type);
    }
  }, [searchParams]);

  const { message, isLoading, error } = useMessageDetail(id, messageType);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen pt-[20px]">
        <div className="w-full mx-auto max-w-[984px] justify-center">
          <div className="mb-6">
            <Link
              href="/dashboard/veterinarian/messages"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>
          </div>
          <div className="lg:p-[20px] p-[16px]">
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">메시지를 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-gray-600">{error}</p>
              <Link 
                href="/dashboard/veterinarian/messages"
                className="mt-4 inline-block text-[#FF8796] hover:underline"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-[20px]">
        <div className="w-full mx-auto max-w-[984px] justify-center">
          <div className="mb-6">
            <Link
              href="/dashboard/veterinarian/messages"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>
          </div>
          <div className="lg:p-[20px] p-[16px]">
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-key1 mx-auto mb-4"></div>
              <p className="text-gray-600">메시지를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="bg-white min-h-screen pt-[20px]">
        <div className="w-full mx-auto max-w-[984px] justify-center">
          <div className="mb-6">
            <Link
              href="/dashboard/veterinarian/messages"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>
          </div>
          <div className="lg:p-[20px] p-[16px]">
            <div className="text-center py-10">
              <p className="text-gray-600">메시지를 찾을 수 없습니다.</p>
              <Link 
                href="/dashboard/veterinarian/messages"
                className="mt-4 inline-block text-[#FF8796] hover:underline"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-[20px]">
      <div className="w-full mx-auto max-w-[984px] justify-center">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link
            href="/dashboard/veterinarian/messages"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon currentColor="currentColor" />
          </Link>
        </div>

        <div className="lg:p-[20px] p-[16px]">
          {/* 메시지 제목 */}
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            {message.title}
          </h1>

          {/* 카테고리 태그 */}
          <div className="mb-6">
            <Tag variant={1}>{message.category}</Tag>
          </div>

          {/* 프로필 정보와 날짜 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image
                src={message.sender?.profileImage || profileImg}
                alt="프로필"
                width={36}
                height={36}
                className="w-[36px] h-[36px] rounded-full object-cover"
              />
              <span className="text-gray-900 font-medium">
                {message.sender?.nickname || "아임벳"}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              {formatDate(message.createdAt)}
            </span>
          </div>

          {/* 메시지 내용 */}
          <div className="mb-6">
            <div className="text-gray-700 mb-4 whitespace-pre-wrap">
              {message.content}
            </div>
            
            {/* 문의 관련 추가 정보 */}
            {message.type === 'inquiry' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                {message.subject && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">문의 제목: </span>
                    <span className="text-gray-600">{message.subject}</span>
                  </div>
                )}
                {message.job && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">관련 채용공고: </span>
                    <Link 
                      href={`/jobs/${message.job.id}`}
                      className="text-[#FF8796] hover:underline"
                    >
                      {message.job.title}
                    </Link>
                  </div>
                )}
                {message.resume && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">관련 이력서: </span>
                    <Link 
                      href={`/resumes/${message.resume.id}`}
                      className="text-[#FF8796] hover:underline"
                    >
                      {message.resume.title}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="flex justify-between items-center mt-8">
            <Link
              href="/dashboard/veterinarian/messages"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="p-[10px] rounded-[8px] border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                title="이전 페이지"
              >
                <ChevronLeftIcon size="32" currentColor="#9098A4" />
              </button>
              <Link
                href="/dashboard/veterinarian/messages"
                className="p-[10px] rounded-[8px] border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                title="목록으로"
              >
                <ChevronRightIcon size="32" currentColor="#9098A4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}