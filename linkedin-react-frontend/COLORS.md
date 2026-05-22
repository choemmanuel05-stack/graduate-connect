# GradLink Color Palette

This document defines the official color tokens for the GradLink platform. All components should use these tokens — avoid hardcoded hex values outside this system.

---

## Primary Brand Colors

| Token | Hex | CSS Variable | Tailwind Class | Use |
|-------|-----|-------------|----------------|-----|
| Primary | `#1D4ED8` | `--color-primary` | `bg-primary` | Primary buttons, links, active nav |
| Primary Light | `#EFF6FF` | `--color-primary-light` | `bg-primary-light` | Hover backgrounds, selected states |
| Primary Hover | `#1E40AF` | `--color-primary-hover` | `bg-primary-hover` | Button hover state |

**WCAG contrast:** `#1D4ED8` on white = **5.9:1** ✅ (AA pass for normal text)

---

## Semantic Colors

| Token | Hex | CSS Variable | Use |
|-------|-----|-------------|-----|
| Success | `#059669` | `--color-success` | Verified badges, success messages, confirmed states |
| Warning | `#D97706` | `--color-warning` | Pending states, caution messages |
| Danger | `#DC2626` | `--color-danger` | Errors, destructive actions, validation failures |

---

## Light Theme (Authenticated App)

| Token | Hex | CSS Variable | Use |
|-------|-----|-------------|-----|
| Background | `#F8FAFC` | `--color-bg` | Page background |
| Surface | `#FFFFFF` | `--color-surface` | Card and panel backgrounds |
| Text Primary | `#0F172A` | `--color-text-primary` | Headings, body text |
| Text Secondary | `#475569` | `--color-text-secondary` | Labels, secondary text |
| Text Muted | `#94A3B8` | `--color-text-muted` | Placeholders, hints, disabled |
| Border | `#E2E8F0` | `--color-border` | Card borders, dividers |
| Border Focus | `#1D4ED8` | `--color-border-focus` | Input focus rings |

**WCAG contrast:**
- `#0F172A` on `#F8FAFC` = **19.5:1** ✅ (AAA)
- `#475569` on `#F8FAFC` = **7.0:1** ✅ (AA)
- `#94A3B8` on `#F8FAFC` = **3.3:1** ⚠️ (use only for non-essential decorative text)

---

## Dark Theme (Login / Landing Pages)

| Token | Hex | CSS Variable | Use |
|-------|-----|-------------|-----|
| Dark Background | `#0F172A` | `--color-dark-bg` | Page background |
| Dark Surface | `#1E293B` | `--color-dark-surface` | Card backgrounds |
| Dark Text | `#F1F5F9` | `--color-dark-text` | All text on dark backgrounds |

**WCAG contrast:**
- `#F1F5F9` on `#0F172A` = **17.8:1** ✅ (AAA)
- `#F1F5F9` on `#1E293B` = **12.6:1** ✅ (AAA)

---

## Usage Guidelines

### Buttons
```tsx
// Primary button
style={{ background: 'var(--color-primary)', color: '#fff' }}

// Hover state
style={{ background: 'var(--color-primary-hover)' }}

// Danger button
style={{ background: 'var(--color-danger)', color: '#fff' }}
```

### Status badges
```tsx
// Success / Verified
style={{ background: 'rgba(5,150,105,0.12)', color: '#059669', border: '1px solid rgba(5,150,105,0.25)' }}

// Warning / Pending
style={{ background: 'rgba(217,119,6,0.12)', color: '#D97706', border: '1px solid rgba(217,119,6,0.25)' }}

// Danger / Rejected
style={{ background: 'rgba(220,38,38,0.12)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.25)' }}
```

### Tailwind classes
```tsx
// Primary button
className="bg-primary hover:bg-primary-hover text-white"

// Success text
className="text-success"

// Light background
className="bg-bg-surface border border-border"
```

---

## What Changed from v1

| Before | After | Reason |
|--------|-------|--------|
| `#0A66C2` (LinkedIn Blue) | `#1D4ED8` (Royal Blue) | More distinctive, better contrast |
| `#F1F5F9` (bg) | `#F8FAFC` (bg) | Slightly warmer, less clinical |
| `#1C1C1C` (text) | `#0F172A` (text) | Richer dark, better readability |
| `#EF4444` (danger) | `#DC2626` (danger) | Slightly deeper, better contrast |
| `#10B981` (success) | `#059669` (success) | Deeper emerald, more professional |
