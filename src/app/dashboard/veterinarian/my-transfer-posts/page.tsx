"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import { SelectBox } from "@/components/ui/SelectBox";
import { FilterBox } from "@/components/ui/FilterBox";
import { Pagination } from "@/components/ui/Pagination";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import { useAuthStore } from "@/stores/authStore";
import { useLikeStore } from "@/stores/likeStore";

interface TransferPost {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string | null;
  categories: string;
  images: string[];
  status: string;
  views: number;
  area: number;
  base_address: string | null;
  detail_address: string | null;
  sido: string | null;
  sigungu: string | null;
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string;
    displayName: string;
    profileImage?: string;
    userType: string;
  };
  hospitalType: string;
  imageUrl: string;
  isLiked: boolean;
  isDraft: boolean;
}

const transferCategories = ["병원양도", "기계장치", "의료장비", "인테리어"];

export default function VeterinarianMyTransferPostsPage() {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { userId } = useAuthStore();
  const {
    setTransferLike,
    toggleTransferLike,
    initializeTransferLikes,
    isTransferLiked,
  } = useLikeStore();

  // API 상태 관리
  const [posts, setPosts] = useState<TransferPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  // 내가 작성한 양도양수 게시물 목록 가져오기
  const fetchMyTransferPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // API 호출 시에는 필터링/정렬/페이지네이션 파라미터 없이 모든 게시물을 가져옴
      const response = await fetch(`/api/my-posts?type=transfer`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          "내가 작성한 양도양수 게시물을 불러오는데 실패했습니다."
        );
      }

      const result = await response.json();

      if (result.status === "success") {
        let allTransferPosts: TransferPost[] = result.data?.posts || [];

        // 클라이언트 사이드 필터링
        if (searchKeyword.trim()) {
          const keyword = searchKeyword.toLowerCase().trim();
          allTransferPosts = allTransferPosts.filter(
            (post: TransferPost) =>
              post.title.toLowerCase().includes(keyword) ||
              post.description.toLowerCase().includes(keyword)
          );
        }

        if (selectedCategories.length > 0) {
          allTransferPosts = allTransferPosts.filter((post: TransferPost) =>
            selectedCategories.includes(post.categories)
          );
        }

        // 정렬 적용
        switch (sortBy) {
          case "recent":
            allTransferPosts.sort(
              (a: TransferPost, b: TransferPost) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          case "popular":
            allTransferPosts.sort(
              (a: TransferPost, b: TransferPost) => b.views - a.views
            );
            break;
        }

        // 페이지네이션 적용
        const total = allTransferPosts.length;
        const totalPagesCount = Math.ceil(total / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedPosts = allTransferPosts.slice(
          startIndex,
          startIndex + itemsPerPage
        );

        setPosts(paginatedPosts);
        setTotalPosts(total);
        setTotalPages(totalPagesCount);

        // 초기 좋아요 상태 동기화
        const likedTransferIds = allTransferPosts
          .filter((transfer) => transfer.isLiked)
          .map((transfer) => transfer.id);
        initializeTransferLikes(likedTransferIds);
      } else {
        throw new Error(
          result.message ||
            "내가 작성한 양도양수 게시물을 불러오는데 실패했습니다."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("내 양도양수 게시물 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 양도양수 좋아요/취소 핸들러
  const handleLike = async (transferId: string) => {
    const isCurrentlyLiked = isTransferLiked(transferId);

    // 낙관적 업데이트: UI를 먼저 변경
    toggleTransferLike(transferId);

    try {
      const method = isCurrentlyLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/transfers/${transferId}/like`, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // 에러 발생 시 상태 롤백
        setTransferLike(transferId, isCurrentlyLiked);
        const result = await response.json();
        console.error("좋아요 처리 실패:", result);
        alert("좋아요 처리 중 오류가 발생했습니다.");
      } else {
        console.log("좋아요 처리 성공");
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      // 네트워크 오류 등으로 실패 시 상태 롤백
      setTransferLike(transferId, isCurrentlyLiked);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1); // 필터 시 첫 페이지로 리셋
  };

  const handleFilterReset = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // 필터나 페이지가 변경될 때마다 API 호출
  useEffect(() => {
    fetchMyTransferPosts();
  }, [searchKeyword, sortBy, selectedCategories, currentPage]);

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1240px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
          <div className="xl:py-8">
            {/* 메인 콘텐츠 */}
            <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px] flex-1 space-y-6">
              {/* 제목 */}
              <div className="flex justify-between items-center self-stretch">
                <h1 className="text-primary font-text text-[24px] text-bold mb-6">
                  양도양수 게시물 관리
                </h1>

                {/* 검색바 */}
                <SearchBar
                  value={searchKeyword}
                  onChange={setSearchKeyword}
                  placeholder="제목 검색"
                />
              </div>

              {/* 결과 정보 및 정렬 */}
              <div className="flex justify-between items-center">
                <p className="text-[16px] text-[#9098A4]">총 {totalPosts}건</p>
                <SelectBox
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="최신순"
                  options={[
                    { value: "recent", label: "최신순" },
                    { value: "popular", label: "인기순" },
                  ]}
                />
              </div>

              {/* 카테고리 필터 */}
              <div className="my-[30px] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <FilterBox.Group
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  orientation="horizontal"
                >
                  {transferCategories.map((category) => (
                    <FilterBox key={category} value={category}>
                      {category}
                    </FilterBox>
                  ))}
                </FilterBox.Group>
              </div>

              {/* 로딩 상태 */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                    <p className="text-[#9098A4]">게시물을 불러오는 중...</p>
                  </div>
                </div>
              )}

              {/* 에러 상태 */}
              {error && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={fetchMyTransferPosts}
                      className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {/* 게시물 목록 */}
              {!loading && !error && (
                <div className="space-y-0 flex flex-col gap-[20px]">
                  {posts.map((post) => (
                    <TransferCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      views={post.views}
                      location={post.location}
                      date={new Date(post.createdAt)
                        .toLocaleDateString("ko-KR")
                        .replace(/\.$/, "")}
                      hospitalType={post.hospitalType}
                      area={post.area}
                      price={post.price || ""}
                      imageUrl={post.imageUrl}
                      categories={post.categories}
                      isLiked={isTransferLiked(post.id)}
                      onLike={() => handleLike(post.id)}
                      isDraft={post.isDraft}
                    />
                  ))}
                </div>
              )}

              {/* 데이터 없음 상태 */}
              {!loading && !error && posts.length === 0 && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-[#9098A4] text-lg">
                      작성한 양도양수 게시물이 없습니다.
                    </p>
                    <p className="text-[#9098A4] text-sm mt-2">
                      양도양수에서 게시물을 작성해보세요.
                    </p>
                    <button
                      onClick={() => router.push("/transfers/create")}
                      className="mt-4 px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                    >
                      양도양수 글쓰기
                    </button>
                  </div>
                </div>
              )}

              {/* 페이지네이션 */}
              {!loading && !error && totalPages > 1 && (
                <div className="py-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 모바일/태블릿 버전 (1280px 미만) */}
          {isMobileFilterOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 xl:hidden"
              style={{
                height: "100dvh",
                width: "100vw",
                overflow: "hidden",
              }}
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] max-h-[80vh] overflow-y-auto"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin",
                  msOverflowStyle: "scrollbar",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* 헤더 */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[20px] font-bold text-[#3B394D]">
                      필터
                    </h2>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="#3B394D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 필터 내용 */}
                  <div className="space-y-6">
                    {/* 카테고리 필터 */}
                    <div>
                      <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">
                        카테고리
                      </h3>
                      <FilterBox.Group
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                      >
                        {transferCategories.map((category) => (
                          <FilterBox key={category} value={category}>
                            {category}
                          </FilterBox>
                        ))}
                      </FilterBox.Group>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex flex-col gap-[16px] w-full">
                      <button
                        onClick={() => {
                          setIsMobileFilterOpen(false);
                        }}
                        className="w-full py-3 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                      >
                        필터 적용
                      </button>
                      <button
                        onClick={handleFilterReset}
                        className="text-[14px] text-[#FF8796] hover:underline"
                      >
                        초기화
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
