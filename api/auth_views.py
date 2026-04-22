from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from .serializers import RegisterSerializer, UserSerializer, GraduateProfileSerializer, EmployerProfileSerializer

# Simple rate limiting tracker (use django-ratelimit in production)
import time
_login_attempts: dict = {}

def _check_rate_limit(ip: str, max_attempts: int = 5, window: int = 300) -> bool:
    """Returns True if rate limit exceeded."""
    now = time.time()
    attempts = _login_attempts.get(ip, [])
    attempts = [t for t in attempts if now - t < window]
    if len(attempts) >= max_attempts:
        return True
    attempts.append(now)
    _login_attempts[ip] = attempts
    return False


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Send verification email
            frontend_url = request.data.get('frontend_url', 'http://localhost:5173')
            try:
                from .email_verification_views import send_verification_email
                send_verification_email(user, frontend_url)
            except Exception as e:
                # Log but don't fail registration if email fails
                import logging
                logging.getLogger(__name__).warning(f"Failed to send verification email to {user.email}: {e}")

            return Response({
                'message': 'Account created! Please check your email to verify your address before logging in.',
                'email': user.email,
                'requires_verification': True,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ip = request.META.get('REMOTE_ADDR', '')
        if _check_rate_limit(ip):
            return Response({'error': 'Too many login attempts. Try again in 5 minutes.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Block unverified users (except admins/superusers)
        if not user.is_email_verified and not user.is_superuser:
            return Response({
                'error': 'Please verify your email address before logging in.',
                'requires_verification': True,
                'email': user.email,
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class MeView(APIView):
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
