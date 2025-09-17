"use client";

import React, { useRef } from "react";
import { UploadIcon } from "public/icons";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB 기본값
  placeholder = "파일을 업로드해주세요",
  disabled = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // 파일 크기 제한
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        alert(`파일 크기는 ${maxSizeMB}MB 이하로 선택해주세요.`);
        return;
      }

      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full min-h-[120px] border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
          disabled 
            ? "cursor-not-allowed opacity-50 bg-gray-100" 
            : "hover:border-gray-400 bg-gray-50"
        }`}
        onClick={handleUploadClick}
        style={{
          backgroundColor: disabled ? "#F5F5F5" : "#FAFAFA",
          borderColor: "#E5E5E5",
        }}
      >
        <div className="flex flex-col gap-3 items-center justify-center h-full text-center p-4">
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
              {placeholder}
            </p>
            <p
              style={{
                color: "#9098A4",
                fontFamily: "SUIT, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "135%",
                marginTop: "4px",
              }}
            >
              최대 {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};