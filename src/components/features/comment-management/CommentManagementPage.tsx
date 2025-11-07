"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination";

interface Comment {
  id: string;
  content: string;
  type: "forum" | "lecture"; // Add type property
  postId?: string; // For forum comments
  postTitle?: string; // For forum comments
  postDeleted?: boolean; // For forum comments
  lectureId?: string; // For lecture comments
  lectureTitle?: string; // For lecture comments
  lectureDeleted?: boolean; // For lecture comments
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string;
    displayName: string;
    profileImage?: string;
    userType: string;
  };
}

interface CommentManagementPageProps {
  commentType: "forum" | "lecture" | "all";
}

export default function CommentManagementPage({
  commentType,
}: CommentManagementPageProps) {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [commentFilter, setCommentFilter] = useState<
    "all" | "forum" | "lecture"
  >("all"); // New state for comment type filter
  const [currentPage, setCurrentPage] = useState(1);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const fetchMyComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiType = commentType === "all" ? "all" : commentType;
      const response = await fetch(
        `/api/my-comments?type=${apiType}&page=${currentPage}&limit=${itemsPerPage}&sortBy=${sortBy}&searchKeyword=${searchKeyword}&commentFilter=${commentFilter}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage =
          commentType === "forum"
            ? "임상포럼"
            : commentType === "lecture"
            ? "강의"
            : "전체";
        throw new Error(
          `내가 작성한 ${errorMessage} 댓글을 불러오는데 실패했습니다.`
        );
      }

      const result = await response.json();

      if (result.status === "success") {
        setComments(result.data?.comments || []);
        setTotalComments(result.data?.total || 0);
        setTotalPages(result.data?.totalPages || 0);
      } else {
        throw new Error(
          result.message ||
            `내가 작성한 ${
              commentType === "forum" ? "임상포럼" : "강의"
            } 댓글을 불러오는데 실패했습니다.`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error(
        `내 ${
          commentType === "forum" ? "임상포럼" : "강의"
        } 댓글 목록 조회 오류:`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, [currentPage, sortBy, searchKeyword, commentType, commentFilter]); // Add commentFilter to dependencies

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleCommentClick = (comment: Comment) => {
    if (comment.type === "forum" && comment.postId && !comment.postDeleted) {
      router.push(`/forums/${comment.postId}`);
    } else if (
      comment.type === "lecture" &&
      comment.lectureId &&
      !comment.lectureDeleted
    ) {
      router.push(`/lectures/${comment.lectureId}`);
    }
  };

  const pageTitle =
    commentType === "forum"
      ? "임상포럼 댓글 관리"
      : commentType === "lecture"
      ? "강의 댓글 관리"
      : "내 댓글 관리"; // Generic title for "all"
  const searchPlaceholder = "댓글 내용 검색"; // Generic placeholder for "all"
  const noDataMessage =
    commentType === "forum"
      ? "작성한 임상포럼 댓글이 없습니다."
      : commentType === "lecture"
      ? "작성한 강의 댓글이 없습니다."
      : "작성한 댓글이 없습니다."; // Generic no data message for "all"
  const noDataSubMessage =
    commentType === "forum"
      ? "임상포럼에서 댓글을 작성해보세요."
      : commentType === "lecture"
      ? "강의에서 댓글을 작성해보세요."
      : "포럼이나 강의에서 댓글을 작성해보세요."; // Generic no data sub message for "all"
  const navigateButtonText =
    commentType === "forum"
      ? "임상포럼 둘러보기"
      : commentType === "lecture"
      ? "강의 둘러보기"
      : "포럼/강의 둘러보기"; // Generic button text for "all"
  const navigatePath =
    commentType === "forum"
      ? "/forums"
      : commentType === "lecture"
      ? "/lectures"
      : "/forums"; // Default to forums for "all"

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1240px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
          <div className="xl:py-8">
            <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px] flex-1 space-y-6">
              <div className="flex justify-between items-center self-stretch">
                <h1 className="text-primary font-text text-[24px] text-bold mb-6">
                  {pageTitle}
                </h1>

                <SearchBar
                  value={searchKeyword}
                  onChange={setSearchKeyword}
                  placeholder={searchPlaceholder}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-[16px] text-[#9098A4]">
                  총 {totalComments}건
                </p>
                <div className="flex gap-2">
                  <SelectBox
                    value={commentFilter}
                    onChange={(value) => setCommentFilter(value as "all" | "forum" | "lecture")}
                    placeholder="전체"
                    options={[
                      { value: "all", label: "전체" },
                      { value: "forum", label: "임상포럼" },
                      { value: "lecture", label: "강의" },
                    ]}
                  />
                  <SelectBox
                    value={sortBy}
                    onChange={setSortBy}
                    placeholder="최신순"
                    options={[
                      { value: "recent", label: "최신순" },
                      { value: "oldest", label: "오래된순" },
                    ]}
                  />
                </div>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8796] mx-auto mb-4"></div>
                    <p className="text-[#9098A4]">댓글을 불러오는 중...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={fetchMyComments}
                      className="px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border border-[#EFEFF0] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCommentClick(comment)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              comment.type === "forum"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {comment.type === "forum" ? "임상포럼" : "강의"}
                          </span>
                          <span className="text-sm text-[#9098A4]">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-[16px] font-medium text-[#3B394D] mb-2">
                        {commentType === "forum"
                          ? comment.postTitle
                          : comment.lectureTitle}
                        {(commentType === "forum" && comment.postDeleted) ||
                        (commentType === "lecture" &&
                          comment.lectureDeleted) ? (
                          <span className="text-red-500 text-sm ml-2">
                            (삭제됨)
                          </span>
                        ) : null}
                      </h3>

                      <p className="text-[14px] text-[#9098A4] leading-relaxed">
                        {truncateContent(comment.content)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && comments.length === 0 && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-[#9098A4] text-lg">{noDataMessage}</p>
                    <p className="text-[#9098A4] text-sm mt-2">
                      {noDataSubMessage}
                    </p>
                    <button
                      onClick={() => router.push(navigatePath)}
                      className="mt-4 px-4 py-2 bg-[#ff8796] text-white rounded-lg hover:bg-[#ffb7b8]"
                    >
                      {navigateButtonText}
                    </button>
                  </div>
                </div>
              )}

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
        </div>
      </main>
    </>
  );
}
