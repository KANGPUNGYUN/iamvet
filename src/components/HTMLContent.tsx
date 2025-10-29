"use client";

import React, { useEffect, useRef } from 'react';
import '@/styles/html-content.css';

interface HTMLContentProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export const HTMLContent: React.FC<HTMLContentProps> = ({ 
  content, 
  className = '', 
  style = {} 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // 링크를 새창으로 열도록 설정 및 Quill 스타일 보정
  useEffect(() => {
    if (contentRef.current) {
      // 링크 처리
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          // 외부 링크인지 확인하는 함수
          const isExternalLink = (url: string) => {
            // 이미 완전한 URL인 경우
            if (url.startsWith('http://') || url.startsWith('https://')) {
              return true;
            }
            // www로 시작하는 경우
            if (url.startsWith('www.')) {
              return true;
            }
            // ftp, mailto, tel 등의 프로토콜
            if (url.startsWith('ftp://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
              return true;
            }
            // 내부 링크가 아닌 경우 (/, #, 상대경로가 아닌 경우)
            if (!url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
              // 도메인 패턴 확인 (점이 포함되고 일반적인 도메인 형태)
              const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
              if (domainPattern.test(url)) {
                return true;
              }
              // IP 주소 패턴
              const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/;
              if (ipPattern.test(url)) {
                return true;
              }
            }
            return false;
          };

          if (isExternalLink(href)) {
            // 프로토콜이 없는 경우 https:// 추가
            let fullUrl = href;
            if (!href.startsWith('http://') && !href.startsWith('https://')) {
              fullUrl = `https://${href}`;
            }

            console.log(`Processing external link: "${href}" -> "${fullUrl}"`);

            // href 속성도 올바른 URL로 업데이트
            link.setAttribute('href', fullUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // 클릭 이벤트 추가하여 Next.js 라우팅 가로채기 방지
            link.addEventListener('click', (e) => {
              console.log(`External link clicked: ${fullUrl}`);
              e.preventDefault();
              e.stopPropagation();
              window.open(fullUrl, '_blank', 'noopener,noreferrer');
            });

            // data-external 속성 추가하여 외부 링크임을 표시
            link.setAttribute('data-external', 'true');
          } else {
            console.log(`Internal link detected: "${href}"`);
          }
        }
      });

      // Quill 정렬 클래스가 있는 요소에 인라인 스타일 추가 (production 환경 대비)
      const alignedElements = contentRef.current.querySelectorAll('[class*="ql-align"]');
      alignedElements.forEach((element) => {
        if (element.classList.contains('ql-align-center')) {
          (element as HTMLElement).style.textAlign = 'center';
        } else if (element.classList.contains('ql-align-right')) {
          (element as HTMLElement).style.textAlign = 'right';
        } else if (element.classList.contains('ql-align-justify')) {
          (element as HTMLElement).style.textAlign = 'justify';
        }
      });

      // Quill 폰트 크기 클래스 처리
      const sizedElements = contentRef.current.querySelectorAll('[class*="ql-size"]');
      sizedElements.forEach((element) => {
        if (element.classList.contains('ql-size-small')) {
          (element as HTMLElement).style.fontSize = '0.75em';
        } else if (element.classList.contains('ql-size-large')) {
          (element as HTMLElement).style.fontSize = '1.5em';
        } else if (element.classList.contains('ql-size-huge')) {
          (element as HTMLElement).style.fontSize = '2.5em';
        }
      });
    }
  }, [content]);

  if (!content) {
    return (
      <div 
        className={`${className}`}
        style={style}
      >
        콘텐츠가 없습니다.
      </div>
    );
  }

  // HTML 태그가 포함된 경우 그대로 렌더링
  if (content.includes('<') && content.includes('>')) {
    // 디버깅을 위해 콘텐츠 확인
    console.log('HTML Content:', content);
    
    return (
      <div 
        ref={contentRef}
        className={`html-content ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // 일반 텍스트는 pre 태그로 줄바꿈과 공백 보존
  return (
    <pre 
      className={`whitespace-pre-wrap font-sans text-[16px] leading-relaxed ${className}`}
      style={{
        fontFamily: 'SUIT, sans-serif',
        margin: 0,
        ...style
      }}
    >
      {content}
    </pre>
  );
};