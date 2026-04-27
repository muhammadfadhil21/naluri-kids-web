import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Warna Utama: Kuning Cerah Poster
        primary: {
          DEFAULT: "#F9D423",
          foreground: "#1E40AF", // Tulisan di atas kuning jadi Biru Tua
        },
        // Warna Sekunder: Biru Poster
        secondary: {
          DEFAULT: "#1E40AF",
          foreground: "#FFFFFF", // Tulisan di atas biru jadi Putih
        },
        // Warna Aksen: Merah (seperti balon HTM 135K)
        accent: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      // Menambahkan font yang lebih ramah anak (opsional)
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;