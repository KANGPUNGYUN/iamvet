"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadIcon } from "public/icons";
import { uploadImage, deleteImage } from "@/lib/s3";
import { isS3Url } from "@/lib/s3-client";

interface ProfileImageUploadProps {
  value?: string;
  onChange?: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
  folder?: 'profiles' | 'licenses' | 'hospitals' | 'resumes';
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
  folder = 'profiles',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // value prop이 변경될 때 previewUrl 업데이트
  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 파일 크기 제한 (1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      alert("파일 크기는 1.5MB 이하로 선택해주세요.");
      return;
    }

    // 파일 타입 제한
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택 가능합니다.");
      return;
    }

    setIsUploading(true);

    try {
      // 기존 S3 이미지가 있다면 먼저 삭제
      if (value && isS3Url(value)) {
        await deleteImage(value);
      }

      // S3에 업로드
      const result = await uploadImage(file, folder);
      
      if (result.success && result.url) {
        setPreviewUrl(result.url);
        onChange?.(result.url);
      } else {
        alert(result.error || "이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : "이미지 업로드 중 오류가 발생했습니다.";
      alert(`업로드 오류: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUploading) return;

    try {
      // S3에서 이미지 삭제
      if (previewUrl && isS3Url(previewUrl)) {
        await deleteImage(previewUrl);
      }

      setPreviewUrl(null);
      onChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : "이미지 삭제 중 오류가 발생했습니다.";
      alert(`삭제 오류: ${errorMessage}`);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative cursor-pointer transition-all duration-200 ${
          disabled || isUploading ? "cursor-not-allowed opacity-50" : "hover:opacity-80"
        }`}
        onClick={handleUploadClick}
      >
        {previewUrl ? (
          <>
            {/* 배경 SVG */}
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[240px] h-[240px]"
            >
              <g clipPath="url(#clip0_1813_14387)">
                <rect width="240" height="240" fill="#FFF7F7" />
                <image
                  href={previewUrl}
                  x="0"
                  y="0"
                  width="240"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
              <rect
                x="0.8"
                y="0.8"
                width="238.4"
                height="238.4"
                rx="119.2"
                stroke="#FFD3D3"
                strokeWidth="1.6"
              />
              <defs>
                <clipPath id="clip0_1813_14387">
                  <rect width="240" height="240" rx="120" fill="white" />
                </clipPath>
              </defs>
            </svg>

            {/* 삭제 버튼 */}
            {!disabled && !isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                aria-label="이미지 제거"
              >
                ×
              </button>
            )}

            {/* 업로드 아이콘 (우하단) */}
            <div
              className="absolute bottom-0 right-0 flex items-center justify-center"
              style={{
                display: "flex",
                width: "62px",
                height: "62px",
                padding: "15px",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
                borderRadius: "31px",
                background: isUploading ? "#ccc" : "#FF8796",
              }}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <UploadIcon currentColor="white" />
              )}
            </div>
          </>
        ) : (
          <>
            {/* 배경 SVG (빈 상태) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="240"
              height="240"
              viewBox="0 0 240 240"
              fill="none"
            >
              <g clipPath="url(#clip0_1813_14387)">
                <rect width="240" height="240" fill="#FFF7F7" />
              </g>
              <rect
                x="0.8"
                y="0.8"
                width="238.4"
                height="238.4"
                rx="119.2"
                stroke="#FFD3D3"
                strokeWidth="1.6"
              />
              <defs>
                <clipPath id="clip0_1813_14387">
                  <rect width="240" height="240" rx="120" fill="white" />
                </clipPath>
              </defs>
            </svg>

            {/* 업로드 아이콘 (우하단) */}
            <div
              className="absolute bottom-0 right-0 flex items-center justify-center"
              style={{
                display: "flex",
                width: "62px",
                height: "62px",
                padding: "15px",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
                borderRadius: "31px",
                background: isUploading ? "#ccc" : "#FF8796",
              }}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <UploadIcon currentColor="white" />
              )}
            </div>
          </>
        )}
        
        {/* 업로드 중 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
            <div className="text-white text-sm font-medium">업로드 중...</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
