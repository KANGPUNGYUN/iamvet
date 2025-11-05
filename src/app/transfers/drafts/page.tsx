"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import { TransferCardSkeleton } from "@/components/ui/TransferCard/TransferCardSkeleton";
import { useAuth } from "@/hooks/api/useAuth";
import { EditIcon } from "public/icons";

type DraftTransfer = {
  id: string;
  title: string;
  description: string;
  price: bigint | null;
  base_address: string;
  detail_address: string;
  category: string;
  images: string[];
  documents: any[];
  updatedAt: string;
  createdAt: string;
  nickname: string;
  profileImage: string;
  sido: string;
  sigungu: string;
  area: number | null;
  views: number;
};

export default function DraftTransfersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<DraftTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/member-select");
      return;
    }

    fetchDrafts();
  }, [user, router]);

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/transfers/drafts");
      if (!response.ok) throw new Error("Failed to fetch drafts");

      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (error) {
      console.error("임시저장 목록 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (draftId: string) => {
    if (!confirm("정말로 이 임시저장을 삭제하시겠습니까?")) return;

    setDeleteLoading(draftId);
    try {
      const response = await fetch(`/api/transfers/${draftId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete draft");

      // 목록에서 제거
      setDrafts(drafts.filter((d) => d.id !== draftId));
    } catch (error) {
      console.error("임시저장 삭제 오류:", error);
      alert("임시저장 삭제에 실패했습니다.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <main className="bg-white">
        <div className="max-w-[1320px] mx-auto px-4 xl:px-[60px] py-[30px]">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-[30px] gap-4">
            <div className="flex justify-between items-center">
              <h1 className="font-title text-[24px] xl:text-[28px] title-medium text-[#3B394D]">
                임시저장 목록
              </h1>
            </div>
            <div className="text-gray-600">
              총 {drafts.length}개의 임시저장된 양도양수가 있습니다.
            </div>
          </div>

          {/* 양도 게시글 목록 */}
          <div className="flex flex-col gap-[20px]">
            {loading ? (
              // 스켈레톤 로딩
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <TransferCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : drafts.length === 0 ? (
              // 데이터가 없는 경우
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <div className="text-lg font-medium mb-2">
                  임시저장된 양도양수가 없습니다
                </div>
                <div className="text-sm mb-4">
                  첫 번째 양도양수를 작성해보세요!
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {drafts.map((draft) => (
                  <div key={draft.id} className="relative">
                    <TransferCard
                      id={draft.id}
                      title={draft.title || "제목 없음"}
                      location={
                        `${draft.sido || ""} ${draft.sigungu || ""}`.trim() ||
                        "위치 미설정"
                      }
                      hospitalType={draft.category}
                      area={draft.category === "병원양도" ? draft.area || 0 : 0}
                      price={
                        draft.price
                          ? `${(Number(draft.price) / 10000).toFixed(0)}만원`
                          : "가격 미설정"
                      }
                      date={new Date(draft.updatedAt)
                        .toLocaleDateString("ko-KR")
                        .replace(/\.$/, "")}
                      views={draft.views || 0}
                      imageUrl={draft.images?.[0] || ""}
                      categories={draft.category}
                      isAd={false}
                      isLiked={false}
                      onLike={() => {}}
                      isDraft={true}
                    />

                    {/* 임시저장 액션 버튼들 */}
                    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-[16px] z-20">
                      <div className="text-center text-white">
                        <div className="flex gap-2 justify-center">
                          <Link
                            href={`/transfers/${draft.id}/edit`}
                            className="flex items-center gap-1"
                          >
                            <Button
                              variant="keycolor"
                              size="small"
                              className="flex items-center gap-1"
                            >
                              수정
                            </Button>
                          </Link>
                          <Button
                            variant="line"
                            size="small"
                            onClick={() => handleDelete(draft.id)}
                            disabled={deleteLoading === draft.id}
                            className="flex items-center gap-1 bg-white text-red-600 hover:bg-red-50"
                          >
                            {deleteLoading === draft.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <>삭제</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 버튼들 */}
            <div className="flex gap-2 self-end mb-[20px]">
              <Link
                href="/transfers"
                className="w-[140px] p-[10px] border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-[6px] font-text text-semibold text-[18px] flex items-center justify-center"
              >
                전체 목록 보기
              </Link>
              <Link
                href="/transfers/create"
                className="w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[18px]"
              >
                <EditIcon size="20" /> 글쓰기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
