module.exports = {
    darkMode: "class", // Ensure dark mode is enabled
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", 
      "./components/**/*.{js,ts,jsx,tsx}",
      "./styles/**/*.css",  // Ensure Tailwind scans CSS files
      "./app/globals.css" // Add this if using global styles
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  