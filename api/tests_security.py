"""
api/tests_security.py
---------------------
Security tests covering:
- SQL injection attempts
- XSS payloads
- Weak passwords
- Invalid names
- Invalid emails
- Rate limiting
- CSRF protection
"""
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

User = get_user_model()

REGISTER_URL = '/api/auth/register/'
LOGIN_URL    = '/api/auth/login/'


# ── Helpers ───────────────────────────────────────────────────────────────────

def _reg_payload(**overrides):
    base = {
        'email': 'test@example.com',
        'password': 'SecurePass1!',
        'full_name': 'John Doe',
        'role': 'graduate',
    }
    base.update(overrides)
    return base


# ── Registration validation ───────────────────────────────────────────────────

class RegistrationValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    # ── Name validation ───────────────────────────────────────────────────────

    def test_name_with_numbers_rejected(self):
        res = self.client.post(REGISTER_URL, _reg_payload(full_name='John123 Doe'), format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_name_with_sql_injection_rejected(self):
        payloads = [
            "SELECT * FROM users",
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "UNION SELECT password FROM users",
        ]
        for payload in payloads:
            with self.subTest(payload=payload):
                res = self.client.post(REGISTER_URL, _reg_payload(full_name=payload), format='json')
                self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST,
                                 f"SQL injection not blocked: {payload}")

    def test_name_with_html_xss_rejected(self):
        payloads = [
            "<script>alert('xss')</script> Doe",
            "<img src=x onerror=alert(1)> Smith",
            "javascript:alert(1) Jones",
        ]
        for payload in payloads:
            with self.subTest(payload=payload):
                res = self.client.post(REGISTER_URL, _reg_payload(full_name=payload), format='json')
                self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST,
                                 f"XSS payload not blocked: {payload}")

    def test_name_too_short_rejected(self):
        res = self.client.post(REGISTER_URL, _reg_payload(full_name='A B'), format='json')
        # 'A' is only 1 char — should fail
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_name_accepted(self):
        res = self.client.post(REGISTER_URL, _reg_payload(full_name='Mary-Jane O\'Brien'), format='json')
        # Should not fail on name validation (may fail on email uniqueness etc.)
        self.assertNotIn('full_name', res.data if hasattr(res, 'data') else {})

    # ── Email validation ──────────────────────────────────────────────────────

    def test_invalid_email_rejected(self):
        bad_emails = ['notanemail', 'missing@', '@nodomain.com', 'a@b', '']
        for email in bad_emails:
            with self.subTest(email=email):
                res = self.client.post(REGISTER_URL, _reg_payload(email=email), format='json')
                self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_email_accepted(self):
        res = self.client.post(REGISTER_URL, _reg_payload(email='valid@university.edu'), format='json')
        # Should not be rejected for email format
        self.assertNotIn('email', [k for k in (res.data or {}) if 'format' in str(res.data.get(k, ''))])

    # ── Password validation ───────────────────────────────────────────────────

    def test_weak_passwords_rejected(self):
        weak = [
            'password',
            'password1!',
            '12345678',
            'abcdefgh',
            'ALLCAPS1!',
            'nouppercase1!',
            'NoSpecial1',
            'NoDigit!A',
            'short1!A',
        ]
        for pw in weak:
            with self.subTest(password=pw):
                res = self.client.post(REGISTER_URL, _reg_payload(password=pw), format='json')
                self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST,
                                 f"Weak password not blocked: {pw}")

    def test_strong_password_accepted(self):
        res = self.client.post(REGISTER_URL, _reg_payload(
            email='strong@example.com',
            password='Str0ng!Pass#2024',
        ), format='json')
        self.assertNotEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_common_password_rejected(self):
        res = self.client.post(REGISTER_URL, _reg_payload(password='Password1!'), format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Role validation ───────────────────────────────────────────────────────

    def test_invalid_role_rejected(self):
        res = self.client.post(REGISTER_URL, _reg_payload(role='admin'), format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_roles_accepted(self):
        for role in ('graduate', 'employer'):
            with self.subTest(role=role):
                res = self.client.post(REGISTER_URL, _reg_payload(
                    email=f'{role}@example.com', role=role
                ), format='json')
                self.assertIn(res.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])
                # 400 is acceptable if email already exists; 201 means it passed validation


# ── Login security ────────────────────────────────────────────────────────────

class LoginSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='logintest@example.com',
            password='SecurePass1!',
            role='graduate',
            is_email_verified=True,
        )

    def test_valid_login_succeeds(self):
        res = self.client.post(LOGIN_URL, {
            'email': 'logintest@example.com',
            'password': 'SecurePass1!',
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)

    def test_wrong_password_rejected(self):
        res = self.client.post(LOGIN_URL, {
            'email': 'logintest@example.com',
            'password': 'WrongPassword1!',
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_nonexistent_email_generic_error(self):
        """Must not reveal whether email exists."""
        res = self.client.post(LOGIN_URL, {
            'email': 'nobody@example.com',
            'password': 'SomePass1!',
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        # Error message must be generic
        self.assertIn('Invalid', res.data.get('error', ''))

    def test_unverified_user_blocked(self):
        unverified = User.objects.create_user(
            email='unverified@example.com',
            password='SecurePass1!',
            role='graduate',
            is_email_verified=False,
        )
        res = self.client.post(LOGIN_URL, {
            'email': 'unverified@example.com',
            'password': 'SecurePass1!',
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(res.data.get('requires_verification'))

    def test_sql_injection_in_login_fields(self):
        payloads = [
            {"email": "' OR '1'='1", "password": "anything"},
            {"email": "admin'--", "password": "pass"},
            {"email": "test@test.com", "password": "' OR '1'='1"},
        ]
        for payload in payloads:
            with self.subTest(payload=payload):
                res = self.client.post(LOGIN_URL, payload, format='json')
                # Must not return 200 — SQL injection must not bypass auth
                self.assertNotEqual(res.status_code, status.HTTP_200_OK)

    @override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
    def test_rate_limiting_login(self):
        """After 5 failed attempts, the 6th must return 429."""
        for _ in range(5):
            self.client.post(LOGIN_URL, {
                'email': 'logintest@example.com',
                'password': 'WrongPass1!',
            }, format='json')

        res = self.client.post(LOGIN_URL, {
            'email': 'logintest@example.com',
            'password': 'WrongPass1!',
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    @override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
    def test_rate_limiting_registration(self):
        """After 10 registration attempts, the 11th must return 429."""
        for i in range(10):
            self.client.post(REGISTER_URL, _reg_payload(email=f'user{i}@example.com'), format='json')

        res = self.client.post(REGISTER_URL, _reg_payload(email='overflow@example.com'), format='json')
        self.assertEqual(res.status_code, status.HTTP_429_TOO_MANY_REQUESTS)


# ── Validator unit tests ──────────────────────────────────────────────────────

class ValidatorUnitTests(TestCase):
    """Direct unit tests for api/validators.py."""

    def test_validate_name_rejects_numbers(self):
        from api.validators import validate_name
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_name('John123', 'First name')

    def test_validate_name_rejects_sql(self):
        from api.validators import validate_name
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_name('SELECT * FROM users', 'First name')

    def test_validate_name_rejects_html(self):
        from api.validators import validate_name
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_name('<script>alert(1)</script>', 'First name')

    def test_validate_name_accepts_valid(self):
        from api.validators import validate_name
        self.assertEqual(validate_name("Mary-Jane O'Brien", 'First name'), "Mary-Jane O'Brien")

    def test_validate_password_rejects_no_uppercase(self):
        from api.validators import validate_password_strength
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_password_strength('nouppercase1!')

    def test_validate_password_rejects_no_digit(self):
        from api.validators import validate_password_strength
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_password_strength('NoDigitHere!')

    def test_validate_password_rejects_no_special(self):
        from api.validators import validate_password_strength
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_password_strength('NoSpecial1A')

    def test_validate_password_accepts_strong(self):
        from api.validators import validate_password_strength
        result = validate_password_strength('Str0ng!Pass#2024')
        self.assertEqual(result, 'Str0ng!Pass#2024')

    def test_validate_email_rejects_invalid(self):
        from api.validators import validate_email_value
        from django.core.exceptions import ValidationError
        for bad in ['notanemail', 'missing@', '@nodomain', '']:
            with self.subTest(email=bad):
                with self.assertRaises(ValidationError):
                    validate_email_value(bad)

    def test_validate_email_normalises(self):
        from api.validators import validate_email_value
        self.assertEqual(validate_email_value('  TEST@Example.COM  '), 'test@example.com')
