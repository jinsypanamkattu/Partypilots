module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in src
    ],
    theme: {
      extend: {
        colors: {
          primary: '#6D28D9', // Custom primary color
          secondary: '#DB2777', // Custom secondary color
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'], // Custom font
        },
        screens: {
          '3xl': '1920px', // Custom breakpoint
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'), // Tailwind Forms plugin
      require('@tailwindcss/typography'), // Tailwind Typography plugin
    ],
  };