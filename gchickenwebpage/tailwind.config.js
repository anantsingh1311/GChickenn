/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#062f24",
          forest: "#0b4a37",
          meadow: "#146049",
          moss: "#1f7a5c",
          gold: "#d8b45b",
          cream: "#f6edd2",
          sand: "#e7d9a8",
          line: "rgba(216, 180, 91, 0.28)"
        }
      },
      fontFamily: {
        display: ['"Georgia"', '"Times New Roman"', "serif"],
        body: ['"Trebuchet MS"', '"Segoe UI"', "sans-serif"],
        script: ['"Great Vibes"', "cursive"]
      },
      boxShadow: {
        glow: "0 22px 60px rgba(6, 47, 36, 0.24)",
        panel: "0 18px 44px rgba(3, 24, 18, 0.26)"
      },
      backgroundImage: {
        "brand-gradient":
          "radial-gradient(circle at top, rgba(216, 180, 91, 0.16), transparent 38%), linear-gradient(180deg, #0f4f3a 0%, #083627 100%)",
        "hero-overlay":
          "linear-gradient(135deg, rgba(6, 47, 36, 0.9), rgba(11, 74, 55, 0.65))"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
        shimmer: "shimmer 10s linear infinite"
      }
    }
  },
  plugins: []
};
