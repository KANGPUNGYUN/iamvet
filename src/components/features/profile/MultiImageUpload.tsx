"use client";

import React, { useState, useRef } from "react";
import { UploadIcon } from "public/icons";

interface MultiImageUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  disabled = false,
  className = "",
  maxImages = 10,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // 파일이 실제로 변경된 경우만 URL 재생성
    if (value.length !== previewUrls.length) {
      // 기존 URL들 정리
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      // 새 파일들의 미리보기 URL 생성
      const urls = value.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [value.length, previewUrls.length]);

  // 컴포넌트 언마운트 시 URL 정리
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);

    if (newFiles.length === 0) return;

    // 파일 타입 검증
    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}의 크기가 10MB를 초과합니다.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 최대 개수 확인
    const totalFiles = value.length + validFiles.length;
    if (totalFiles > maxImages) {
      alert(`최대 ${maxImages}장까지만 업로드할 수 있습니다.`);
      return;
    }

    const updatedFiles = [...value, ...validFiles];
    onChange?.(updatedFiles);

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (!disabled && value.length < maxImages) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange?.(updatedFiles);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex self-stretch gap-[12px] flex-wrap">
        {/* 업로드된 이미지들 */}
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square border-2 border-dashed border-[#E5E5E5] rounded-lg overflow-hidden w-[150px] h-[150px]"
          >
            <img
              src={url}
              alt={`업로드 이미지 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-[#3B394DB2] text-white rounded-full flex items-center justify-center text-sm hover:bg-[#3B394D] transition-colors"
                aria-label="이미지 제거"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}

        {/* 추가 업로드 버튼 */}
        {value.length < maxImages && (
          <div
            className={`w-[150px] h-[150px] aspect-square border-2 border-dashed border-[#E5E5E5] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:border-gray-400"
            }`}
            onClick={handleUploadClick}
            style={{
              backgroundColor: "#FAFAFA",
            }}
          >
            <UploadIcon currentColor="#9098A4" />
            <p
              className="mt-2 text-center text-xs"
              style={{
                color: "#9098A4",
                fontFamily: "SUIT, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "135%",
              }}
            >
              이미지 추가
              <br />({value.length}/{maxImages})
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
