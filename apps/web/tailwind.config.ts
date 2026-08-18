import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        of: {
          bg: "#0B0B0F",
          surface: "#15151B",
          primary: "#E80000",
          primaryHover: "#C90000",
          text: "#FCFAF4",
          muted: "#A7A7B0",
          border: "#292930"
        }
      },
      boxShadow: {
        card: "0 8px 30px rgb(0 0 0 / 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
