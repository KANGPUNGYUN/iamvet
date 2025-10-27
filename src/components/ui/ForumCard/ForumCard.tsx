import Link from "next/link";
import { EyeIcon, CommentIcon } from "public/icons";
import { Tag } from "../Tag";
import { useViewCountStore } from "@/stores/viewCountStore";

export interface ForumCardProps {
  id: string;
  title: string;
  tags: string[];
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt?: Date;
  onClick?: () => void;
}

export default function ForumCard({
  id,
  title,
  tags,
  viewCount,
  commentCount,
  createdAt,
  updatedAt,
  onClick,
}: ForumCardProps) {
  const { getForumViewCount } = useViewCountStore();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const displayDate = updatedAt ? updatedAt : createdAt;
  
  // 스토어에서 조회수를 가져오되, 없으면 props의 viewCount 사용
  const currentViewCount = getForumViewCount(id) || viewCount;

  return (
    <Link href={`/forums/${id}`} onClick={onClick}>
      <div className="flex flex-col gap-[12px] pt-[16px] pb-[20px] px-[10px] border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors cursor-pointer">
        {/* Tags */}
        <div className="flex gap-2 mb-2">
          {tags.map((tag, index) => (
            <Tag variant={1} key={`${id}-${index}`}>
              {tag}
            </Tag>
          ))}
        </div>

        <div className="flex flex-col gap-[6px]">
          {/* Title */}
          <h3 className="text-[20px] font-text text-bold text-primary leading-[1.4] mb-2">
            {title}
          </h3>
          <div className="flex justify-between">
            {/* Stats */}
            <div className="flex items-center gap-4 text-[#9CA3AF]">
              <div className="flex items-center gap-1">
                <EyeIcon currentColor="#9CA3AF" />
                <span className="text-[14px]">{currentViewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <CommentIcon currentColor="#9CA3AF" />
                <span className="text-[14px]">{commentCount}</span>
              </div>
            </div>
            {/* Date */}
            <div className="text-[14px] text-[#9CA3AF] ml-4">
              {formatDate(displayDate)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
