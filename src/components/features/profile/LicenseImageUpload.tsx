"use client";

import { UploadIcon } from "public/icons";
import React, { useState, useRef } from "react";

interface LicenseImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export const LicenseImageUpload: React.FC<LicenseImageUploadProps> = ({
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
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("파일 크기는 10MB 이하로 선택해주세요.");
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
      alert("이미지업로드 기능은 아직 작업중입니다.");
      return;
      // fileInputRef.current?.click();
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
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full max-w-[280px] h-[368px] border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
          disabled ? "cursor-not-allowed opacity-50" : "hover:border-gray-400"
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
              alt="면허증 미리보기"
              className="w-full h-full object-contain"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="이미지 제거"
              >
                ×
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-[22px] items-center justify-center h-full text-center p-4">
            <UploadIcon currentColor="#9098A4" />
            <div>
              <p
                style={{
                  color: "#9098A4",
                  fontFamily: "SUIT, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "135%",
                }}
              >
                클릭하여 이미지 업로드
              </p>
              <p
                style={{
                  color: "#9098A4",
                  fontFamily: "SUIT, sans-serif",
                  fontSize: "14px",
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
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
