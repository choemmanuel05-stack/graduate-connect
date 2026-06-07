/**
 * validators.ts
 * -------------
 * Strict client-side validation matching the backend rules in api/validators.py.
 * NOTE: These are a first line of defence only — the backend always re-validates.
 */

// ── Patterns ──────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const NAME_RE  = /^[a-zA-ZÀ-ÿ\s\-']+$/;

const SQL_KEYWORDS = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|CREATE|TRUNCATE|EXEC|EXECUTE|CAST|CONVERT|DECLARE|FETCH|OPEN|CURSOR)\b/i;
const HTML_PATTERN = /[<>]|javascript\s*:|on\w+\s*=/i;

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password1!', '12345678', '123456789',
  'welcome123!', 'admin123!', 'qwerty123!', 'letmein1!', 'iloveyou1!',
]);

// ── Email ─────────────────────────────────────────────────────────────────────
export function validateEmail(email: string): string {
  const v = email.trim();
  if (!v) return 'Email address is required';
  if (v.length > 254) return 'Email address is too long';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address (e.g. name@gmail.com)';
  // Gmail-only during pilot phase (spec §3.6.1)
  if (!v.toLowerCase().endsWith('@gmail.com')) {
    return 'Only Gmail addresses (@gmail.com) are accepted during the pilot phase';
  }
  return '';
}

// ── Name (first name or surname) ──────────────────────────────────────────────
export function validateName(value: string, label = 'Name'): string {
  const v = value.trim();
  if (!v) return `${label} is required`;
  if (v.length < 2) return `${label} must be at least 2 characters`;
  if (v.length > 75) return `${label} must not exceed 75 characters`;
  if (SQL_KEYWORDS.test(v)) return `${label} contains invalid content`;
  if (HTML_PATTERN.test(v)) return `${label} contains invalid characters`;
  if (!NAME_RE.test(v))
    return `${label} may only contain letters, spaces, hyphens, and apostrophes`;
  return '';
}

// ── Password ──────────────────────────────────────────────────────────────────
export function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password is too long (max 128 characters)';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one digit';
  if (COMMON_PASSWORDS.has(password.toLowerCase()))
    return 'This password is too common. Please choose a stronger one';
  return '';
}

/**
 * Returns a password strength score 0–4 and a label.
 * Used to drive the live strength indicator on the Register page.
 */
export function passwordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/\\`~]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak',      color: '#EF4444' };
  if (score === 2) return { score: 2, label: 'Fair',      color: '#F97316' };
  if (score === 3) return { score: 3, label: 'Good',      color: '#EAB308' };
  if (score === 4) return { score: 4, label: 'Strong',    color: '#22C55E' };
  return              { score: 5, label: 'Very Strong', color: '#10B981' };
}

// ── Full name (legacy — kept for backward compat) ─────────────────────────────
export function validateFullName(name: string): string {
  const v = name.trim();
  if (!v) return 'Full name is required';
  const parts = v.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return 'Please enter both your first name and surname';
  const firstErr = validateName(parts[0], 'First name');
  if (firstErr) return firstErr;
  const lastErr = validateName(parts.slice(1).join(' '), 'Surname');
  if (lastErr) return lastErr;
  return '';
}

// ── URL ───────────────────────────────────────────────────────────────────────
const URL_RE = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export function validateUrl(url: string, fieldName = 'URL'): string {
  if (!url) return '';
  const v = url.trim();
  const withProtocol = v.startsWith('http') ? v : `https://${v}`;
  if (!URL_RE.test(withProtocol)) return `Enter a valid ${fieldName} (e.g. https://example.com)`;
  return '';
}

export function validateLinkedIn(url: string): string {
  if (!url) return '';
  const v = url.trim().toLowerCase();
  const withProtocol = v.startsWith('http') ? v : `https://${v}`;
  if (!withProtocol.includes('linkedin.com')) return 'LinkedIn URL must contain linkedin.com';
  if (!URL_RE.test(withProtocol)) return 'Enter a valid LinkedIn URL';
  return '';
}

export function validateGitHub(url: string): string {
  if (!url) return '';
  const v = url.trim().toLowerCase();
  const withProtocol = v.startsWith('http') ? v : `https://${v}`;
  if (!withProtocol.includes('github.com')) return 'GitHub URL must contain github.com';
  if (!URL_RE.test(withProtocol)) return 'Enter a valid GitHub URL';
  return '';
}

// ── Phone ─────────────────────────────────────────────────────────────────────
const PHONE_RE = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/;

export function validatePhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return 'Phone number is too short';
  if (digits.length > 15) return 'Phone number is too long';
  if (!PHONE_RE.test(phone.trim())) return 'Enter a valid phone number (e.g. +237 677 123 456)';
  return '';
}

// ── GPA ───────────────────────────────────────────────────────────────────────
export function validateGPA(gpa: string): string {
  if (!gpa) return '';
  const n = parseFloat(gpa);
  if (isNaN(n)) return 'GPA must be a number';
  if (n < 0 || n > 4.0) return 'GPA must be between 0.0 and 4.0';
  return '';
}

// ── Graduation year ───────────────────────────────────────────────────────────
export function validateGraduationYear(year: string): string {
  if (!year) return '';
  const n = parseInt(year);
  const currentYear = new Date().getFullYear();
  if (isNaN(n)) return 'Enter a valid year';
  if (n < 1950) return 'Year seems too far in the past';
  if (n > currentYear + 6) return `Year cannot be more than 6 years in the future`;
  return '';
}

// ── Post content ──────────────────────────────────────────────────────────────
export function validatePostContent(content: string): { valid: boolean; message?: string } {
  if (!content.trim()) return { valid: false, message: 'Post cannot be empty' };
  if (content.trim().length < 3) return { valid: false, message: 'Post is too short' };
  if (content.length > 2000) return { valid: false, message: 'Post is too long (max 2000 characters)' };
  return { valid: true };
}

// ── Job title ─────────────────────────────────────────────────────────────────
export function validateJobTitle(title: string): string {
  if (!title.trim()) return 'Job title is required';
  if (title.trim().length < 3) return 'Job title is too short';
  if (title.trim().length > 100) return 'Job title is too long (max 100 characters)';
  return '';
}

// ── Generic required ──────────────────────────────────────────────────────────
export function validateRequired(value: string, fieldName: string): string {
  if (!value.trim()) return `${fieldName} is required`;
  return '';
}

// ── URL normaliser ────────────────────────────────────────────────────────────
export function normalizeUrl(url: string): string {
  if (!url) return '';
  const v = url.trim();
  if (!v) return '';
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v}`;
}
