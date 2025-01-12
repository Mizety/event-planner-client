import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Outfit for headlines - geometric, modern look
        sans: [
          "Outfit",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        // Space Grotesk for body - technical, unique character shapes
        body: [
          "Space Grotesk",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        // Fira Code for monospace - coding ligatures, tech feel
        mono: [
          "Fira Code",
          "JetBrains Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        sm: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        base: ["1rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
        xl: ["1.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "3xl": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "4xl": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "5xl": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "6xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "7xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "8xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "9xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      lineHeight: {
        none: "1",
        tight: "1.1",
        snug: "1.2",
        normal: "1.6",
        relaxed: "1.8",
        loose: "2",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
        normal: "0",
        wide: "0.02em",
        wider: "0.03em",
        widest: "0.04em",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
