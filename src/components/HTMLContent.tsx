"use client";

import React from 'react';
import Image from 'next/image';

// Import transfer images
import transfer1 from '@/assets/images/transfer/transfer1.jpg';
import transfer2 from '@/assets/images/transfer/transfer2.jpg';
import transfer3 from '@/assets/images/transfer/transfer3.jpg';
import transfer4 from '@/assets/images/transfer/transfer4.jpg';
import transfer5 from '@/assets/images/transfer/transfer5.jpg';
import transfer6 from '@/assets/images/transfer/transfer6.jpg';
import transfer7 from '@/assets/images/transfer/transfer7.jpg';
import transfer8 from '@/assets/images/transfer/transfer8.jpg';

// Image mapping for assets
const imageMap: Record<string, any> = {
  '/assets/images/transfer/transfer1.jpg': transfer1,
  '/assets/images/transfer/transfer2.jpg': transfer2,
  '/assets/images/transfer/transfer3.jpg': transfer3,
  '/assets/images/transfer/transfer4.jpg': transfer4,
  '/assets/images/transfer/transfer5.jpg': transfer5,
  '/assets/images/transfer/transfer6.jpg': transfer6,
  '/assets/images/transfer/transfer7.jpg': transfer7,
  '/assets/images/transfer/transfer8.jpg': transfer8,
};

interface HTMLContentProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

interface ParsedElement {
  type: 'text' | 'image' | 'element';
  content?: string;
  src?: string;
  alt?: string;
  style?: string;
  tag?: string;
  props?: Record<string, string>;
  children?: ParsedElement[];
}

export const HTMLContent: React.FC<HTMLContentProps> = ({ 
  content, 
  className = '', 
  style 
}) => {
  // HTML을 파싱하여 React 요소로 변환
  const parseHTML = (htmlString: string): ParsedElement[] => {
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
      const container = doc.body.firstChild as Element;
      
      return parseElement(container).children || [];
    } catch (error) {
      console.error('HTML parsing error:', error);
      return [];
    }
  };

  const parseElement = (element: Node): ParsedElement => {
    if (element.nodeType === Node.TEXT_NODE) {
      return {
        type: 'text',
        content: element.textContent || ''
      };
    }

    if (element.nodeType === Node.ELEMENT_NODE) {
      const el = element as Element;
      
      if (el.tagName.toLowerCase() === 'img') {
        return {
          type: 'image',
          src: el.getAttribute('src') || '',
          alt: el.getAttribute('alt') || '',
          style: el.getAttribute('style') || ''
        };
      }

      // 다른 HTML 요소들
      const children: ParsedElement[] = [];
      element.childNodes.forEach(child => {
        children.push(parseElement(child));
      });

      const props: Record<string, string> = {};
      if (el.attributes) {
        Array.from(el.attributes).forEach(attr => {
          props[attr.name] = attr.value;
        });
      }

      return {
        type: 'element',
        tag: el.tagName.toLowerCase(),
        props,
        children
      };
    }

    return { type: 'text', content: '' };
  };

  // CSS 스타일 문자열을 객체로 파싱
  const parseStyleString = (styleString: string): React.CSSProperties => {
    const styles: Record<string, string> = {};
    if (styleString) {
      styleString.split(';').forEach(style => {
        const [property, value] = style.split(':').map(s => s.trim());
        if (property && value) {
          // CSS 속성을 camelCase로 변환
          const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          styles[camelProperty] = value;
        }
      });
    }
    return styles as React.CSSProperties;
  };

  // ParsedElement를 React 요소로 렌더링
  const renderElement = (element: ParsedElement, index: number): React.ReactNode => {
    if (element.type === 'text') {
      return element.content;
    }

    if (element.type === 'image') {
      const imageStyles = parseStyleString(element.style || '');
      const width = imageStyles.width || '100%';
      const maxWidth = imageStyles.maxWidth || '500px';
      const margin = imageStyles.margin || '20px 0';
      const borderRadius = imageStyles.borderRadius || '8px';

      // Convert src/assets paths to imported images
      let imageSrc = element.src || '';
      
      if (imageMap[imageSrc]) {
        imageSrc = imageMap[imageSrc];
      }

      return (
        <div
          key={index}
          style={{
            width,
            maxWidth,
            margin,
            borderRadius,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Image
            src={imageSrc}
            alt={element.alt || ''}
            width={500}
            height={300}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius
            }}
            onError={(e) => {
              // 이미지 로드 실패 시 플레이스홀더로 대체
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    if (element.type === 'element' && element.tag && element.children) {
      const { style: styleAttr, ...otherProps } = element.props || {};
      const elementStyles = styleAttr ? parseStyleString(styleAttr) : {};

      // React 요소 생성
      return React.createElement(
        element.tag,
        {
          key: index,
          style: elementStyles,
          ...otherProps
        },
        element.children.map((child, childIndex) => 
          renderElement(child, childIndex)
        )
      );
    }

    return null;
  };

  const parsedContent = React.useMemo(() => {
    try {
      return parseHTML(content);
    } catch (error) {
      console.error('HTML parsing error:', error);
      return [];
    }
  }, [content]);

  // Fallback to dangerouslySetInnerHTML if parsing fails or on server side
  if (typeof window === 'undefined' || parsedContent.length === 0) {
    return (
      <div 
        className={`prose max-w-none ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div 
      className={`prose max-w-none ${className}`}
      style={style}
    >
      {parsedContent.map((element, index) => renderElement(element, index))}
    </div>
  );
};