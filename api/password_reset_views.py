from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings as django_settings
from .models import PasswordResetToken

User = get_user_model()


class PasswordResetRequestView(APIView):
    """Step 1: User submits their email to request a reset link."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Always return success to prevent email enumeration
        try:
            user = User.objects.get(email=email)
            # Invalidate any existing tokens
            PasswordResetToken.objects.filter(user=user, used=False).update(used=True)
            # Create new token
            token = PasswordResetToken.objects.create(user=user)

            reset_url = f"{request.data.get('frontend_url', 'http://localhost:5173')}/reset-password/{token.token}"

            send_mail(
                subject='Reset your GraduateConnect password',
                message=f"""Hi {user.get_full_name() or user.email},

You requested a password reset for your GraduateConnect account.

Click the link below to reset your password (valid for 2 hours):
{reset_url}

If you didn't request this, you can safely ignore this email.

— The GraduateConnect Team
""",
                from_email=getattr(django_settings, 'DEFAULT_FROM_EMAIL', 'noreply@graduateconnect.com'),
                recipient_list=[email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass  # Don't reveal whether email exists

        return Response({'message': 'If an account with that email exists, a reset link has been sent.'})


class PasswordResetConfirmView(APIView):
    """Step 2: User submits new password with the token from the email."""
    permission_classes = [AllowAny]

    def post(self, request):
        token_str = request.data.get('token', '').strip()
        new_password = request.data.get('password', '').strip()

        if not token_str or not new_password:
            return Response({'error': 'Token and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = PasswordResetToken.objects.get(token=token_str)
        except (PasswordResetToken.DoesNotExist, ValueError):
            return Response({'error': 'Invalid or expired reset link'}, status=status.HTTP_400_BAD_REQUEST)

        if not token.is_valid():
            return Response({'error': 'This reset link has expired or already been used'}, status=status.HTTP_400_BAD_REQUEST)

        user = token.user
        user.set_password(new_password)
        user.save()

        token.used = True
        token.save()

        return Response({'message': 'Password reset successfully. You can now log in.'})


class PasswordChangeView(APIView):
    """Authenticated user changes their own password."""

    def post(self, request):
        current = request.data.get('current_password', '')
        new_pw = request.data.get('new_password', '')

        if not request.user.check_password(current):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_pw) < 8:
            return Response({'error': 'New password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_pw)
        request.user.save()
        return Response({'message': 'Password changed successfully'})
