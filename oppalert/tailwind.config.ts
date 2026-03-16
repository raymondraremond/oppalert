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
      }
    },
  },
  plugins: [],
}
export default config
