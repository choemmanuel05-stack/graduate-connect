from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()


class IsAdmin:
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'administrator'


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'administrator':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all().values('id', 'email', 'role', 'date_joined', 'is_active')
        return Response({'results': list(users), 'count': len(list(users))})


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if request.user.role != 'administrator':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            if user == request.user:
                return Response({'error': 'Cannot delete yourself'}, status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        if request.user.role != 'administrator':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            if 'is_active' in request.data:
                user.is_active = request.data['is_active']
                user.save()
            return Response({'id': user.id, 'email': user.email, 'is_active': user.is_active})
        except User.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
