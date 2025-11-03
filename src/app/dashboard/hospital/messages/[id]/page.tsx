"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "public/icons";
import { Tag } from "@/components/ui/Tag";
import profileImg from "@/assets/images/profile.png";
import { useMessageDetail } from "@/hooks/api/useMessageDetail";
import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function HospitalMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messageType, setMessageType] = useState<'notification' | 'inquiry'>('notification');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyForm, setReplyForm] = useState({
    subject: "",
    message: "",
  });

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

  const handleReplySubmit = async () => {
    if (!replyForm.subject || !replyForm.message) {
      alert("제목과 답변 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/inquiries",
        {
          subject: replyForm.subject,
          message: replyForm.message,
          recipientId: message?.sender?.id,
          jobId: message?.job?.id,
          type: "reply",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("답변이 성공적으로 전송되었습니다!");
        setReplyForm({
          subject: "",
          message: "",
        });
        setReplyModalOpen(false);
      }
    } catch (error: any) {
      console.error("Reply submit error:", error);
      
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        router.push("/member-select");
      } else {
        const errorMessage =
          error.response?.data?.error || "답변 전송 중 오류가 발생했습니다.";
        alert(errorMessage);
      }
    }
  };

  const resetReplyForm = () => {
    setReplyForm({
      subject: "",
      message: "",
    });
    setReplyModalOpen(false);
  };

  const handleReplyClick = () => {
    if (message?.sender?.id) {
      setReplyForm({
        subject: `Re: ${message.subject || message.title}`,
        message: "",
      });
      setReplyModalOpen(true);
    } else {
      alert("답변을 보낼 수 없습니다. 발신자 정보가 없습니다.");
    }
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen pt-[20px]">
        <div className="w-full mx-auto max-w-[984px] justify-center">
          <div className="mb-6">
            <Link
              href="/dashboard/hospital/messages"
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
                href="/dashboard/hospital/messages"
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
              href="/dashboard/hospital/messages"
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
              href="/dashboard/hospital/messages"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>
          </div>
          <div className="lg:p-[20px] p-[16px]">
            <div className="text-center py-10">
              <p className="text-gray-600">메시지를 찾을 수 없습니다.</p>
              <Link 
                href="/dashboard/hospital/messages"
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
            href="/dashboard/hospital/messages"
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

            {/* 첨부 이미지 */}
            {message.images && message.images.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-4">첨부 이미지</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={imageUrl}
                          alt={`첨부 이미지 ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      {/* 클릭 시 원본 이미지 보기 */}
                      <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center"
                      >
                        <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black bg-opacity-70 px-3 py-1 rounded transition-opacity duration-200">
                          원본 보기
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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

          {/* 답변하기 버튼 (문의인 경우에만) */}
          {message.type === 'inquiry' && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleReplyClick}
                className="px-6 py-2 bg-[#ff8796] text-white rounded-md hover:bg-[#ff9aa6] transition-colors font-medium"
              >
                답변하기
              </button>
            </div>
          )}

          {/* 하단 네비게이션 버튼 */}
          <div className="flex justify-between items-center mt-8">
            <Link
              href="/dashboard/hospital/messages"
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
                href="/dashboard/hospital/messages"
                className="p-[10px] rounded-[8px] border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                title="목록으로"
              >
                <ChevronRightIcon size="32" currentColor="#9098A4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">답변하기</h3>
              <p className="text-gray-600 mb-6">
                {message?.sender?.nickname || "발신자"}님의 문의에 답변하세요.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={replyForm.subject}
                    onChange={(e) =>
                      setReplyForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8796] focus:border-transparent"
                    placeholder="답변 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    답변 내용 *
                  </label>
                  <textarea
                    value={replyForm.message}
                    onChange={(e) =>
                      setReplyForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8796] focus:border-transparent resize-none"
                    placeholder="답변 내용을 자세히 작성해 주세요..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetReplyForm}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="flex-1 px-4 py-2 bg-[#ff8796] text-white rounded-md hover:bg-[#ff9aa6] transition-colors font-medium"
                >
                  답변하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}