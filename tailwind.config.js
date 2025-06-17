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
        // Title font weights (limited)
        "title-light": "var(--title-weight-light)", // 400
        "title-medium": "var(--title-weight-medium)", // 500
        "title-bold": "var(--title-weight-bold)", // 700

        // Text font weights (full range)
        "text-thin": "var(--text-weight-thin)", // 100
        "text-extralight": "var(--text-weight-extralight)", // 200
        "text-light": "var(--text-weight-light)", // 300
        "text-regular": "var(--text-weight-regular)", // 400
        "text-medium": "var(--text-weight-medium)", // 500
        "text-semibold": "var(--text-weight-semibold)", // 600
        "text-bold": "var(--text-weight-bold)", // 700
        "text-extrabold": "var(--text-weight-extrabold)", // 800
        "text-heavy": "var(--text-weight-heavy)", // 900

        // Generic weights (mapped to text font weights)
        thin: "var(--text-weight-thin)",
        extralight: "var(--text-weight-extralight)",
        light: "var(--text-weight-light)",
        normal: "var(--text-weight-regular)",
        medium: "var(--text-weight-medium)",
        semibold: "var(--text-weight-semibold)",
        bold: "var(--text-weight-bold)",
        extrabold: "var(--text-weight-extrabold)",
        black: "var(--text-weight-heavy)",
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

        // 키 컬러 (메인 브랜드 색상)
        key1: "var(--color-keycolor1)",
        key2: "var(--color-keycolor2)",
        key3: "var(--color-keycolor3)",
        key4: "var(--color-keycolor4)",
        key5: "var(--color-keycolor5)",

        // 서브 컬러 (보조 색상)
        sub1: "var(--color-subcolor1)",
        sub2: "var(--color-subcolor2)",
        sub3: "var(--color-subcolor3)",
        sub4: "var(--color-subcolor4)",
        sub5: "var(--color-subcolor5)",

        // 기존 shadcn/ui 색상 시스템 유지 (필요한 경우)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
};
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
        light: "var(--font-weight-light)",
        regular: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
      },
      lineHeight: {
        tight: "var(--leading-tight)",
        snug: "var(--leading-snug)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
        loose: "var(--leading-loose)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
};
