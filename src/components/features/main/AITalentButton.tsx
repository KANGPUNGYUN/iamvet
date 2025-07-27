import React, { useState, useEffect } from "react";
import Image from "next/image";

type ButtonVariant = "lightbomb" | "hospital";

interface AITalentButtonProps {
  title: string;
  description: string;
  variant?: ButtonVariant;
  imageSrc?: string;
  onClick?: () => void;
  className?: string;
}

const AITalentButton: React.FC<AITalentButtonProps> = ({
  title,
  description,
  variant = "lightbomb",
  imageSrc,
  onClick,
  className = "",
}) => {
  const [isWideScreen, setIsWideScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth > 1280);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isHospital = variant === "hospital";
  const backgroundColor = isHospital ? "#698CFC" : "#FF8796";
  const shadowColor = isHospital
    ? "rgba(105,140,252,0.3)"
    : "rgba(255,135,150,0.3)";

  return (
    <button
      onClick={onClick}
      className={`
        relative h-[76px] rounded-2xl 
        overflow-hidden cursor-pointer 
        transition-all duration-300 ease-out border-none
        hover:-translate-y-0.5 active:translate-y-0
        ${className}
      `}
      style={{
        backgroundColor,
        boxShadow: `0 8px 32px ${shadowColor}`,
        width: isWideScreen ? "307px" : "100%",
        minWidth: isWideScreen ? "307px" : "0",
        flexShrink: isWideScreen ? 0 : 1,
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${shadowColor}`;
      }}
    >
      {/* SVG 그라디언트 오버레이 */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute top-1/2 left-1/2 w-[170px] h-[170px] rounded-full"
          style={{
            transform: "translate(-60%, -50%) rotate(-44deg)",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
      </div>

      <div className="relative flex w-full h-full z-20">
        <div
          className="flex justify-center h-full relative"
          style={{
            width: isWideScreen ? "80px" : "60px",
          }}
        >
          {imageSrc && (
            <div
              className="relative"
              style={{
                width: isWideScreen ? "80px" : "60px",
                height: isWideScreen ? "80px" : "60px",
              }}
            >
              <Image
                src={imageSrc}
                alt={`${variant} icon`}
                fill
                className="object-contain mt-[10px] ml-[4px]"
                style={{ transform: "scale(1.0)" }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 p-[10px]">
          <div
            className="flex flex-col items-start gap-0.5"
            style={{ width: isWideScreen ? "176px" : "100%" }}
          >
            <h3 className="text-white font-text font-extrabold text-xl leading-[135%] m-0">
              {title}
            </h3>
            <p className="text-white font-text font-medium text-sm leading-[135%] m-0 opacity-90">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-center w-8 h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="33"
              viewBox="0 0 32 33"
              fill="none"
            >
              <path
                d="M9.3335 23.1668L22.6668 9.8335M22.6668 9.8335H9.3335M22.6668 9.8335V23.1668"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};

export default AITalentButton;
