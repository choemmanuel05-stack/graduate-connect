from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings as django_settings
from accounts.models import EmailVerificationToken

User = get_user_model()


def send_verification_email(user, frontend_url: str = 'http://localhost:5173'):
    """Create a token and send the verification email."""
    # Invalidate any existing unused tokens
    EmailVerificationToken.objects.filter(user=user, used=False).update(used=True)
    token = EmailVerificationToken.objects.create(user=user)

    verify_url = f"{frontend_url}/verify-email/{token.token}"
    name = user.get_full_name() or user.email

    send_mail(
        subject='Verify your GraduateConnect email address',
        message=f"""Hi {name},

Welcome to GraduateConnect! Please verify your email address to activate your account.

Click the link below to verify your email (valid for 48 hours):
{verify_url}

If you didn't create an account, you can safely ignore this email.

— The GraduateConnect Team
""",
        html_message=f"""
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:2rem;background:#f8fafc;border-radius:12px;">
  <div style="background:#1D4ED8;padding:1.5rem;border-radius:8px;text-align:center;margin-bottom:1.5rem;">
    <h1 style="color:white;margin:0;font-size:1.5rem;">GraduateConnect</h1>
    <p style="color:rgba(255,255,255,0.8);margin:0.5rem 0 0;font-size:0.9rem;">CATUC Bamenda</p>
  </div>
  <h2 style="color:#1e293b;margin:0 0 1rem;">Verify your email address</h2>
  <p style="color:#475569;line-height:1.6;">Hi <strong>{name}</strong>,</p>
  <p style="color:#475569;line-height:1.6;">Welcome to GraduateConnect! Click the button below to verify your email address and activate your account.</p>
  <div style="text-align:center;margin:2rem 0;">
    <a href="{verify_url}" style="background:#1D4ED8;color:white;padding:0.875rem 2rem;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem;display:inline-block;">
      ✓ Verify Email Address
    </a>
  </div>
  <p style="color:#94a3b8;font-size:0.8rem;text-align:center;">This link expires in 48 hours. If you didn't create an account, ignore this email.</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;">
  <p style="color:#94a3b8;font-size:0.75rem;text-align:center;">© {__import__('datetime').datetime.now().year} GraduateConnect · CATUC Bamenda</p>
</div>
""",
        from_email=getattr(django_settings, 'DEFAULT_FROM_EMAIL', 'GraduateConnect <noreply@graduateconnect.com>'),
        recipient_list=[user.email],
        fail_silently=False,
    )
    return token


class VerifyEmailView(APIView):
    """Step 2: User clicks the link in their email."""
    permission_classes = [AllowAny]

    def post(self, request):
        token_str = request.data.get('token', '').strip()
        if not token_str:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = EmailVerificationToken.objects.select_related('user').get(token=token_str)
        except (EmailVerificationToken.DoesNotExist, ValueError):
            return Response({'error': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

        if not token.is_valid():
            return Response({'error': 'This verification link has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        user = token.user
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])

        token.used = True
        token.save(update_fields=['used'])

        return Response({
            'message': 'Email verified successfully! You can now log in.',
            'email': user.email,
        })


class ResendVerificationView(APIView):
    """Resend the verification email — works for both authenticated and unauthenticated users."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        frontend_url = request.data.get('frontend_url', 'http://localhost:5173')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal whether email exists
            return Response({'message': 'If that email is registered and unverified, a new link has been sent.'})

        if user.is_email_verified:
            return Response({'message': 'This email is already verified. You can log in.'})

        try:
            send_verification_email(user, frontend_url)
        except Exception:
            return Response({'error': 'Failed to send email. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Verification email sent! Check your inbox (and spam folder).'})
