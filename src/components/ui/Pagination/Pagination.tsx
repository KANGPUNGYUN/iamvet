// src/components/ui/Pagination/Pagination.tsx
"use client";

import React from "react";
import { PaginationProps } from "./types";
import { PaginationContext } from "./PaginationContext";
import { PaginationButton } from "./PaginationButton";

// 기존 아이콘들을 사용
const PrevIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M10.06 12L11 11.06L7.94667 8L11 4.94L10.06 4L6.06 8L10.06 12Z"
      fill={currentColor}
    />
  </svg>
);

const NextIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M6.94 4L6 4.94L9.05333 8L6 11.06L6.94 12L10.94 8L6.94 4Z"
      fill={currentColor}
    />
  </svg>
);

const MoreIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 13 2"
    fill="none"
  >
    <circle cx="1.5" cy="1" r="1" fill={currentColor} />
    <circle cx="6.5" cy="1" r="1" fill={currentColor} />
    <circle cx="11.5" cy="1" r="1" fill={currentColor} />
  </svg>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  maxVisiblePages = 7,
}) => {
  // 페이지 범위 계산 로직
  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 최대 표시 개수보다 적으면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const sidePages = Math.floor((maxVisiblePages - 3) / 2); // 양쪽에 표시할 페이지 수 (첫/마지막/ellipsis 제외)

      if (currentPage <= sidePages + 2) {
        // 현재 페이지가 앞쪽에 있을 때
        for (let i = 1; i <= maxVisiblePages - 2; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - sidePages - 1) {
        // 현재 페이지가 뒤쪽에 있을 때
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - maxVisiblePages + 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 현재 페이지가 중간에 있을 때
        pages.push(1);
        pages.push("ellipsis");
        for (
          let i = currentPage - sidePages;
          i <= currentPage + sidePages;
          i++
        ) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center" as const,
    gap: "8px",
    justifyContent: "center" as const,
  };

  return (
    <PaginationContext.Provider
      value={{ currentPage, totalPages, onPageChange }}
    >
      <nav
        className={`pagination ${className}`}
        role="navigation"
        aria-label="페이지네이션"
        style={containerStyle}
      >
        {/* 이전 버튼 */}
        <PaginationButton disabled={currentPage === 1} onClick={handlePrevPage}>
          <PrevIcon
            currentColor={currentPage === 1 ? "#9098A4" : "currentColor"}
          />
        </PaginationButton>

        {/* 페이지 번호들 */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationButton
                key={`ellipsis-${index}`}
                disabled={true}
                state="disabled"
              >
                <MoreIcon currentColor="#9098A4" />
              </PaginationButton>
            );
          }

          return (
            <PaginationButton
              key={page}
              isActive={currentPage === page}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </PaginationButton>
          );
        })}

        {/* 다음 버튼 */}
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          <NextIcon
            currentColor={
              currentPage === totalPages ? "#9098A4" : "currentColor"
            }
          />
        </PaginationButton>
      </nav>
    </PaginationContext.Provider>
  );
};

Pagination.displayName = "Pagination";

export { Pagination };
