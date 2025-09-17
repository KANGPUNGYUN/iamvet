"use client";

import { UploadIcon } from "public/icons";
import React, { useState, useRef } from "react";
import { uploadImage, deleteImage } from "@/lib/s3";
import { isS3Url } from "@/lib/s3-client";

interface ResumeImageUploadProps {
  value?: string;
  onChange?: (imageUrl: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export const ResumeImageUpload: React.FC<ResumeImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // value prop이 변경되면 미리보기 업데이트
  React.useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // 파일 크기 제한 (5MB - S3 업로드 함수와 일치)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하로 선택해주세요.");
        return;
      }

      // 파일 타입 제한
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택 가능합니다.");
        return;
      }

      // 로컬 미리보기 먼저 표시
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // S3 업로드 시작
      setIsUploading(true);
      try {
        const result = await uploadImage(file, 'resumes');
        if (result.success && result.url) {
          // 성공시 실제 S3 URL을 부모 컴포넌트에 전달
          onChange?.(result.url);
          setPreviewUrl(result.url);
        } else {
          alert(result.error || "이미지 업로드에 실패했습니다.");
          setPreviewUrl(null);
          onChange?.(null);
        }
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
        setPreviewUrl(null);
        onChange?.(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUploadClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 기존 S3 이미지가 있다면 삭제
    if (value && isS3Url(value)) {
      try {
        await deleteImage(value);
      } catch (error) {
        console.error("이미지 삭제 오류:", error);
        // 삭제 실패해도 UI에서는 제거
      }
    }
    
    setPreviewUrl(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-[140px] h-[180px] border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
          disabled || isUploading ? "cursor-not-allowed opacity-50" : "hover:border-gray-400"
        }`}
        onClick={handleUploadClick}
        style={{
          backgroundColor: "#FAFAFA",
          borderColor: "#E5E5E5",
        }}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="이력서 사진 미리보기"
              className="w-full h-full object-cover"
            />
            {!disabled && !isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                aria-label="이미지 제거"
              >
                ×
              </button>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center h-full text-center p-2">
            <UploadIcon currentColor="#9098A4" />
            <div>
              <p
                style={{
                  color: "#9098A4",
                  fontFamily: "SUIT, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "135%",
                }}
              >
                {isUploading ? "업로드 중..." : "사진 업로드"}
              </p>
              <p
                style={{
                  color: "#9098A4",
                  fontFamily: "SUIT, sans-serif",
                  fontSize: "10px",
                  fontWeight: 500,
                  lineHeight: "135%",
                }}
              >
                최대 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
};