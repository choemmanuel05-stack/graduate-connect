/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        // ── GradLink Brand Palette ──────────────────────────────
        primary: {
          DEFAULT: '#1D4ED8',   // Royal Blue — buttons, links, active states
          light:   '#EFF6FF',   // Hover backgrounds, selected states
          hover:   '#1E40AF',   // Darker hover state
          50:      '#EFF6FF',
          100:     '#DBEAFE',
          500:     '#3B82F6',
          600:     '#2563EB',
          700:     '#1D4ED8',
          800:     '#1E40AF',
          900:     '#1E3A8A',
        },
        success:  '#059669',    // Emerald — verified badges, success states
        warning:  '#D97706',    // Amber — pending, warnings
        danger:   '#DC2626',    // Red — errors, destructive actions
        // ── Light theme surfaces ────────────────────────────────
        bg: {
          DEFAULT:      '#F8FAFC',   // Near-white page background
          surface:      '#FFFFFF',   // Card backgrounds
          dark:         '#0F172A',   // Dark page background (login/landing)
          'dark-surface': '#1E293B', // Dark card backgrounds
        },
        // ── Text ────────────────────────────────────────────────
        text: {
          primary:   '#0F172A',  // Slate 950 — headings, body
          secondary: '#475569',  // Slate 600 — labels, secondary
          muted:     '#94A3B8',  // Slate 400 — placeholders, hints
          inverse:   '#F1F5F9',  // Light text on dark backgrounds
        },
        // ── Borders ─────────────────────────────────────────────
        border: {
          DEFAULT: '#E2E8F0',   // Slate 200 — card borders, dividers
          focus:   '#1D4ED8',   // Focus ring color
        },
        // ── Legacy aliases (keep for backward compat) ───────────
        'gc-blue':    '#1D4ED8',
        'gc-teal':    '#0D9488',
        'gc-bg':      '#F8FAFC',
        'modern-blue': '#1D4ED8',
      },
      borderRadius: {
        'xl':  '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'blue':    '0 4px 14px rgba(29,78,216,0.25)',
        'blue-lg': '0 8px 30px rgba(29,78,216,0.35)',
        'card':    '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'card-lg': '0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -2px rgba(15,23,42,0.04)',
        'modal':   '0 25px 50px -12px rgba(15,23,42,0.18)',
      },
    },
  },
  plugins: [],
}
