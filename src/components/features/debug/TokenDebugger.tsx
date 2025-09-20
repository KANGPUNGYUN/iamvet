'use client';

import React, { useState, useEffect } from 'react';
import { decodeJWT, isTokenExpired, getTokenExpirationTime, getTokenIssuedTime, getTokenExpirationDate } from '@/lib/jwt-client';
import type { DecodedToken } from '@/lib/jwt-client';

interface TokenInfo {
  token: string | null;
  decoded: DecodedToken | null;
  isExpired: boolean;
  expirationTime: number | null;
  issuedDate: Date | null;
  expirationDate: Date | null;
}

interface LocalStorageData {
  accessToken: string | null;
  refreshToken: string | null;
  userType: string | null;
  profile: any;
  [key: string]: any;
}

export function TokenDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [accessTokenInfo, setAccessTokenInfo] = useState<TokenInfo | null>(null);
  const [refreshTokenInfo, setRefreshTokenInfo] = useState<TokenInfo | null>(null);
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData>({
    accessToken: null,
    refreshToken: null,
    userType: null,
    profile: null,
  });
  const [allLocalStorageKeys, setAllLocalStorageKeys] = useState<string[]>([]);

  const analyzeToken = (token: string | null): TokenInfo => {
    if (!token) {
      return {
        token: null,
        decoded: null,
        isExpired: true,
        expirationTime: null,
        issuedDate: null,
        expirationDate: null,
      };
    }

    const decoded = decodeJWT(token);
    const expired = isTokenExpired(token);
    const expirationTime = getTokenExpirationTime(token);
    const issuedDate = getTokenIssuedTime(token);
    const expirationDate = getTokenExpirationDate(token);

    return {
      token,
      decoded,
      isExpired: expired,
      expirationTime,
      issuedDate,
      expirationDate,
    };
  };

  const refreshData = () => {
    if (typeof window === 'undefined') return;

    // localStorage에서 토큰 정보 가져오기
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userType = localStorage.getItem('userType');
    const profileStr = localStorage.getItem('profile');
    
    let profile = null;
    try {
      profile = profileStr ? JSON.parse(profileStr) : null;
    } catch (error) {
      console.error('Profile 파싱 오류:', error);
    }

    // 모든 localStorage 키 가져오기
    const allKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('auth') || 
      key.includes('token') || 
      key.includes('user') || 
      key.includes('profile')
    );

    // 추가 localStorage 데이터
    const additionalData: any = {};
    allKeys.forEach(key => {
      if (!['accessToken', 'refreshToken', 'userType', 'profile'].includes(key)) {
        try {
          const value = localStorage.getItem(key);
          additionalData[key] = value ? JSON.parse(value) : value;
        } catch {
          additionalData[key] = localStorage.getItem(key);
        }
      }
    });

    setLocalStorageData({
      accessToken,
      refreshToken,
      userType,
      profile,
      ...additionalData,
    });

    setAllLocalStorageKeys(allKeys);

    // 토큰 분석
    setAccessTokenInfo(analyzeToken(accessToken));
    setRefreshTokenInfo(analyzeToken(refreshToken));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearLocalStorage = () => {
    if (confirm('모든 localStorage 데이터를 삭제하시겠습니까?')) {
      localStorage.clear();
      refreshData();
    }
  };

  const removeSpecificKey = (key: string) => {
    if (confirm(`"${key}" 키를 삭제하시겠습니까?`)) {
      localStorage.removeItem(key);
      refreshData();
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleString('ko-KR');
  };

  const TokenInfoDisplay = ({ title, tokenInfo }: { title: string; tokenInfo: TokenInfo | null }) => (
    <div className="border rounded p-4 mb-4">
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      {tokenInfo?.token ? (
        <div className="space-y-2">
          <div>
            <span className="font-medium">토큰 상태: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              tokenInfo.isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {tokenInfo.isExpired ? '만료됨' : '유효함'}
            </span>
          </div>
          
          {tokenInfo.decoded && (
            <>
              <div><span className="font-medium">사용자 ID:</span> {tokenInfo.decoded.userId}</div>
              <div><span className="font-medium">사용자 타입:</span> {tokenInfo.decoded.userType}</div>
              <div><span className="font-medium">이메일:</span> {tokenInfo.decoded.email}</div>
            </>
          )}
          
          <div><span className="font-medium">발급 시간:</span> {formatDate(tokenInfo.issuedDate)}</div>
          <div><span className="font-medium">만료 시간:</span> {formatDate(tokenInfo.expirationDate)}</div>
          <div><span className="font-medium">남은 시간:</span> {tokenInfo.expirationTime ? `${tokenInfo.expirationTime}분` : 'N/A'}</div>
          
          <div className="mt-2">
            <span className="font-medium">원본 토큰:</span>
            <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
              {tokenInfo.token}
              <button 
                onClick={() => copyToClipboard(tokenInfo.token!)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                복사
              </button>
            </div>
          </div>
          
          {tokenInfo.decoded && (
            <div className="mt-2">
              <span className="font-medium">디코딩된 페이로드:</span>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(tokenInfo.decoded, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500">토큰이 없습니다</div>
      )}
    </div>
  );

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700"
        >
          토큰 디버거
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">토큰 & 사용자 정보 디버거</h2>
            <div className="space-x-2">
              <button
                onClick={refreshData}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                새로고침
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                닫기
              </button>
            </div>
          </div>

          {/* 기본 사용자 정보 */}
          <div className="border rounded p-4 mb-4">
            <h4 className="font-semibold text-lg mb-2">기본 사용자 정보</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">사용자 타입:</span> {localStorageData.userType || 'N/A'}</div>
              <div><span className="font-medium">프로필 존재:</span> {localStorageData.profile ? '있음' : '없음'}</div>
            </div>
            {localStorageData.profile && (
              <div className="mt-2">
                <span className="font-medium">프로필 데이터:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(localStorageData.profile, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 토큰 정보 */}
          <TokenInfoDisplay title="Access Token" tokenInfo={accessTokenInfo} />
          <TokenInfoDisplay title="Refresh Token" tokenInfo={refreshTokenInfo} />

          {/* 모든 localStorage 데이터 */}
          <div className="border rounded p-4 mb-4">
            <h4 className="font-semibold text-lg mb-2">모든 localStorage 데이터</h4>
            <div className="space-y-2">
              {allLocalStorageKeys.map(key => {
                const value = localStorage.getItem(key);
                return (
                  <div key={key} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{key}:</span>
                      <button
                        onClick={() => removeSpecificKey(key)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                    <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                      {value}
                      {value && (
                        <button 
                          onClick={() => copyToClipboard(value)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          복사
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4">
              <button
                onClick={clearLocalStorage}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                모든 localStorage 삭제
              </button>
            </div>
          </div>

          {/* 쿠키 정보 */}
          <div className="border rounded p-4">
            <h4 className="font-semibold text-lg mb-2">쿠키 정보</h4>
            <div className="text-xs bg-gray-100 p-2 rounded break-all">
              {document.cookie || '쿠키가 없습니다'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}