import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette (Inkwell) - backgrounds, sidebars, containers
        ink: {
          deep: '#1B1E26',      // Main Background
          midnight: '#2A2F3B',  // Cards/Section Backgrounds
          dusk: '#3F4656',      // Borders and Hover States
        },
        // Accent Palette (Terracotta) - CTAs, active threads, progress
        terracotta: {
          burnt: '#C25E44',     // Main Action Buttons/Links
          spool: '#E07A5F',     // Highlighting important nodes
          ember: '#8D4231',     // Secondary buttons/Depressed states
        },
        // Neutral Palette (Oatmeal) - typography, icons, hints
        oatmeal: {
          parchment: '#F2E9E4', // Primary Text/Headers
          grain: '#D9D1CC',     // Secondary Text/Metadata
          mist: '#9A8C98',      // Disabled states/Breadcrumbs
        },
      },
    },
  },
  plugins: [],
} satisfies Config
