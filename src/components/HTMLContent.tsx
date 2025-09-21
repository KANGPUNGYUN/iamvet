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

  // 링크를 새창으로 열도록 설정
  useEffect(() => {
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          // 외부 링크인지 확인하는 함수
          const isExternalLink = (url: string) => {
            // 프로토콜이 있는 경우
            if (url.startsWith('http://') || url.startsWith('https://')) {
              return true;
            }
            // www로 시작하는 경우
            if (url.startsWith('www.')) {
              return true;
            }
            // 도메인 패턴 확인 (점이 포함되고 슬래시로 시작하지 않는 경우)
            if (url.includes('.') && !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
              return true;
            }
            return false;
          };

          if (isExternalLink(href)) {
            // 프로토콜이 없는 경우 https:// 추가
            let fullUrl = href;
            if (!href.startsWith('http://') && !href.startsWith('https://')) {
              fullUrl = `https://${href}`;
            }

            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // 클릭 이벤트 추가하여 확실히 새창으로 열기
            link.addEventListener('click', (e) => {
              e.preventDefault();
              window.open(fullUrl, '_blank', 'noopener,noreferrer');
            });
          }
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