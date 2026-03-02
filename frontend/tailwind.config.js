/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          secondary: '#3D3D3D',
          muted: '#7A7A7A',
        },
        surface: {
          DEFAULT: '#F7F7F5',
          raised: '#FAFAF9',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8CB7A',
          dark: '#9A7A30',
          subtle: '#FBF4E3',
        },
        border: {
          DEFAULT: '#E5E5E3',
          strong: '#C8C8C5',
        },
        // Exam ink mode
        exam: {
          bg:      '#0A0A0A',
          surface: '#141414',
          border:  '#2A2A2A',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono:  ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        xs:   '0 1px 2px rgba(10,10,10,0.05)',
        sm:   '0 2px 4px rgba(10,10,10,0.06), 0 1px 2px rgba(10,10,10,0.04)',
        md:   '0 4px 12px rgba(10,10,10,0.08), 0 2px 4px rgba(10,10,10,0.04)',
        lg:   '0 8px 24px rgba(10,10,10,0.10), 0 2px 8px rgba(10,10,10,0.06)',
        xl:   '0 16px 48px rgba(10,10,10,0.12), 0 4px 16px rgba(10,10,10,0.06)',
        gold: '0 4px 20px rgba(201,168,76,0.25)',
      },
      borderRadius: {
        sm:  '4px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s cubic-bezier(0,0,0.2,1) forwards',
        'fade-in':    'fadeIn 0.4s cubic-bezier(0,0,0.2,1) forwards',
        'shimmer':    'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulseRing 1s ease-in-out infinite',
        'shake':      'shake 0.3s ease-in-out',
        'count-up':   'fadeIn 1.2s cubic-bezier(0,0,0.2,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.5' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%':     { transform: 'translateX(-4px)' },
          '75%':     { transform: 'translateX(4px)' },
        },
      },
      letterSpacing: {
        widest: '0.12em',
      },
    },
  },
  plugins: [],
}
