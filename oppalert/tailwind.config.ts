import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        amber: {
          DEFAULT: 'var(--amber)',
          light: '#F5B93A',
          dim: 'var(--amber-dim)',
        },
        terra: {
          DEFAULT: '#C45C2A',
          dim: '#3A1A0D',
        },
        emerald: {
          DEFAULT: '#3DAA6A',
          dim: '#0F2E1C',
        },
        primary: 'var(--primary)',
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        danger: {
          DEFAULT: 'var(--danger)',
          dim: '#2E1212',
        },
        info: {
          DEFAULT: 'var(--info)',
          dim: '#0D2035',
        }
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.1)',
        'glow-amber': '0 4px 14px rgba(232, 160, 32, 0.1)',
        'glow-amber-strong': '0 6px 20px rgba(232, 160, 32, 0.2)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)',
        'amber-gradient': 'linear-gradient(135deg, var(--amber) 0%, #D88030 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
export default config
