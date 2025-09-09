"use client";

import { UploadIcon } from "public/icons";
import React, { useState, useRef } from "react";
import { uploadImage, deleteImage } from "@/actions/s3";
import { isS3Url } from "@/utils/s3";

interface LicenseImageUploadProps {
  value?: string;
  onChange?: (url: string | null) => void;
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

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

    setIsUploading(true);

    try {
      // 기존 S3 이미지가 있다면 먼저 삭제
      if (value && isS3Url(value)) {
        await deleteImage(value);
      }

      // S3에 업로드
      const result = await uploadImage(file, 'licenses');
      
      if (result.success && result.url) {
        setPreviewUrl(result.url);
        onChange?.(result.url);
      } else {
        alert(result.error || "이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
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
      alert("이미지 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full max-w-[280px] h-[368px] border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
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
              alt="면허증 미리보기"
              className="w-full h-full object-contain"
            />
            {!disabled && !isUploading && (
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
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#FF8796]" />
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
                    업로드 중...
                  </p>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
        
        {/* 업로드 중 오버레이 */}
        {isUploading && previewUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
            <div className="text-white text-sm font-medium">업로드 중...</div>
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
