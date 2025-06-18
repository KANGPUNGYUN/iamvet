// src/components/ui/Button/ButtonRoot.tsx
import React from "react";
import { ButtonProps } from "./types";

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "medium",
      buttonType = "normal",
      device = "web",
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      className = "",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? "span" : "button";

    // 피그마 디자인시스템에 맞는 클래스명 생성
    const getButtonClass = () => {
      let baseClass = "button-base";

      // 버튼 타입별 클래스
      if (buttonType === "icon-web") {
        baseClass += " button-icon-web";
      } else if (buttonType === "icon-app") {
        baseClass += " button-icon-app";
      } else if (buttonType === "more") {
        baseClass += " button-more";
      } else {
        // 일반 버튼의 경우 크기별 클래스
        baseClass += ` button-${size}`;

        // variant가 disable이 아닌 경우에만 variant 클래스 추가
        if (variant !== "disable" && !disabled) {
          baseClass += ` button-${size}-${variant}`;
        } else {
          baseClass += ` button-${size}-disable`;
        }
      }

      return baseClass;
    };

    // 데이터 속성으로 스타일 정보 전달
    const dataAttributes = {
      "data-variant": variant,
      "data-size": size,
      "data-button-type": buttonType,
      "data-device": device,
      "data-disabled": disabled || variant === "disable",
      "data-loading": loading,
      "data-icon-position": iconPosition,
      "data-has-icon": !!icon,
      "data-has-text": !!children,
    };

    return (
      <Component
        ref={ref as any}
        disabled={disabled || loading || variant === "disable"}
        className={`${getButtonClass()} ${className}`}
        {...dataAttributes}
        {...props}
      >
        {/* 로딩 스피너 */}
        {loading && (
          <span className="button-spinner" data-testid="button-spinner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeOpacity="0.3"
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="12 12"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 8 8;360 8 8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </span>
        )}

        {/* 아이콘과 텍스트 컨테이너 */}
        <span className="button-content" style={{ opacity: loading ? 0 : 1 }}>
          {icon && iconPosition === "left" && (
            <span className="button-icon button-icon-left">{icon}</span>
          )}

          {children && (
            <span
              className={`button-text ${
                buttonType === "more" ? "font-title" : "font-text"
              }`}
            >
              {children}
            </span>
          )}

          {icon && iconPosition === "right" && (
            <span className="button-icon button-icon-right">{icon}</span>
          )}
        </span>
      </Component>
    );
  }
);

ButtonRoot.displayName = "Button";

export { ButtonRoot };
