/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-title)"],
        text: ["var(--font-text)"],
      },
      fontWeight: {
        // Title font weights
        "title-light": "var(--title-weight-light)",
        "title-medium": "var(--title-weight-medium)",
        "title-bold": "var(--title-weight-bold)",

        // Text font weights
        "text-thin": "var(--text-weight-thin)",
        "text-extralight": "var(--text-weight-extralight)",
        "text-light": "var(--text-weight-light)",
        "text-regular": "var(--text-weight-regular)",
        "text-medium": "var(--text-weight-medium)",
        "text-semibold": "var(--text-weight-semibold)",
        "text-bold": "var(--text-weight-bold)",
        "text-extrabold": "var(--text-weight-extrabold)",
        "text-heavy": "var(--text-weight-heavy)",
      },
      colors: {
        // 기본 텍스트 색상 (colors.css의 CSS 변수와 일치)
        primary: "var(--Text)",
        subtext: "var(--Subtext)", 
        subtext2: "var(--Subtext2)",
        guidetext: "var(--Guidetext)",

        // 라인 색상
        line: "var(--Line)",
        "line-highlight": "var(--Line_Highlight)",

        // 박스 색상
        box: "var(--Box)",
        "box-light": "var(--Box_Light)",
        "box-disable": "var(--Box_Disable)",

        // 키 컬러 (메인 브랜드 색상)
        keycolor1: "var(--Keycolor1)",
        keycolor2: "var(--Keycolor2)", 
        keycolor3: "var(--Keycolor3)",
        keycolor4: "var(--Keycolor4)",
        keycolor5: "var(--Keycolor5)",

        // 서브 컬러 (보조 색상)
        subcolor1: "var(--Subcolor1)",
        subcolor2: "var(--Subcolor2)",
        subcolor3: "var(--Subcolor3)",
        subcolor4: "var(--Subcolor4)",
        subcolor5: "var(--Subcolor5)",
      },
    },
  },
  plugins: [],
};
