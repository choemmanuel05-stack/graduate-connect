from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import EmployerProfile
from .serializers import EmployerProfileSerializer


class EmployerProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            profile = request.user.api_employer_profile
        except EmployerProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EmployerProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        # Ownership check: if the request body includes a user_id that doesn't
        # match the authenticated user and the user is not staff, reject with 403.
        requested_user_id = request.data.get('user_id') or request.data.get('user')
        if requested_user_id is not None:
            try:
                requested_user_id = int(requested_user_id)
            except (ValueError, TypeError):
                return Response({'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)
            if requested_user_id != request.user.pk and not request.user.is_staff:
                return Response({'error': 'You do not have permission to edit this profile'}, status=status.HTTP_403_FORBIDDEN)

        try:
            profile = request.user.api_employer_profile
        except EmployerProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EmployerProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
