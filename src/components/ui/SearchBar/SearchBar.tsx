import React, { useState, CSSProperties } from "react";
import { SearchBarProps, SearchBarState } from "./types";

export const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSearch,
  placeholder = "검색어를 입력하세요",
  disabled = false,
  error = false,
  success = false,
  state: externalState,
  showSearchIcon = true,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // 실제 사용할 값 결정
  const finalValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  // 상태 계산
  const calculateState = (): SearchBarState => {
    if (externalState) return externalState;
    if (isFocused) return "focus";
    if (isHovered) return "hover";
    return "default";
  };

  const currentState = calculateState();

  // 컨테이너가 활성 상태인지 확인 (호버 또는 포커스)
  const isContainerActive =
    currentState === "hover" || currentState === "focus";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!disabled) {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onSearch?.(finalValue);
    }
  };

  const handleSearchClick = () => {
    if (!disabled) {
      onSearch?.(finalValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 컨테이너 전체에 마우스 이벤트 적용
  const handleContainerMouseEnter = () => {
    setIsHovered(true);
  };

  const handleContainerMouseLeave = () => {
    setIsHovered(false);
  };

  // 검색 아이콘 컴포넌트
  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M17.25 9.75C17.25 7.76088 16.4598 5.85322 15.0533 4.4467C13.6468 3.04018 11.7391 2.25 9.75 2.25C7.76088 2.25 5.85322 3.04018 4.4467 4.4467C3.04018 5.85322 2.25 7.76088 2.25 9.75C2.25 11.7391 3.04018 13.6468 4.4467 15.0533C5.85322 16.4598 7.76088 17.25 9.75 17.25C11.7391 17.25 13.6468 16.4598 15.0533 15.0533C16.4598 13.6468 17.25 11.7391 17.25 9.75ZM15.8016 17.3953C14.1422 18.7125 12.0375 19.5 9.75 19.5C4.36406 19.5 0 15.1359 0 9.75C0 4.36406 4.36406 0 9.75 0C15.1359 0 19.5 4.36406 19.5 9.75C19.5 12.0375 18.7125 14.1422 17.3953 15.8016L23.6719 22.0781C24.1125 22.5188 24.1125 23.2313 23.6719 23.6672C23.2313 24.1031 22.5188 24.1078 22.0828 23.6672L15.8016 17.3953Z"
        fill={isContainerActive && !disabled ? "white" : "#707687"}
      />
    </svg>
  );

  // CSS 변수
  const cssVariables = {
    "--text-guidetext": "#C5CCD8",
    "--text-main": "#3B394D",
    "--text-sub": "#707687",
    "--line-highlight": "#CACAD2",
    "--background-default": "#FFF",
    "--box-default": "#FBFBFB",
  };

  // 컨테이너 스타일
  const containerStyle = {
    ...cssVariables,
    position: "relative" as const,
    display: "flex",
    width: "280px",
    maxWidth: "100%",
    height: "40px",
    alignItems: "center",
    gap: "0px",
    flexShrink: 0,
    borderRadius: "100px",
    border: "1px solid var(--line-highlight)",
    background: "var(--background-default)",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "default",
  };

  // 입력 필드 스타일
  const inputStyle = {
    flex: 1,
    height: "100%",
    paddingLeft: "16px",
    paddingRight: showSearchIcon ? "0px" : "16px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "var(--text-main)",
    fontFamily:
      "SUIT, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "150%",
    cursor: disabled ? "not-allowed" : "text",
  };

  // 검색 버튼 스타일
  const searchButtonStyle = {
    display: "flex",
    width: "64px",
    height: "100%",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    flexShrink: 0,
    borderRadius: "95px",
    border: "none",
    background:
      isContainerActive && !disabled ? "var(--text-sub)" : "var(--box-default)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
  };

  // 반응형 스타일
  const responsiveStyle = {
    width: "100%",
    maxWidth: "min(280px, calc(100vw - 32px))",
  };

  const finalContainerStyle = {
    ...containerStyle,
    ...responsiveStyle,
  };

  return (
    <>
      <style>{`
        .search-bar-input::placeholder {
          color: var(--text-guidetext);
          font-family: SUIT, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 150%;
        }
        
        @media (min-width: 640px) {
          .search-bar-container {
            max-width: 320px;
          }
        }
        
        @media (min-width: 768px) {
          .search-bar-container {
            max-width: 360px;
          }
        }
        
        @media (min-width: 1024px) {
          .search-bar-container {
            max-width: 400px;
          }
        }
      `}</style>
      <div
        className={`search-bar-container ${className}`}
        style={finalContainerStyle}
        onMouseEnter={handleContainerMouseEnter}
        onMouseLeave={handleContainerMouseLeave}
      >
        <input
          type="text"
          value={finalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="search-bar-input"
          style={inputStyle}
          aria-invalid={error}
          aria-disabled={disabled}
          role="searchbox"
          aria-label="검색"
        />
        {showSearchIcon && (
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={disabled}
            style={searchButtonStyle}
            aria-label="검색 실행"
          >
            <SearchIcon />
          </button>
        )}
        {children}
      </div>
    </>
  );
};
