"use client";

import React from "react";
import { Header, Footer } from "@/components";
import { Tag } from "@/components/ui/Tag";
import LectureCard from "@/components/ui/LectureCard/LectureCard";
import { allLecturesData, Comment, ReferenceFile } from "@/data/lecturesData";
import { notFound } from "next/navigation";
import { useState, useRef } from "react";
import profileImg from "@/assets/images/profile.png";
import {
  BookmarkIcon,
  BookmarkFilledIcon,
  DownloadIcon,
  ExcelIcon,
  WordIcon,
  PdfIcon,
} from "public/icons";
import Image from "next/image";

export default function LectureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const currentLecture = allLecturesData.find((lecture) => lecture.id === id);

  if (!currentLecture) {
    notFound();
  }

  const [comments, setComments] = useState<Comment[]>(
    currentLecture.comments || []
  );

  const recommendedLectures = allLecturesData
    .filter(
      (lecture) =>
        lecture.id !== id &&
        lecture.medicalField === currentLecture.medicalField
    )
    .slice(0, 3);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes("youtube.com")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
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

    const reply: Comment = {
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
    setActiveReplyId(null);
  };

  const displayedComments = showMoreComments ? comments : comments.slice(0, 5);

  return (
    <>
      <Header isLoggedIn={false} />

      <main className="pt-[50px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[16px]">
          <div className="xl:flex xl:gap-[30px] py-8">
            {/* 메인 콘텐츠 */}
            <div className="flex-1">
              {/* 카테고리 태그 */}
              <div className="mb-4">
                <Tag variant={3}>{currentLecture.category}</Tag>
              </div>

              {/* 제목 및 메타 정보 */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-[32px] font-text font-bold text-primary leading-tight">
                    {currentLecture.title}
                  </h1>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-[#F8F9FA] transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
                    ) : (
                      <BookmarkIcon currentColor="var(--Subtext2)" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center gap-4 text-[16px] text-[#9098A4]">
                  <div>
                    <span className="font-medium">
                      {currentLecture.instructor}
                    </span>
                    <span> ({currentLecture.instructorTitle})</span>
                  </div>
                  <div className="flex gap-[12px]">
                    <span>
                      {currentLecture.uploadDate.toLocaleDateString("ko-KR")}
                    </span>
                    <span>|</span>
                    <span>
                      조회 {currentLecture.viewCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 동영상 */}
              <div className="mb-8">
                <div className="relative aspect-video bg-black rounded-[12px] overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(
                      currentLecture.youtubeUrl ||
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    )}
                    title={currentLecture.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* 영상 소개 */}
              <section className="border border-[#EFEFF0] rounded-[16px] p-[40px]">
                <div>
                  <h2 className="text-[24px] font-title font-light text-sub">
                    영상 소개
                  </h2>

                  <p className="font-text text-[16px] text-sub text-light leading-relaxed my-[20px]">
                    {currentLecture.description}
                  </p>
                </div>

                {/* 참고자료 */}
                <div className="p-[20px] bg-box rounded-[16px]">
                  <h2 className="text-[20px] font-title font-light text-sub mb-[20px]">
                    참고자료
                  </h2>
                  <div className="space-y-3">
                    {currentLecture.referenceFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-[#EFEFF0] bg-white rounded-[8px]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-[16px] h-[16px]">
                            {file.name.endsWith(".pdf") ? (
                              <PdfIcon currentColor="#EF4444" />
                            ) : file.name.endsWith(".doc") ||
                              file.name.endsWith(".docx") ? (
                              <WordIcon currentColor="#3B82F6" />
                            ) : file.name.endsWith(".xlsx") ||
                              file.name.endsWith(".xls") ? (
                              <ExcelIcon currentColor="#22C55E" />
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <rect
                                  x="2"
                                  y="1"
                                  width="10"
                                  height="14"
                                  rx="1"
                                  fill="#6B7280"
                                />
                                <path
                                  d="M5 5h4M5 8h3M5 11h2"
                                  stroke="white"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#3B394D]">
                              {file.name}
                            </p>
                            <p className="text-[12px] text-[#9098A4]">
                              {file.size}
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] transition-colors">
                          <DownloadIcon currentColor="#9098A4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 댓글 섹션 */}
              <div className="border border-[#EFEFF0] rounded-[16px] p-[40px] mt-[30px]">
                <h2 className="text-[24px] font-title font-light text-sub mb-4">
                  댓글 ({comments.length}개)
                </h2>

                {/* 댓글 작성 */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex gap-3">
                    <Image
                      src={profileImg}
                      alt="본인 프로필"
                      width={45}
                      height={45}
                      className="w-[45px] h-[45px] rounded-full object-cover"
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
                          width={45}
                          height={45}
                          className="w-[45px] h-[45px] rounded-full object-cover"
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
                          <button
                            onClick={() =>
                              setActiveReplyId(
                                activeReplyId === comment.id ? null : comment.id
                              )
                            }
                            className="text-[12px] text-[#9098A4] hover:text-[#FF8796] transition-colors"
                          >
                            답글 달기
                          </button>
                        </div>
                      </div>

                      {/* 답글 목록 */}
                      {comment.replies.length > 0 && (
                        <div className="ml-[53px] space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Image
                                src={reply.authorProfile || profileImg}
                                alt={reply.author}
                                width={36}
                                height={36}
                                className="w-[36px] h-[36px] rounded-full object-cover"
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
                      {activeReplyId === comment.id && (
                        <div className="ml-[53px]">
                          <div className="flex gap-3">
                            <Image
                              src={profileImg}
                              alt="내 프로필"
                              width={36}
                              height={36}
                              className="w-[36px] h-[36px] rounded-full object-cover"
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
                                  onClick={() => setActiveReplyId(null)}
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

              {/* 모바일 추천 강의 섹션 */}
              <div className="xl:hidden mt-8">
                <h3 className="text-[24px] font-title font-light text-sub mb-4">
                  추천 강의
                </h3>
                <div className="overflow-x-auto">
                  <div
                    className="flex gap-4 pb-4"
                    style={{ width: "max-content" }}
                  >
                    {recommendedLectures.map((lecture) => (
                      <div key={lecture.id} className="flex-shrink-0">
                        <LectureCard
                          title={lecture.title}
                          date={lecture.uploadDate.toLocaleDateString("ko-KR")}
                          views={lecture.viewCount}
                          imageUrl={lecture.thumbnailUrl}
                          category={lecture.category}
                          isLiked={lecture.isLiked}
                          onLike={() => {
                            console.log(
                              "Like clicked for lecture:",
                              lecture.id
                            );
                          }}
                          onClick={() => {
                            window.location.href = `/lectures/${lecture.id}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 데스크톱 추천 강의 사이드바 */}
            <aside className="hidden xl:block w-[343px] flex-shrink-0">
              <div className="sticky top-[70px]">
                <h3 className="text-[24px] font-title font-light text-sub mb-4">
                  추천 강의
                </h3>
                <div className="space-y-4">
                  {recommendedLectures.map((lecture) => (
                    <LectureCard
                      key={lecture.id}
                      title={lecture.title}
                      date={lecture.uploadDate.toLocaleDateString("ko-KR")}
                      views={lecture.viewCount}
                      imageUrl={lecture.thumbnailUrl}
                      category={lecture.category}
                      isLiked={lecture.isLiked}
                      onLike={() => {
                        console.log("Like clicked for lecture:", lecture.id);
                      }}
                      onClick={() => {
                        window.location.href = `/lectures/${lecture.id}`;
                      }}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
