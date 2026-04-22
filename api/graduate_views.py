from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import GraduateProfile
from .serializers import GraduateProfileSerializer


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
        try:
            profile = request.user.api_graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GraduateProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GraduateListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = GraduateProfile.objects.filter(is_available=True)
        search = request.query_params.get('search', '')
        skill = request.query_params.get('skill', '')
        degree = request.query_params.get('degree', '')

        if search:
            profiles = profiles.filter(full_name__icontains=search) | \
                       profiles.filter(university__icontains=search) | \
                       profiles.filter(field_of_study__icontains=search)
        if skill:
            profiles = profiles.filter(skills__icontains=skill)
        if degree:
            profiles = profiles.filter(degree__icontains=degree)

        serializer = GraduateProfileSerializer(profiles, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': profiles.count()})


class GraduateDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            profile = GraduateProfile.objects.get(pk=pk)
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GraduateProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
