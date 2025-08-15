"use client";

import React, { useState, useRef, useEffect } from "react";
import { InputBox } from "@/components/ui/Input/InputBox";
import { FilterBox } from "@/components/ui/FilterBox";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getForumById } from "@/data/forumsData";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

// Quill을 동적으로 import (SSR 방지)
const QuillEditor = dynamic(
  () => import("../../../../components/QuillEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-gray-50 rounded-lg animate-pulse" />
    ),
  }
);

export default function ForumEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const [title, setTitle] = useState("");
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentForum = getForumById(id);

  if (!currentForum) {
    notFound();
  }

  // 기존 데이터 로드
  useEffect(() => {
    if (currentForum) {
      setTitle(currentForum.title);
      setContent(currentForum.content);

      // 태그를 동물과 분야로 분리
      const animals = currentForum.tags.filter((tag) =>
        ["강아지", "고양이", "대동물", "특수동물"].includes(tag)
      );
      const fields = currentForum.tags.filter((tag) =>
        ["내과", "외과", "피부과", "응급의학", "예방의학"].includes(tag)
      );

      setSelectedAnimals(animals);
      setSelectedFields(fields);
      setIsLoading(false);
    }
  }, [currentForum]);

  const handleAnimalChange = (value: string[]) => {
    setSelectedAnimals(value);
  };

  const handleFieldChange = (value: string[]) => {
    setSelectedFields(value);
  };

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !content.trim() ||
      selectedAnimals.length === 0 ||
      selectedFields.length === 0
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제로는 API 호출
      const updatedForum = {
        id,
        title: title.trim(),
        content,
        tags: [...selectedAnimals, ...selectedFields],
        author: currentForum.author,
        updatedAt: new Date(),
      };

      console.log("포럼 게시글 수정:", updatedForum);

      // 성공 시 상세 페이지로 이동
      router.push(`/forums/${id}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/forums/${id}`);
  };

  if (isLoading) {
    return (
      <>
        <main className="pt-[50px] pb-[100px] px-[16px] bg-white">
          <div className="max-w-[800px] mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>

      <main className="pt-[50px] pb-[100px] px-[16px] bg-white">
        <div className="max-w-[800px] mx-auto">
          {/* 헤더 */}
          <div className="flex flex-col mb-8 gap-[10px]">
            <Link href={`/forums/${id}`} className="mr-4 w-fit">
              <ArrowLeftIcon currentColor="#000" />
            </Link>
            <h1 className="font-title text-[28px] title-light text-[#3B394D]">
              임상 포럼 게시글 수정
            </h1>
          </div>

          <div className="flex flex-col border border-[#EFEFF0] rounded-[16px] px-[16px] py-[20px] md:px-[30px] md:py-[40px] gap-[40px]">
            {/* 제목 */}
            <div className="flex md:gap-[45px] flex-col md:flex-row md:items-center">
              <label className="block text-[18px] font-medium text-[#3B394D] md:m-[0px] mb-4 w-[36px]">
                제목
              </label>
              <InputBox
                value={title}
                onChange={setTitle}
                placeholder="제목을 입력해 주세요"
                clearable={false}
                className="w-full"
              />
            </div>

            {/* 진료 동물과 진료 분야 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 진료 동물 */}
              <div>
                <label className="block text-[18px] font-medium text-[#3B394D] mb-4">
                  진료 동물
                </label>
                <FilterBox.Group
                  value={selectedAnimals}
                  onChange={handleAnimalChange}
                >
                  <div className="flex flex-wrap gap-2">
                    <FilterBox value="강아지">강아지</FilterBox>
                    <FilterBox value="고양이">고양이</FilterBox>
                    <FilterBox value="대동물">대동물</FilterBox>
                    <FilterBox value="특수동물">특수동물</FilterBox>
                  </div>
                </FilterBox.Group>
              </div>

              {/* 진료 분야 */}
              <div>
                <label className="block text-[18px] font-medium text-[#3B394D] mb-4">
                  진료 분야
                </label>
                <FilterBox.Group
                  value={selectedFields}
                  onChange={handleFieldChange}
                >
                  <div className="flex flex-wrap gap-2">
                    <FilterBox value="내과">내과</FilterBox>
                    <FilterBox value="외과">외과</FilterBox>
                    <FilterBox value="피부과">피부과</FilterBox>
                    <FilterBox value="응급의학">응급의학</FilterBox>
                    <FilterBox value="예방의학">예방의학</FilterBox>
                  </div>
                </FilterBox.Group>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-[18px] font-medium text-[#3B394D] mb-4">
                내용
              </label>
              {!isLoading && (
                <QuillEditor
                  key={`forum-edit-editor-${id}`}
                  value={content}
                  onChange={setContent}
                  placeholder="치료 경험, 지견 등을 자유롭게 작성해 주세요"
                  height={400}
                />
              )}
            </div>
          </div>
          {/* 버튼 영역 */}
          <div className="flex justify-center gap-4 pt-8">
            <Button
              variant="line"
              size="medium"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-[120px]"
            >
              취소
            </Button>
            <Button
              variant="keycolor"
              size="medium"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[120px]"
            >
              {isSubmitting ? "수정 중..." : "수정"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
