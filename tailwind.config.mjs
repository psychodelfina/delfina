/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0612',
        'bg-card': '#1a1025',
        'neon-pink': '#ff2d95',
        'neon-pink-light': '#ff6eb4',
        'neon-magenta': '#e930ff',
        'neon-purple': '#9945ff',
        'neon-cyan': '#00d9ff',
        'neon-orange': '#ff6a00',
        'neon-yellow': '#ffdd00',
        'neon-green': '#39ff14',
        'text-muted': '#b8b8d0',
      },
      fontFamily: {
        'heading': ['var(--font-heading)', 'cursive'],
        'body': ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'hero-glow': 'heroGlow 10s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        heroGlow: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-5%, 5%) rotate(5deg)' },
        },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #ff2d95 0%, #e930ff 50%, #9945ff 100%)',
        'gradient-warm': 'linear-gradient(135deg, #ff6a00 0%, #ff2d95 50%, #e930ff 100%)',
        'gradient-cool': 'linear-gradient(135deg, #00d9ff 0%, #9945ff 100%)',
        'instagram': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'vk': 'linear-gradient(135deg, #0077ff 0%, #0055cc 100%)',
        'tiktok': 'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)',
        'telegram': 'linear-gradient(135deg, #0088cc 0%, #0066aa 100%)',
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(153, 69, 255, 0.5), 0 0 40px rgba(153, 69, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
