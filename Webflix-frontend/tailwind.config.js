/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    
    extend: {
      colors: {
        light: '#F5F5F5',
        primary: '#FC4747',
        dark: '#10141E',
        grey: '#5A698F',
       'least-dark' : '#5A698F',
        'semi-dark': '#161D2F',
      },
      screens: {
        'xs': {'max': '300px'},
        'small':{'min':'300px'}
      },
    },
  },

  plugins: [],
}

