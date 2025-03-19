/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },

    screens: {
      xs: "650px",
      // => @media (min-width: 450px) { ... }

      sm: "768px",
      // => @media (min-width: 576px) { ... }

      md: "950px",
      // => @media (min-width: 768px) { ... }

      lg: "1400px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      "2xl": "1440px",
      // => @media (min-width: 1400px) { ... }
    },
    extend: {
      colors: {
        primary: "#3E53D7",
        secondary: "#565758",
        background: "#F8F9FD",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-gradient":
          "linear-gradient(98.09deg, rgba(234, 236, 250, 1) 0%, rgba(236, 248, 242, 1) 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
