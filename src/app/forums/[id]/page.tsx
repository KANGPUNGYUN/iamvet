"use client";

import React from "react";
import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import dynamic from "next/dynamic";

const HTMLContent = dynamic(() => import("@/components/HTMLContent").then(mod => ({ default: mod.HTMLContent })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-20 rounded" />
});
import { getForumById, Comment as ForumComment } from "@/data/forumsData";
import { notFound, useRouter } from "next/navigation";
import profileImg from "@/assets/images/profile.png";
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  ShareIcon,
  EyeIcon,
  UpIcon,
  DownIcon,
  EditIcon,
  TrashIcon,
  CommentIcon,
} from "public/icons";
import Image from "next/image";
import Link from "next/link";

export default function ForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});

  const currentForum = getForumById(id);

  if (!currentForum) {
    notFound();
  }

  const [comments, setComments] = useState<ForumComment[]>(
    currentForum.comments || []
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: ForumComment = {
      id: Date.now().toString(),
      author: "김수의사",
      authorProfile: "/assets/images/profile/default-profile.png",
      content: newComment,
      date: new Date().toLocaleDateString("ko-KR"),
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleReplySubmit = (parentId: string) => {
    const replyContent = replyInputs[parentId];
    if (!replyContent?.trim()) return;

    const reply: ForumComment = {
      id: Date.now().toString(),
      author: "김수의사",
      authorProfile: "/assets/images/profile/default-profile.png",
      content: replyContent,
      date: new Date().toLocaleDateString("ko-KR"),
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
    setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const displayedComments = showMoreComments ? comments : comments.slice(0, 5);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("URL이 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      // 폴백: 수동으로 텍스트 선택
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("URL이 클립보드에 복사되었습니다!");
    }
  };

  return (
    <>
      <main className="pt-[50px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[16px]">
          {/* 헤더 영역 */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/forums"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreVerticalIcon size="28" currentColor="currentColor" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-[130px] bg-white border rounded-lg shadow-lg z-10">
                  <Link
                    href={`/forums/${id}/edit`}
                    className="flex justify-center items-center px-[20px] py-[10px] text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <EditIcon size="24" currentColor="currentColor" />
                    <span className="ml-2">수정하기</span>
                  </Link>
                  <button className="flex justify-center items-center w-full px-[20px] py-[10px] text-sm text-[#ff8796] hover:bg-gray-50">
                    <TrashIcon currentColor="currentColor" />
                    <span className="ml-2">삭제하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <section className="border border-[#EFEFF0] rounded-[16px] p-[16px] md:p-[20px]">
            {/* 포럼 헤더 */}
            <div className="border-b border-[#EFEFF0] px-[0px] md:p-[20px]">
              <h1 className="text-[28px] font-text font-bold text-[#3B394D] mb-4">
                {currentForum.title}
              </h1>

              <div className="flex justify-between">
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentForum.tags.map((tag, index) => (
                    <Tag key={index} variant={1}>
                      {tag}
                    </Tag>
                  ))}
                </div>

                <div className="text-[14px] text-[#9098A4]">
                  {currentForum.createdAt.toLocaleDateString("ko-KR")}
                </div>
              </div>
            </div>

            {/* 포럼 내용 */}
            <div className="border-b border-[#EFEFF0] px-[0px] md:p-[20px]">
              <HTMLContent
                content={currentForum.content}
                className="text-[16px] text-[#4F5866] leading-relaxed"
                style={{
                  fontFamily: "SUIT, sans-serif",
                }}
              />
            </div>

            {/* 조회수, 댓글 수, 공유하기 */}
            <div className="flex items-center justify-between py-[16px] px-[20px]">
              <div className="flex items-center gap-6 text-[14px] text-[#9098A4]">
                <div className="flex items-center gap-1">
                  <EyeIcon currentColor="#9098A4" />
                  <span>{currentForum.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CommentIcon currentColor="#9098A4" />
                  <span>{comments.length}</span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#9098A4] hover:bg-[#F8F9FA] rounded-[8px] transition-colors"
              >
                <ShareIcon currentColor="#9098A4" />
                공유
              </button>
            </div>
          </section>

          {/* 댓글 섹션 */}
          <div className="border border-[#EFEFF0] rounded-[16px] py-[30px] px-[16px] md:p-[40px] mt-[30px] mb-[270px]">
            <h2 className="text-[24px] font-title font-light text-sub mb-4">
              댓글 ({comments.length}개)
            </h2>

            {/* 댓글 작성 */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex gap-3">
                <Image
                  src={profileImg}
                  alt="내 프로필"
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="w-full min-h-[80px] p-3 border border-[#EFEFF0] rounded-[8px] resize-none focus:outline-none focus:border-[#FF8796] transition-colors"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF8796] text-white rounded-[6px] text-[14px] font-medium hover:bg-[#FF7A8A] transition-colors"
                    >
                      댓글 달기
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-6">
              {displayedComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* 댓글 */}
                  <div className="flex gap-3">
                    <Image
                      src={comment.authorProfile || profileImg}
                      alt={comment.author}
                      width={40}
                      height={40}
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-[#3B394D]">
                          {comment.author}
                        </span>
                        <span className="text-[12px] text-[#9098A4]">
                          {comment.date}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#4F5866] leading-relaxed mb-2">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4">
                        {/* 답글 토글 버튼 */}
                        {comment.replies.length > 0 ? (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1 text-[14px] text-[#FF8796] hover:text-[#FF7A8A] transition-colors"
                          >
                            {expandedReplies[comment.id] ? (
                              <>
                                답글 {comment.replies.length}개
                                <UpIcon size="14" currentColor="#FF8796" />
                              </>
                            ) : (
                              <>
                                답글 {comment.replies.length}개
                                <DownIcon size="14" currentColor="#FF8796" />
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1 text-[14px] text-[#9098A4] hover:text-[#FF8796] transition-colors"
                          >
                            {expandedReplies[comment.id] ? (
                              <>
                                답글 달기
                                <UpIcon size="14" currentColor="#9098A4" />
                              </>
                            ) : (
                              <>
                                답글 달기
                                <DownIcon size="14" currentColor="#9098A4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 답글 목록 */}
                  {comment.replies.length > 0 &&
                    expandedReplies[comment.id] && (
                      <div className="ml-[53px] space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Image
                              src={reply.authorProfile || profileImg}
                              alt={reply.author}
                              width={32}
                              height={32}
                              className="w-[32px] h-[32px] rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[14px] font-semibold text-[#3B394D]">
                                  {reply.author}
                                </span>
                                <span className="text-[12px] text-[#9098A4]">
                                  {reply.date}
                                </span>
                              </div>
                              <p className="text-[14px] text-[#4F5866] leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* 답글 작성 */}
                  {expandedReplies[comment.id] && (
                    <div className="ml-[53px]">
                      <div className="flex gap-3">
                        <Image
                          src={profileImg}
                          alt="내 프로필"
                          width={32}
                          height={32}
                          className="w-[32px] h-[32px] rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <textarea
                            value={replyInputs[comment.id] || ""}
                            onChange={(e) =>
                              setReplyInputs((prev) => ({
                                ...prev,
                                [comment.id]: e.target.value,
                              }))
                            }
                            placeholder="답글을 입력하세요"
                            className="w-full min-h-[60px] p-3 border border-[#EFEFF0] rounded-[8px] resize-none focus:outline-none focus:border-[#FF8796] transition-colors"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="px-3 py-1 text-[12px] text-[#9098A4] hover:text-[#4F5866] transition-colors"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleReplySubmit(comment.id)}
                              className="px-3 py-1 bg-[#FF8796] text-white rounded-[4px] text-[12px] font-medium hover:bg-[#FF7A8A] transition-colors"
                            >
                              답글 달기
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {comments.length > 5 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowMoreComments(!showMoreComments)}
                  className="px-6 py-2 border border-[#EFEFF0] rounded-[8px] text-[14px] text-[#4F5866] hover:bg-[#F8F9FA] transition-colors"
                >
                  {showMoreComments
                    ? "접기"
                    : `더보기 (${comments.length - 5}개)`}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
