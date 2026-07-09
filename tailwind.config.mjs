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
        'text-muted': '#b8b8d0',
      },
      fontFamily: {
        'heading': ['var(--font-heading)', 'cursive'],
        'body': ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #ff2d95 0%, #e930ff 50%, #9945ff 100%)',
        'gradient-warm': 'linear-gradient(135deg, #ff6a00 0%, #ff2d95 50%, #e930ff 100%)',
        'instagram': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'vk': 'linear-gradient(135deg, #0077ff 0%, #0055cc 100%)',
        'tiktok': 'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)',
        'telegram': 'linear-gradient(135deg, #0088cc 0%, #0066aa 100%)',
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3)',
      },
    },
  },
  plugins: [],
};
