/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  safelist: ['@xs:block', '@container'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: { sans: ['Inter', 'sans-serif'] }
  },
  plugins: [require('@tailwindcss/container-queries')],
};
