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
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
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
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
        'glow-amber': '0 0 20px rgba(232, 160, 32, 0.2)',
        'glow-amber-strong': '0 0 40px rgba(232, 160, 32, 0.4)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(34, 40, 32, 0.4) 0%, rgba(20, 23, 16, 0.6) 100%)',
        'amber-gradient': 'linear-gradient(135deg, #F0B030 0%, #D88030 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
export default config
