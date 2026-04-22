from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    """In-memory notification model — add to api/models.py for persistence."""
    pass


# Simple in-memory notification store (replace with DB model in production)
_notifications: dict = {}


def create_notification(user_id: int, message: str, notif_type: str = 'system'):
    """Create a notification for a user."""
    import time
    if user_id not in _notifications:
        _notifications[user_id] = []
    _notifications[user_id].insert(0, {
        'id': int(time.time() * 1000),
        'message': message,
        'type': notif_type,
        'read': False,
        'created_at': __import__('datetime').datetime.now().isoformat(),
    })
    # Keep only last 50
    _notifications[user_id] = _notifications[user_id][:50]


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        notifs = _notifications.get(user_id, [])
        return Response({'results': notifs, 'unread': sum(1 for n in notifs if not n['read'])})


class MarkNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.user.id
        if user_id in _notifications:
            for n in _notifications[user_id]:
                n['read'] = True
        return Response({'status': 'ok'})
