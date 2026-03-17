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
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#0D0F0B',
        bg2: '#141710',
        bg3: '#1C2018',
        surface: '#222820',
        surface2: '#2A3028',
        border: '#2E3530',
        border2: '#3A4238',
        amber: {
          DEFAULT: '#E8A020',
          light: '#F5B93A',
          dim: '#3D2E0A',
        },
        terra: {
          DEFAULT: '#C45C2A',
          dim: '#3A1A0D',
        },
        emerald: {
          DEFAULT: '#3DAA6A',
          dim: '#0F2E1C',
        },
        primary: '#F0EDE6',
        muted: '#A8A89A',
        subtle: '#6A6B62',
        danger: {
          DEFAULT: '#E05252',
          dim: '#2E1212',
        },
        info: {
          DEFAULT: '#4A9EE8',
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
