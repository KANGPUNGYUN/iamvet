import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "public/icons";
import { Tag } from "@/components/ui/Tag";
import profileImg from "@/assets/images/profile.png";

export default async function VeterinarianMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentId = parseInt(id);

  // 임시 데이터
  const messageData = {
    title:
      "[지원 결과 안내] 지원하신 '클로버 동물병원 수의사 모집' 결과가 등록되었습니다.",
    category: "지원 결과",
    username: "아임벳",
    createdAt: "2025.04.14 19:01",
    description: "김인지 님, 지원하신 포지션의 결과를 확인할 수 있습니다.",
    link: "지원 현황 페이지",
    linkUrl: "#",
  };

  return (
    <div className="bg-white min-h-screen pt-[20px]">
      <div className="w-full mx-auto max-w-[984px] justify-center">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link
            href="/dashboard/veterinarian/messages"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon
              size="24"
              currentColor="currentColor"
              className="rotate-180"
            />
          </Link>
        </div>

        <div className="lg:p-[20px] p-[16px]">
          {/* 메시지 제목 */}
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            {messageData.title}
          </h1>

          {/* 카테고리 태그 */}
          <div className="mb-6">
            <Tag variant={1}>{messageData.category}</Tag>
          </div>

          {/* 프로필 정보와 날짜 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image
                src={profileImg}
                alt="프로필"
                width={36}
                height={36}
                className="w-[36px] h-[36px] rounded-full object-cover"
              />
              <span className="text-gray-900 font-medium">
                {messageData.username}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              {messageData.createdAt}
            </span>
          </div>

          {/* 메시지 내용 */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{messageData.description}</p>
            <a
              href={messageData.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[#FF8796] hover:underline"
            >
              {messageData.link}
            </a>
            에서 확인해 주세요.
          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="flex justify-end gap-3 mt-8">
            <Link
              href={`/dashboard/veterinarian/messages/${currentId - 1}`}
              className="p-[10px] rounded-[8px] border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              title="이전 알림"
            >
              <ChevronLeftIcon size="32" currentColor="#9098A4" />
            </Link>
            <Link
              href={`/dashboard/veterinarian/messages/${currentId + 1}`}
              className="p-[10px] rounded-[8px] border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              title="다음 알림"
            >
              <ChevronRightIcon size="32" currentColor="#9098A4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
