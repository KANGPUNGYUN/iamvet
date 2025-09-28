"use client";

import React, { useState, useRef } from "react";
import { UploadIcon } from "public/icons";
import { uploadImage, deleteImage } from "@/lib/s3";
import { isS3Url } from "@/lib/s3-client";

interface MultiImageUploadProps {
  value?: string[]; // URL 배열로 변경
  onChange?: (urls: string[]) => void;
  disabled?: boolean;
  className?: string;
  maxImages?: number;
  folder?: 'profiles' | 'licenses' | 'hospitals' | 'resumes' | 'transfers' | 'hospital-facilities'; // S3 폴더명
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  disabled = false,
  className = "",
  maxImages = 10,
  folder = "hospitals", // 기본값은 hospitals
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // 파일 크기와 타입 필터링 (에러가 아닌 정보 메시지)
    const validFiles = files.filter(file => {
      // 파일 크기 체크 (1.5MB)
      if (file.size > 1.5 * 1024 * 1024) {
        return false;
      }
      // 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        return false;
      }
      // 파일명 특수문자 체크 (S3 호환성)
      const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (invalidChars.test(file.name)) {
        return false;
      }
      // 파일 크기가 0이면 손상된 파일
      if (file.size === 0) {
        return false;
      }
      return true;
    });

    const oversizedFiles = files.filter(file => file.size > 1.5 * 1024 * 1024);
    const nonImageFiles = files.filter(file => !file.type.startsWith("image/"));
    const invalidNameFiles = files.filter(file => /[<>:"/\\|?*\x00-\x1f]/.test(file.name));
    const emptyFiles = files.filter(file => file.size === 0);

    // 정보성 메시지 표시 (에러가 아님)
    if (oversizedFiles.length > 0) {
      alert(`일부 파일이 1.5MB를 초과하여 제외됩니다: ${oversizedFiles.map(f => f.name).join(', ')}`);
    }
    if (nonImageFiles.length > 0) {
      alert(`이미지가 아닌 파일은 제외됩니다: ${nonImageFiles.map(f => f.name).join(', ')}`);
    }
    if (invalidNameFiles.length > 0) {
      alert(`파일명에 특수문자가 포함된 파일은 제외됩니다: ${invalidNameFiles.map(f => f.name).join(', ')}`);
    }
    if (emptyFiles.length > 0) {
      alert(`빈 파일은 제외됩니다: ${emptyFiles.map(f => f.name).join(', ')}`);
    }

    // 업로드 가능한 파일이 없는 경우만 종료
    if (validFiles.length === 0) {
      return;
    }

    // 최대 개수 체크 (필요시 파일 수 조정)
    const filesToUpload = validFiles.slice(0, maxImages - value.length);
    if (validFiles.length > filesToUpload.length) {
      alert(`최대 ${maxImages}장까지 업로드 가능하여 ${filesToUpload.length}장만 업로드됩니다.`);
    }

    setIsUploading(true);

    try {
      console.log('[MultiImageUpload] 업로드 시작:', {
        fileCount: filesToUpload.length,
        files: filesToUpload.map(f => ({ name: f.name, size: f.size, type: f.type })),
        folder
      });

      const uploadPromises = filesToUpload.map(async (file, index) => {
        try {
          console.log(`[MultiImageUpload] 파일 ${index + 1} 업로드 시작:`, file.name);
          const result = await uploadImage(file, folder);
          console.log(`[MultiImageUpload] 파일 ${index + 1} 업로드 결과:`, result);
          return result;
        } catch (error) {
          console.error(`[MultiImageUpload] 파일 ${index + 1} 업로드 에러:`, error);
          return { success: false, error: `${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      const successUrls: string[] = [];
      const failedUploads: string[] = [];

      results.forEach((result, index) => {
        if (result.success && result.url) {
          successUrls.push(result.url);
        } else {
          failedUploads.push(`${filesToUpload[index].name}: ${result.error || 'Unknown error'}`);
        }
      });

      console.log('[MultiImageUpload] 업로드 완료:', {
        successful: successUrls.length,
        failed: failedUploads.length,
        successUrls,
        failedUploads
      });

      if (failedUploads.length > 0) {
        alert(`일부 파일 업로드에 실패했습니다:\n${failedUploads.join('\n')}`);
      }

      if (successUrls.length > 0) {
        const newUrls = [...value, ...successUrls];
        onChange?.(newUrls);
      }
    } catch (error) {
      console.error('[MultiImageUpload] 전체 업로드 프로세스 에러:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      alert(`이미지 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    if (!disabled && !isUploading && value.length < maxImages) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = async (index: number) => {
    if (isUploading) return;

    try {
      const urlToDelete = value[index];
      
      // S3에서 이미지 삭제
      if (urlToDelete && isS3Url(urlToDelete)) {
        await deleteImage(urlToDelete);
      }

      const newUrls = value.filter((_, i) => i !== index);
      onChange?.(newUrls);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : "이미지 삭제 중 오류가 발생했습니다.";
      alert(`삭제 오류: ${errorMessage}`);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex self-stretch gap-[12px] flex-wrap">
        {/* 업로드된 이미지들 */}
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square border-2 border-dashed border-[#E5E5E5] rounded-lg overflow-hidden w-[150px] h-[150px]"
          >
            <img
              src={url}
              alt={`업로드 이미지 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {!disabled && !isUploading && (
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
              disabled || isUploading
                ? "cursor-not-allowed opacity-50"
                : "hover:border-gray-400"
            }`}
            onClick={handleUploadClick}
            style={{
              backgroundColor: "#FAFAFA",
            }}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#FF8796]" />
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
                  업로드 중...
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
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
