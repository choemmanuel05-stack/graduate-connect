from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Feedback


class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')

        # Validate rating
        try:
            rating = int(rating)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Rating must be an integer between 1 and 5.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rating < 1 or rating > 5:
            return Response(
                {'error': 'Rating must be between 1 and 5.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Feedback.objects.create(
            user=request.user,
            rating=rating,
            comment=comment,
        )

        return Response(
            {'message': 'Thank you for your feedback!'},
            status=status.HTTP_201_CREATED,
        )
