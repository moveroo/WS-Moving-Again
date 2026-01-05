import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#800006', // Deep Red (Primary CTA)
          yellow: '#F1C40D', // Vivid Yellow (Secondary CTA)
          accent: '#B23850', // Logo Red
          dark: '#191919', // Text/Dark BG
          light: '#FAFAFA', // Page Backgrounds
          gray: '#333333', // Dark borders/footer
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        brand: '20px', // Pill shape for buttons
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
      },
    },
  },
  plugins: [typography],
};
