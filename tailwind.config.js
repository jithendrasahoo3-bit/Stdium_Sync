/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#FFF5E4',
        'cyber-navy': '#FFE3E1',
        'cyber-blue': '#FFD1D1',
        'cyber-teal': '#E06B6B',
        'cyber-teal-dim': '#AB74C7',
        'cyber-cyan': '#6AB482',
        'cyber-green': '#6AB482',
        'cyber-amber': '#E09255',
        'cyber-red': '#E05A47',
        'cyber-purple': '#AB74C7',
        'glass-bg': 'rgba(255, 245, 228, 0.72)',
        'glass-border': 'rgba(74, 53, 53, 0.15)',
        'theme-text-dark': '#000000',
        'theme-text-muted': '#4A3535',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #FFF5E4 0%, #FFE3E1 100%)',
        'teal-gradient': 'linear-gradient(135deg, #FF9494 0%, #E06B6B 100%)',
        'red-gradient': 'linear-gradient(135deg, #E05A47 0%, #B83A2A 100%)',
        'green-gradient': 'linear-gradient(135deg, #6AB482 0%, #4D8F63 100%)',
        'amber-gradient': 'linear-gradient(135deg, #E09255 0%, #B87236 100%)',
        'purple-gradient': 'linear-gradient(135deg, #AB74C7 0%, #854E9E 100%)',
        'rainbow': 'linear-gradient(90deg,#FF9494,#FFD1D1,#AB74C7,#6AB482,#E09255,#E05A47,#FF9494)',
        'grid-pattern': 'linear-gradient(rgba(255,148,148,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,148,148,0.05) 1px,transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
        '200pct': '200% auto',
      },
      boxShadow: {
        'cyber': '0 10px 40px -10px rgba(74,53,53,0.08), 0 1px 3px rgba(74,53,53,0.04)',
        'cyber-strong': '0 20px 50px -12px rgba(74,53,53,0.12), 0 1px 8px rgba(74,53,53,0.06)',
        'red-glow': '0 0 25px rgba(224,90,71,0.08)',
        'green-glow': '0 0 25px rgba(106,180,130,0.08)',
        'amber-glow': '0 0 25px rgba(224,146,85,0.08)',
        'glass': '0 8px 32px rgba(74,53,53,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
        'pop': '0 10px 30px rgba(74,53,53,0.05)',
        'pop-sm': '0 4px 15px rgba(74,53,53,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'rainbow-flow': 'rainbow-flow 4s linear infinite',
        'bounce-crazy': 'bounce-crazy 3s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glitch': 'glitch 4s linear infinite',
        'confetti': 'confetti 6s ease-out infinite',
        'neon-pulse': 'neon-pulse 3s ease-in-out infinite',
        'letter-bounce': 'letter-bounce 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(0.2deg)' },
        },
        'rainbow-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'bounce-crazy': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glitch: {
          '0%,100%': { opacity: '0.98' },
          '50%': { opacity: '1' },
        },
        confetti: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        'neon-pulse': {
          '0%,100%': { opacity: '0.9' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'letter-bounce': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}