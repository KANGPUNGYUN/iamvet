"use client";

import React from "react";

interface HospitalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export const HospitalAuthModal: React.FC<HospitalAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 콘텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* 내용 */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            병원 계정만 접근 가능합니다
          </h2>
          <p className="text-gray-600 leading-relaxed">
            이력서 목록과 상세 정보는 개인정보 보호를 위해<br />
            병원 계정으로 로그인한 사용자만 열람할 수 있습니다.
          </p>
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="w-full bg-[#FF8796] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#ff7084] transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};