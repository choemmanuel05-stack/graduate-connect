from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.shortcuts import get_object_or_404

from graduates.models import Credential, GraduateProfile


# ── Helpers ───────────────────────────────────────────────────────────────────

def _is_admin(user):
    return user.is_authenticated and (user.role == 'administrator' or user.is_staff)


def _credential_data(credential, request=None):
    """Return a plain dict representation of a Credential."""
    file_url = None
    if credential.file:
        file_url = (
            request.build_absolute_uri(credential.file.url)
            if request else credential.file.url
        )
    return {
        'id': credential.pk,
        'graduate_id': credential.profile.pk,
        'graduate_name': credential.profile.user.email,
        'file_url': file_url,
        'file_type': credential.file_type,
        'status': credential.status,
        'uploaded_at': credential.uploaded_at,
        'verified_at': credential.verified_at,
        'verified_by': credential.verified_by.email if credential.verified_by else None,
        'rejection_reason': credential.rejection_reason,
    }


# ── Graduate: upload & list own credentials ───────────────────────────────────

class CredentialUploadView(APIView):
    """
    GET  /api/credentials/          — graduate lists their own credentials
    POST /api/credentials/          — graduate uploads a new credential
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            profile = request.user.graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Graduate profile not found'}, status=status.HTTP_404_NOT_FOUND)

        credentials = profile.credentials.all().order_by('-uploaded_at')
        return Response({
            'results': [_credential_data(c, request) for c in credentials],
            'count': credentials.count(),
        })

    def post(self, request):
        try:
            profile = request.user.graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Graduate profile not found'}, status=status.HTTP_404_NOT_FOUND)

        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file type
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
        if file.content_type not in allowed_types:
            return Response(
                {'error': 'Invalid file type. Only PDF, JPEG, and PNG are accepted.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate file size (5 MB max)
        if file.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'File too large. Maximum size is 5 MB.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        credential = Credential.objects.create(
            profile=profile,
            file=file,
            file_type=file.content_type,
            status='pending',
        )
        return Response(_credential_data(credential, request), status=status.HTTP_201_CREATED)


# ── Admin: list pending queue ─────────────────────────────────────────────────

class AdminCredentialQueueView(APIView):
    """
    GET /api/admin/credentials/          — list all credentials (admin only)
    Query params:
      ?status=pending|verified|rejected  — filter by status (default: pending)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        filter_status = request.query_params.get('status', 'pending')
        qs = Credential.objects.select_related('profile__user', 'verified_by')

        if filter_status in ('pending', 'verified', 'rejected'):
            qs = qs.filter(status=filter_status)

        qs = qs.order_by('uploaded_at')
        return Response({
            'results': [_credential_data(c, request) for c in qs],
            'count': qs.count(),
        })


# ── Admin: verify a credential ────────────────────────────────────────────────

class AdminCredentialVerifyView(APIView):
    """
    POST /api/admin/credentials/<pk>/verify/   — mark credential as verified
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if not _is_admin(request.user):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        credential = get_object_or_404(Credential, pk=pk)

        if credential.status == 'verified':
            return Response({'error': 'Credential is already verified'}, status=status.HTTP_400_BAD_REQUEST)

        credential.status = 'verified'
        credential.verified_by = request.user
        credential.verified_at = timezone.now()
        credential.rejection_reason = ''
        credential.save()

        return Response(_credential_data(credential, request))


# ── Admin: reject a credential ────────────────────────────────────────────────

class AdminCredentialRejectView(APIView):
    """
    POST /api/admin/credentials/<pk>/reject/   — mark credential as rejected
    Body: { "reason": "..." }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if not _is_admin(request.user):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        credential = get_object_or_404(Credential, pk=pk)

        reason = request.data.get('reason', '').strip()
        if not reason:
            return Response({'error': 'A rejection reason is required'}, status=status.HTTP_400_BAD_REQUEST)

        credential.status = 'rejected'
        credential.rejection_reason = reason
        credential.verified_by = request.user
        credential.verified_at = timezone.now()
        credential.save()

        return Response(_credential_data(credential, request))
