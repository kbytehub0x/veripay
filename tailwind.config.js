/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paypal: {
          blue: "#003087",
          lightBlue: "#0070BA",
          navy: "#001C40",
          yellow: "#FFC439",
          gray: "#F5F7FA"
        }
      }
    },
  },
  plugins: [],
};
