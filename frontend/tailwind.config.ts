import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ─── Color Tokens ─────────────────────────────────────────── */
      colors: {
        'brand-orange':       '#FF6B35',
        'brand-orange-light': '#FF9966',
        'brand-orange-dark':  '#E85A20',
        'brand-teal':         '#4ECDC4',
        'brand-yellow':       '#FFD93D',
        'brand-purple':       '#A78BFA',
        'brand-green':        '#6BCB77',
        'brand-bg':           '#FFF8F3',
        'brand-navy':         '#1E1B4B',
        'brand-surface':      '#FFFFFF',
        'brand-text-mid':     '#4B5563',
        'brand-text-light':   '#9CA3AF',
        'brand-border':       '#E5E7EB',
      },

      /* ─── Border Radius Tokens ──────────────────────────────────── */
      borderRadius: {
        'brand-xl': '16px',   // --radius
        'brand-lg': '10px',   // --radius-sm
        'brand-md': '8px',    // --radius-xs
      },

      /* ─── Box Shadow Tokens ─────────────────────────────────────── */
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(255,107,53,0.12)',
        'brand-md': '0 8px 32px rgba(255,107,53,0.18)',
        'brand-lg': '0 20px 60px rgba(255,107,53,0.22)',
      },

      /* ─── Font Family Tokens (use CSS variables from next/font) ─── */
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        baloo:  ['var(--font-baloo)',  'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
