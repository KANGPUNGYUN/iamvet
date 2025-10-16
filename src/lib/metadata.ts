import { Metadata } from 'next';

/**
 * 검색엔진에서 제외해야 할 페이지에 대한 metadata 생성 유틸리티
 */
export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/**
 * 기존 metadata와 noindex metadata를 병합하는 유틸리티 함수
 * @param metadata 기존 metadata
 * @returns 병합된 metadata
 */
export const withNoIndex = (metadata: Metadata = {}): Metadata => {
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
};