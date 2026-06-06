from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import GraduateProfile, JobApplication
from .serializers import GraduateProfileSerializer, PublicGraduateProfileSerializer


class GraduateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            profile = request.user.api_graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GraduateProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        # Ownership check
        requested_user_id = request.data.get('user_id') or request.data.get('user')
        if requested_user_id is not None:
            try:
                requested_user_id = int(requested_user_id)
            except (ValueError, TypeError):
                return Response({'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)
            if requested_user_id != request.user.pk and not request.user.is_staff:
                return Response({'error': 'You do not have permission to edit this profile'}, status=status.HTTP_403_FORBIDDEN)

        try:
            profile = request.user.api_graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # ── File validation (spec §4.6) ───────────────────────────────────────
        MAX_SIZE = 5 * 1024 * 1024  # 5 MB

        photo = request.FILES.get('profile_photo')
        if photo:
            allowed_image_types = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
            if photo.content_type not in allowed_image_types:
                return Response(
                    {'error': 'Profile photo must be JPEG, PNG, WebP, or GIF.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if photo.size > MAX_SIZE:
                return Response(
                    {'error': 'Profile photo must not exceed 5 MB.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        cv = request.FILES.get('cv')
        if cv:
            allowed_doc_types = {'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
            if cv.content_type not in allowed_doc_types:
                return Response(
                    {'error': 'CV must be a PDF or DOCX file.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if cv.size > MAX_SIZE:
                return Response(
                    {'error': 'CV must not exceed 5 MB.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        # ─────────────────────────────────────────────────────────────────────

        serializer = GraduateProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GraduateListView(APIView):
    """
    Public graduate directory — returns privacy-safe profiles.
    Academic credentials (GPA, degree, CV, phone, LinkedIn) are hidden.
    Only name, bio, skills, photo and availability are exposed.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = GraduateProfile.objects.filter(is_available=True)
        search = request.query_params.get('search', '')
        skill = request.query_params.get('skill', '')
        degree = request.query_params.get('degree', '')

        if search:
            profiles = profiles.filter(full_name__icontains=search) | \
                       profiles.filter(bio__icontains=search) | \
                       profiles.filter(skills__icontains=search)
        if skill:
            profiles = profiles.filter(skills__icontains=skill)
        if degree:
            profiles = profiles.filter(degree__icontains=degree)

        serializer = PublicGraduateProfileSerializer(profiles, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': profiles.count()})


class GraduateDetailView(APIView):
    """
    Individual graduate profile view.
    Access rules:
    - Graduate viewing their own profile → full profile (via GraduateProfileView)
    - Employer who has a valid application from this graduate → full academic profile
    - Everyone else → public (privacy-safe) profile only
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            profile = GraduateProfile.objects.get(pk=pk)
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        # Determine whether the requester is entitled to see academic credentials
        can_see_credentials = False

        if request.user.is_staff or request.user.role == 'administrator':
            # Admins see everything
            can_see_credentials = True
        elif request.user == profile.user:
            # Graduate viewing their own profile
            can_see_credentials = True
        elif request.user.role == 'employer':
            # Employer can only see full profile if the graduate applied to one of their jobs
            try:
                employer_profile = request.user.api_employer_profile
                applied = JobApplication.objects.filter(
                    graduate=profile,
                    job__employer=employer_profile,
                ).exists()
                can_see_credentials = applied
            except Exception:
                can_see_credentials = False

        if can_see_credentials:
            serializer = GraduateProfileSerializer(profile, context={'request': request})
        else:
            serializer = PublicGraduateProfileSerializer(profile, context={'request': request})

        return Response(serializer.data)
