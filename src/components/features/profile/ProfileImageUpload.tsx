"use client";

import React, { useState, useRef } from "react";
import { UploadIcon } from "public/icons";

interface ProfileImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하로 선택해주세요.");
        return;
      }

      // 파일 타입 제한
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택 가능합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onChange?.(file);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative cursor-pointer transition-all duration-200 ${
          disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-80"
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
            {!disabled && (
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
                background: "#FF8796",
              }}
            >
              <UploadIcon currentColor="white" />
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
                background: "#FF8796",
              }}
            >
              <UploadIcon currentColor="white" />
            </div>
          </>
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
