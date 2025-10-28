import { BookmarkFilledIcon, BookmarkIcon } from "public/icons";
import React from "react";
import { Tag } from "../Tag";
import Image from "next/image";

interface LectureCardProps {
  id: string;
  title: string;
  date: string;
  views: number;
  imageUrl?: string;
  category?: string;
  isLiked?: boolean;
  onLike?: (lectureId: string) => void;
  onClick?: () => void;
}

const LectureCard: React.FC<LectureCardProps> = ({
  id,
  title = "개와 유치원 종합 지식 제거 방법",
  date = "2025-04-09",
  views = 127,
  imageUrl,
  category = "수술 강의",
  isLiked = false,
  onLike,
  onClick,
}) => {
  // props로 전달받은 isLiked 값을 그대로 사용 (중복 호출 방지)
  const currentIsLiked = isLiked;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id && onLike) {
      onLike(id);
    }
  };

  const defaultImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23f3f4f6'/%3E%3Ctext x='200' y='120' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3E강의 이미지%3C/text%3E%3C/svg%3E";

  return (
    <div
      className="max-w-[314px] xl:max-w-[343px] bg-transparent shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer flex-shrink-0"
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="relative h-48 overflow-hidden rounded-[12px]">
        <Image
          src={imageUrl || defaultImage}
          alt={title}
          width={400}
          height={240}
          className="w-full h-full object-cover"
        />

        {/* 카테고리 태그 */}
        {category && (
          <div className="absolute top-4 left-4">
            <Tag variant={3}>{category}</Tag>
          </div>
        )}

        {/* 북마크 버튼 */}
        <button
          className={`absolute top-[12px] right-[12px] w-[32px] h-[32px] rounded-full backdrop-blur-sm transition-all duration-200 ${
            currentIsLiked
              ? "bg-[#FF8796] hover:bg-[#FF6B7D]"
              : "bg-[rgba(121,116,126,0.34)] bg-opacity-90 hover:bg-opacity-100"
          }`}
          onClick={handleLike}
        >
          {currentIsLiked ? (
            <BookmarkFilledIcon currentColor="white" />
          ) : (
            <BookmarkIcon currentColor="white" />
          )}
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-[12px]">
        <h3 className="text-[18px] text-semibold text-gray-900 mb-3 line-clamp-2 leading-relaxed">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-text text-[14px] text-medium text-subtext2">
            {date}
          </span>
          <span className="font-text text-[14px] text-medium text-subtext2">
            조회 {views.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
