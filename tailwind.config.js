/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7B0F1A',
        wineFrom: '#7B0F1A',
        wineTo: '#A8323E',
        secondary: '#F6E3E0',
        background: '#FFF6F2',
        gold: '#D4AF37',

        // Inviteque (landing page) tokens
        iqBg: '#F8F8F8',
        iqCard: '#FFFFFF',
        iqText: '#111111',
        iqAccent: '#E63946',
        iqBorder: 'rgb(0 0 0 / 0.08)',
      },
      fontFamily: {
        heading: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        body: ['"Libre Baskerville"', 'serif'],
        saas: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        cinzel: ['"Cinzel"', 'serif'],
        'cinzel-deco': ['"Cinzel Decorative"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        pinyon: ['"Pinyon Script"', 'cursive'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        'alex-brush': ['"Alex Brush"', 'cursive'],
      },
      borderRadius: {
        panel: '28px',
        card: '24px',
      },
      boxShadow: {
        luxury: '0 10px 30px rgba(0,0,0,0.08)',
      },
      dropShadow: {
        gold: '0 0 16px rgba(212,175,55,0.22)',
      },
      keyframes: {
        floatGlow: {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.75' },
          '50%': { transform: 'translateY(-3px)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.98)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        starBlink: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '20%': { opacity: '1', transform: 'scale(1.3) rotate(15deg)' },
          '40%': { opacity: '0.9', transform: 'scale(1) rotate(0deg)' },
          '60%': { opacity: '1', transform: 'scale(1.2) rotate(-10deg)' },
          '80%': { opacity: '0.3', transform: 'scale(0.8) rotate(5deg)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        'float-glow': 'floatGlow 3.6s ease-in-out infinite',
        twinkle: 'twinkle 2.8s ease-in-out infinite',
        'star-blink': 'starBlink 3s ease-in-out infinite',
        'scroll-bounce': 'scrollBounce 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

