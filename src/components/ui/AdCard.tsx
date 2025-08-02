import React from "react";

interface AdCardProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "blue";
  onClick?: () => void;
}

const AdCard: React.FC<AdCardProps> = ({
  title = "가산점",
  subtitle = "어떤 과목 선택도 부담없이!\n강의 들어 가산점으로 환산받자!",
  variant = "default",
  onClick,
}) => {
  const getBackgroundStyle = () => {
    if (variant === "blue") {
      return {
        background: "linear-gradient(90deg, #809DFF 0%, #39B3FF 100%)",
      };
    }
    return {
      background: "linear-gradient(135deg, #B8E6B8 0%, #4ECDC4 100%)",
    };
  };

  return (
    <div
      className="w-full bg-transparent shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer rounded-[16px] border border-[1px] border-[#EFEFF0] relative"
      style={{
        ...getBackgroundStyle(),
        borderColor: "transparent",
      }}
      onClick={onClick}
    >
      {/* 데스크톱 레이아웃 */}
      <div className="hidden sm:block">
        <div className="relative h-48 p-6 flex flex-col justify-between text-white">
          {/* 상단 아이콘 영역 */}
          <div className="flex justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M9.33325 22.6654L22.6666 9.33203M22.6666 9.33203H9.33325M22.6666 9.33203V22.6654"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 하단 텍스트 영역 */}
          <div>
            <h3 className="font-title title-medium text-[24px] mb-2 text-white">
              {title}
            </h3>
            <p className="font-text text-[14px] text-medium text-white opacity-90 whitespace-pre-line">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="sm:hidden">
        <div
          className="relative flex flex-row text-white"
          style={{
            height: "130px",
            padding: "8px",
          }}
        >
          {/* 텍스트 영역 */}
          <div className="flex-1 flex flex-col justify-between p-2">
            <div>
              <h3 className="font-title text-[14px] font-bold mb-1 text-white">
                {title}
              </h3>
              <p className="font-text text-[10px] text-white opacity-90 whitespace-pre-line line-clamp-3">
                {subtitle}
              </p>
            </div>
          </div>

          {/* 아이콘 영역 */}
          <div className="flex items-start justify-end p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M9.33325 22.6654L22.6666 9.33203M22.6666 9.33203H9.33325M22.6666 9.33203V22.6654"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
