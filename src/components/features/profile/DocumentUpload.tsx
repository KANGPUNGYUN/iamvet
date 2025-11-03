"use client";

import React, { useState, useRef } from "react";
import { UploadIcon, ExcelIcon, WordIcon, PdfIcon } from "public/icons";

interface DocumentUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
  onUploadComplete?: (urls: string[]) => void; // 업로드 완료 시 URL 반환
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  value = [],
  onChange,
  disabled = false,
  className = "",
  maxFiles = 3,
  onUploadComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  // 개별 파일을 S3에 직접 업로드하는 함수
  const uploadFileToS3 = async (file: File): Promise<string | null> => {
    try {
      // presigned URL 요청
      const response = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder: "transfers",
        }),
      });

      if (!response.ok) {
        throw new Error("Presigned URL 생성 실패");
      }

      const data = await response.json();
      const { presignedUrl, fileUrl } = data.data;

      // S3에 직접 업로드
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("S3 업로드 실패");
      }

      // 업로드 완료 후 메타데이터 업데이트
      try {
        await fetch("/api/upload/update-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileUrl: fileUrl,
            originalFileName: file.name,
          }),
        });
      } catch (metadataError) {
        console.warn("메타데이터 업데이트 실패:", metadataError);
        // 메타데이터 업데이트 실패해도 파일 업로드는 성공으로 처리
      }

      return fileUrl;
    } catch (error) {
      console.error("File upload error:", error);
      alert(`${file.name} 업로드 중 오류가 발생했습니다.`);
      return null;
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = Array.from(event.target.files || []);

    if (newFiles.length === 0) return;

    // 파일 타입 검증
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    const validFiles = newFiles.filter((file) => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`${file.name}의 크기가 20MB를 초과합니다.`);
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 최대 개수 확인
    const totalFiles = value.length + validFiles.length;
    if (totalFiles > maxFiles) {
      alert(`최대 ${maxFiles}개까지만 업로드할 수 있습니다.`);
      return;
    }

    // 업로드 상태 관리
    const fileIds = validFiles.map((file) => `${file.name}-${Date.now()}`);
    setUploadingFiles((prev) => {
      const newSet = new Set(prev);
      fileIds.forEach((id) => newSet.add(id));
      return newSet;
    });

    try {
      // 파일들을 S3에 순차적으로 업로드
      const uploadPromises = validFiles.map(uploadFileToS3);
      const uploadResults = await Promise.all(uploadPromises);

      // 성공한 업로드 결과만 필터링
      const successfulUrls = uploadResults.filter(
        (url): url is string => url !== null
      );

      if (successfulUrls.length > 0) {
        // 성공한 업로드 URL들을 부모 컴포넌트에 전달
        onUploadComplete?.(successfulUrls);
      }

      // 파일 객체들도 로컬 상태에 추가 (UI 표시용)
      const updatedFiles = [...value, ...validFiles];
      onChange?.(updatedFiles);
    } catch (error) {
      console.error("Upload error:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      // 업로드 상태 초기화
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        fileIds.forEach((id) => newSet.delete(id));
        return newSet;
      });

      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    if (!disabled && value.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange?.(updatedFiles);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <PdfIcon currentColor="#EF4444" />;
    }
    // Excel 파일을 먼저 체크 (spreadsheetml이나 xlsx, xls 포함)
    if (
      fileType.includes("xlsx") ||
      fileType.includes("xls") ||
      fileType.includes("xlsm") ||
      fileType.includes("spreadsheetml") ||
      fileType.includes("spreadsheet")
    ) {
      return <ExcelIcon currentColor="#22C55E" />;
    }
    // Word 파일 체크 (wordprocessingml이나 msword 포함)
    if (
      fileType.includes("word") ||
      fileType.includes("wordprocessingml") ||
      fileType.includes("msword")
    ) {
      return <WordIcon currentColor="#3B82F6" />;
    }
    if (fileType.includes("image")) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="#10B981" />
          <circle cx="6" cy="6" r="1" fill="white" />
          <path
            d="M14 10l-2-2a1 1 0 00-1.414 0L4 14"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="1" width="10" height="14" rx="1" fill="#6B7280" />
        <path
          d="M5 5h4M5 8h3M5 11h2"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const getFileName = (file: File) => {
    if (file.name.length > 25) {
      return file.name.substring(0, 22) + "...";
    }
    return file.name;
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* 파일 업로드 버튼 */}
      {value.length < maxFiles && (
        <div
          className={`w-full h-[200px] border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
            disabled ? "cursor-not-allowed opacity-50" : "hover:border-gray-400"
          }`}
          onClick={handleUploadClick}
          style={{
            backgroundColor: "#FAFAFA",
            borderColor: "#E5E5E5",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <UploadIcon currentColor="#9098A4" />
            <p
              className="mt-4"
              style={{
                color: "#9098A4",
                fontFamily: "SUIT, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "135%",
              }}
            >
              클릭하여 파일 업로드
            </p>
            <p
              className="mt-2"
              style={{
                color: "#9098A4",
                fontFamily: "SUIT, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "135%",
              }}
            >
              PDF, Word, Excel 파일 (20MB 이하)
              <br />({value.length}/{maxFiles}개 업로드됨)
            </p>
          </div>
        </div>
      )}

      {/* 업로드된 파일들 */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-[#FAFAFA]"
            >
              <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{
                    color: "#3B394D",
                    fontFamily: "SUIT, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "135%",
                  }}
                >
                  {getFileName(file)}
                </p>
                <p
                  style={{
                    color: "#9098A4",
                    fontFamily: "SUIT, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: "135%",
                  }}
                >
                  {(file.size / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 w-6 h-6 bg-[#3B394D33] text-white rounded-full flex items-center justify-center text-sm hover:bg-[#3B394D] transition-colors"
                  aria-label="파일 제거"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
