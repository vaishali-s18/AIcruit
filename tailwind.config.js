/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'exec-bg': '#020617',
        'exec-card': 'rgba(15, 23, 42, 0.6)',
        'exec-cyan': '#0ea5e9',
        'exec-indigo': '#6366f1',
        'exec-teal': '#0d9488',
        'exec-text': '#f8fafc',
        'exec-muted': '#94a3b8',
        'exec-border': 'rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'neon-glow': 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'neon': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
