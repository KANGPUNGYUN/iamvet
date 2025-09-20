'use client';

import React, { useState } from 'react';
import { TokenDebugger } from './TokenDebugger';

interface DebugPanelProps {
  enabledComponents?: ('token' | 'auth' | 'storage')[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * 통합 디버깅 패널
 * 개발 환경에서만 사용하세요
 */
export function DebugPanel({ 
  enabledComponents = ['token', 'auth', 'storage'],
  position = 'bottom-right'
}: DebugPanelProps) {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  // 프로덕션에서는 렌더링하지 않음
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4', 
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const getButtonColor = (component: string) => {
    switch (component) {
      case 'token': return 'bg-blue-600 hover:bg-blue-700';
      case 'auth': return 'bg-green-600 hover:bg-green-700';
      case 'storage': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getButtonText = (component: string) => {
    switch (component) {
      case 'token': return '🔑 토큰';
      case 'auth': return '🔐 인증';
      case 'storage': return '💾 저장소';
      default: return component;
    }
  };

  return (
    <>
      {/* 디버그 버튼들 */}
      <div className={`fixed ${positionClasses[position]} z-50 space-y-2`}>
        {enabledComponents.map(component => (
          <button
            key={component}
            onClick={() => setActiveComponent(component)}
            className={`block w-full text-white px-3 py-2 rounded shadow-lg text-sm font-medium transition-colors ${getButtonColor(component)}`}
          >
            {getButtonText(component)}
          </button>
        ))}
      </div>

      {/* 활성 컴포넌트 */}
      {activeComponent === 'token' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative">
            <TokenDebugger />
            <button
              onClick={() => setActiveComponent(null)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {activeComponent === 'auth' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">인증 상태</h3>
              <button
                onClick={() => setActiveComponent(null)}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center text-gray-500">
              인증 상태 디버거는 추후 구현 예정입니다.
            </div>
          </div>
        </div>
      )}

      {activeComponent === 'storage' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">저장소 상태</h3>
              <button
                onClick={() => setActiveComponent(null)}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center text-gray-500">
              저장소 디버거는 추후 구현 예정입니다.
            </div>
          </div>
        </div>
      )}
    </>
  );
}