import time
import logging
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer, GraduateProfileSerializer, EmployerProfileSerializer

logger = logging.getLogger(__name__)

# ── Rate limiting helpers ─────────────────────────────────────────────────────

def _get_client_ip(request) -> str:
    """Extract real client IP, respecting X-Forwarded-For."""
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '127.0.0.1')


def _is_rate_limited(key: str, max_attempts: int, window_seconds: int) -> bool:
    """
    Cache-backed rate limiter.
    Returns True if the caller has exceeded max_attempts within window_seconds.
    Uses Django's cache framework (works with memcached, redis, or local-memory).
    """
    cache_key = f'rl:{key}'
    attempts = cache.get(cache_key, [])
    now = time.time()
    # Purge expired entries
    attempts = [t for t in attempts if now - t < window_seconds]
    if len(attempts) >= max_attempts:
        return True
    attempts.append(now)
    cache.set(cache_key, attempts, timeout=window_seconds)
    return False


# ── Views ─────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    """
    POST /api/auth/register/
    Rate limit: 10 requests per IP per hour.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        ip = _get_client_ip(request)
        if _is_rate_limited(f'register:{ip}', max_attempts=10, window_seconds=3600):
            return Response(
                {'error': 'Too many registration attempts. Please try again later.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            frontend_url = request.data.get('frontend_url', 'http://localhost:5173')
            try:
                from .email_verification_views import send_verification_email
                send_verification_email(user, frontend_url)
            except Exception as exc:
                logger.warning('Failed to send verification email to %s: %s', user.email, exc)

            return Response({
                'message': 'Account created! Please check your email to verify your address before logging in.',
                'email': user.email,
                'requires_verification': True,
            }, status=status.HTTP_201_CREATED)

        # Translate the unverified_account sentinel into a structured response
        errors = serializer.errors
        if 'email' in errors:
            email_errors = errors['email']
            msgs = [str(e) for e in email_errors]
            if any('unverified_account' in m for m in msgs):
                email_value = (request.data.get('email') or '').strip().lower()
                return Response({
                    'email': ['This account has already been registered but has not been verified. Please check your email for the verification link or request a new one.'],
                    'email_unverified': True,
                    'email_value': email_value,
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Rate limit: 5 failed attempts per IP per 15 minutes.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        ip = _get_client_ip(request)
        if _is_rate_limited(f'login:{ip}', max_attempts=5, window_seconds=300):
            return Response(
                {'error': 'Too many login attempts. Please try again in 5 minutes.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)
        if not user:
            # Generic message — do not reveal whether email exists
            return Response(
                {'error': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Block unverified users (except superusers)
        if not user.is_email_verified and not user.is_superuser:
            return Response({
                'error': 'Please verify your email address before logging in.',
                'requires_verification': True,
                'email': user.email,
            }, status=status.HTTP_403_FORBIDDEN)

        # Clear rate-limit counter on successful login
        cache.delete(f'login:{ip}')

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklists the refresh token so it cannot be reused.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as exc:
                logger.warning('Logout blacklist error: %s', exc)
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class MeView(APIView):
    """GET /api/auth/me/ — returns current user + profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data

        if user.role == 'graduate' and hasattr(user, 'api_graduate_profile'):
            data['profile'] = GraduateProfileSerializer(
                user.api_graduate_profile, context={'request': request}
            ).data
        elif user.role == 'employer' and hasattr(user, 'api_employer_profile'):
            data['profile'] = EmployerProfileSerializer(
                user.api_employer_profile, context={'request': request}
            ).data

        return Response(data)
