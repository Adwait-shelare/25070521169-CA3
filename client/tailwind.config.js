/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pleasing, soft Midnight Slate & Indigo (gentle on eyes, high-end aesthetic)
        navy: {
          950: '#0F172A',
          900: '#1E293B',
          850: '#273549',
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#94A3B8',
        },
        // Pleasing, warm Coastal Ocean Teal & Jade Emerald (calming, welcoming, premium)
        turquoise: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0D9488',
          600: '#0F766E',
          700: '#115E59',
          800: '#134E48',
        },
        // Warm Champagne Honey Gold
        gold: {
          300: '#FDE68A',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Warm Sand & Pearl Creams
        sand: {
          50: '#FAF8F5',
          100: '#F4F0E8',
          200: '#EAE4D7',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 50px -15px rgba(11, 19, 43, 0.1), 0 0 1px 1px rgba(11, 19, 43, 0.05)',
        'luxury-hover': '0 25px 60px -12px rgba(6, 182, 212, 0.22), 0 0 2px 1px rgba(6, 182, 212, 0.25)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 30px rgba(6, 182, 212, 0.35)',
        'glow-gold': '0 0 30px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
