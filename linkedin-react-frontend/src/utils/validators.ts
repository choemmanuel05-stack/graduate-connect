/**
 * Form validation utilities used across all pages.
 * These validate FORMAT and PLAUSIBILITY — not live existence.
 */

// ── Email ─────────────────────────────────────────────────────────────────────
// RFC 5322 simplified: local@domain.tld
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email: string): string {
  const v = email.trim();
  if (!v) return 'Email is required';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address (e.g. name@example.com)';
  // Reject obviously fake domains
  const domain = v.split('@')[1]?.toLowerCase();
  if (domain && ['test.com', 'fake.com', 'example.com', 'dummy.com', 'abc.com', 'xyz.com'].includes(domain)) {
    return 'Please use a real email address';
  }
  return '';
}

// ── Password ──────────────────────────────────────────────────────────────────
export function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter';
  if (!/[0-9!@#$%^&*]/.test(password)) return 'Password must contain at least one number or symbol';
  return '';
}

// ── Full name ─────────────────────────────────────────────────────────────────
export function validateFullName(name: string): string {
  const v = name.trim();
  if (!v) return 'Full name is required';
  if (v.length < 3) return 'Name must be at least 3 characters';
  if (v.length < 8) return 'Please enter your full name (at least 8 characters)';
  if (!/^[a-zA-ZÀ-ÿ\s'\-\.]+$/.test(v)) return 'Name should only contain letters, spaces, hyphens, and apostrophes';
  if (/^\d/.test(v)) return 'Name cannot start with a number';
  // Must have at least two words (first + last name)
  const words = v.split(/\s+/).filter(Boolean);
  if (words.length < 2) return 'Please enter both your first and last name';
  return '';
}

// ── URL ───────────────────────────────────────────────────────────────────────
const URL_RE = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export function validateUrl(url: string, fieldName = 'URL'): string {
  if (!url) return ''; // URLs are usually optional
  const v = url.trim();
  // Auto-prefix if missing protocol
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
// Accepts international formats: +237 6XX XXX XXX, (237) 6XX-XXX-XXX, etc.
const PHONE_RE = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/;

export function validatePhone(phone: string): string {
  if (!phone) return ''; // Phone is usually optional
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

// ── Generic required text ─────────────────────────────────────────────────────
export function validateRequired(value: string, fieldName: string): string {
  if (!value.trim()) return `${fieldName} is required`;
  return '';
}

// ── Helper: auto-prefix URL with https:// ─────────────────────────────────────
export function normalizeUrl(url: string): string {
  if (!url) return '';
  const v = url.trim();
  if (!v) return '';
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v}`;
}
