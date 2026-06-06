"""
api/notification_views.py
--------------------------
Persistent in-app notification system backed by the Notification model.
Replaces the previous in-memory dict implementation.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


def create_notification(user_id: int, message: str, notif_type: str = 'system') -> None:
    """
    Create a persistent notification for a user.
    Called from job_views.py when application status changes.
    """
    try:
        user = User.objects.get(pk=user_id)
        Notification.objects.create(user=user, message=message, notif_type=notif_type)
        # Trim to last 100 notifications per user to avoid unbounded growth
        old_ids = (
            Notification.objects.filter(user=user)
            .order_by('-created_at')
            .values_list('id', flat=True)[100:]
        )
        if old_ids:
            Notification.objects.filter(id__in=list(old_ids)).delete()
    except User.DoesNotExist:
        pass


class NotificationListView(APIView):
    """GET /api/notifications/ — return current user's notifications."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user)
        data = [
            {
                'id': n.id,
                'message': n.message,
                'type': n.notif_type,
                'read': n.read,
                'created_at': n.created_at.isoformat(),
            }
            for n in notifs
        ]
        return Response({
            'results': data,
            'unread': sum(1 for n in data if not n['read']),
        })


class MarkNotificationsReadView(APIView):
    """POST /api/notifications/mark-read/ — mark all as read."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({'status': 'ok'})
