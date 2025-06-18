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
        // 기본 텍스트 색상
        "text-primary": "var(--color-text)",
        "text-sub": "var(--color-subtext)",
        "text-sub2": "var(--color-subtext2)",
        "text-guide": "var(--color-guidetext)",

        // 라인 색상
        line: "var(--color-line)",
        "line-highlight": "var(--color-line-highlight)",

        // 박스 색상
        box: "var(--color-box)",
        "box-disable": "var(--color-box-disable)",

        // 키 컬러
        key1: "var(--color-keycolor1)",
        key2: "var(--color-keycolor2)",
        key3: "var(--color-keycolor3)",
        key4: "var(--color-keycolor4)",
        key5: "var(--color-keycolor5)",

        // 서브 컬러
        sub1: "var(--color-subcolor1)",
        sub2: "var(--color-subcolor2)",
        sub3: "var(--color-subcolor3)",
        sub4: "var(--color-subcolor4)",
        sub5: "var(--color-subcolor5)",
      },
    },
  },
  plugins: [],
};
