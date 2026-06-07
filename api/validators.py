"""
api/validators.py
-----------------
Centralised security validators used by both serializers and forms.
All rules are enforced server-side — never trust the frontend alone.
"""
import re
from django.core.exceptions import ValidationError

# ── Blocked SQL keywords ──────────────────────────────────────────────────────
_SQL_KEYWORDS = re.compile(
    r'\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|CREATE|TRUNCATE|EXEC|EXECUTE|CAST|CONVERT|DECLARE|FETCH|OPEN|CURSOR)\b',
    re.IGNORECASE,
)

# ── Blocked HTML/script patterns ──────────────────────────────────────────────
_HTML_PATTERN = re.compile(r'[<>]|javascript\s*:|on\w+\s*=', re.IGNORECASE)

# ── Name: letters, spaces, hyphens, apostrophes only ─────────────────────────
_NAME_RE = re.compile(r"^[a-zA-ZÀ-ÿ\s\-']+$")

# ── Common weak passwords to reject ──────────────────────────────────────────
COMMON_PASSWORDS = {
    'password', 'password1', 'password1!', '12345678', '123456789',
    'welcome123!', 'admin123!', 'qwerty123!', 'letmein1!', 'iloveyou1!',
    'monkey123!', 'dragon123!', 'master123!', 'sunshine1!',
}


def validate_name(value: str, field_label: str = 'Name') -> str:
    """
    Validates a first name or surname.
    Returns cleaned value or raises ValidationError.
    """
    value = value.strip()

    if not value:
        raise ValidationError(f'{field_label} is required.')

    if len(value) < 2:
        raise ValidationError(f'{field_label} must be at least 2 characters.')

    if len(value) > 75:
        raise ValidationError(f'{field_label} must not exceed 75 characters.')

    if _SQL_KEYWORDS.search(value):
        raise ValidationError(f'{field_label} contains invalid content.')

    if _HTML_PATTERN.search(value):
        raise ValidationError(f'{field_label} contains invalid characters.')

    if not _NAME_RE.match(value):
        raise ValidationError(
            f'{field_label} may only contain letters, spaces, hyphens, and apostrophes.'
        )

    return value


def validate_password_strength(password: str) -> str:
    """
    Enforces password policy: min 8 chars, at least one digit.
    Returns cleaned value or raises ValidationError.
    """
    if not password:
        raise ValidationError('Password is required.')

    if len(password) < 8:
        raise ValidationError('Password must be at least 8 characters.')

    if len(password) > 128:
        raise ValidationError('Password must not exceed 128 characters.')

    if not re.search(r'[0-9]', password):
        raise ValidationError('Password must contain at least one digit.')

    if password.lower() in COMMON_PASSWORDS:
        raise ValidationError('This password is too common. Please choose a stronger password.')

    return password


def validate_email_value(value: str) -> str:
    """
    Validates email format and length.
    Returns normalised (lowercase, stripped) value or raises ValidationError.
    """
    value = value.strip().lower()

    if not value:
        raise ValidationError('Email address is required.')

    if len(value) > 254:
        raise ValidationError('Email address is too long.')

    # Basic RFC 5322 pattern
    email_re = re.compile(
        r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    )
    if not email_re.match(value):
        raise ValidationError('Enter a valid email address.')

    return value
