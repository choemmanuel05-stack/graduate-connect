from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Follow

User = get_user_model()


class FollowView(APIView):
    """
    POST /api/users/<user_id>/follow/   — follow or unfollow a user (toggle)
    GET  /api/users/<user_id>/follow/   — check if current user follows this user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        is_following = Follow.objects.filter(
            follower=request.user, following=target
        ).exists()
        followers_count = Follow.objects.filter(following=target).count()
        following_count = Follow.objects.filter(follower=target).count()

        return Response({
            'is_following': is_following,
            'followers_count': followers_count,
            'following_count': following_count,
        })

    def post(self, request, user_id):
        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if target == request.user:
            return Response({'error': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        follow, created = Follow.objects.get_or_create(
            follower=request.user, following=target
        )

        if not created:
            # Already following — unfollow
            follow.delete()
            action = 'unfollowed'
        else:
            action = 'followed'

        followers_count = Follow.objects.filter(following=target).count()

        return Response({
            'action': action,
            'is_following': action == 'followed',
            'followers_count': followers_count,
        })


class FollowersListView(APIView):
    """GET /api/users/<user_id>/followers/ — list followers of a user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        followers = Follow.objects.filter(following=target).select_related('follower')
        data = [
            {
                'id': f.follower.id,
                'email': f.follower.email,
                'name': f'{f.follower.first_name} {f.follower.last_name}'.strip() or f.follower.email,
                'role': f.follower.role,
            }
            for f in followers
        ]
        return Response({'results': data, 'count': len(data)})


class FollowingListView(APIView):
    """GET /api/users/<user_id>/following/ — list users that this user follows"""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(follower=target).select_related('following')
        data = [
            {
                'id': f.following.id,
                'email': f.following.email,
                'name': f'{f.following.first_name} {f.following.last_name}'.strip() or f.following.email,
                'role': f.following.role,
            }
            for f in following
        ]
        return Response({'results': data, 'count': len(data)})
