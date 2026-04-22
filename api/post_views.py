from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Post, PostLike, PostComment, GraduateProfile, EmployerProfile

User = get_user_model()


def get_author_name(user):
    if hasattr(user, 'api_graduate_profile'):
        return user.api_graduate_profile.full_name or user.email
    if hasattr(user, 'api_employer_profile'):
        return user.api_employer_profile.company_name or user.email
    return user.get_full_name() or user.email


def serialize_post(post, request_user=None):
    is_liked = False
    if request_user and request_user.is_authenticated:
        is_liked = post.likes.filter(user=request_user).exists()
    return {
        'id': str(post.id),
        'author': {
            'id': str(post.author.id),
            'name': get_author_name(post.author),
            'role': post.author.role,
            'email': post.author.email,
        },
        'content': post.content,
        'image': post.image.url if post.image else None,
        'timestamp': post.created_at.isoformat(),
        'likes': post.likes.count(),
        'comments': post.comments.count(),
        'shares': 0,
        'isLiked': is_liked,
    }


def serialize_comment(comment):
    return {
        'id': str(comment.id),
        'author': {
            'id': str(comment.author.id),
            'name': get_author_name(comment.author),
            'role': comment.author.role,
        },
        'content': comment.content,
        'timestamp': comment.created_at.isoformat(),
    }


class PostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page - 1) * limit

        posts = Post.objects.select_related('author').prefetch_related('likes', 'comments')
        total = posts.count()
        posts = posts[offset:offset + limit]

        return Response({
            'results': [serialize_post(p, request.user) for p in posts],
            'count': total,
            'next': page + 1 if offset + limit < total else None,
            'previous': page - 1 if page > 1 else None,
        })

    def post(self, request):
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)
        if len(content) > 2000:
            return Response({'error': 'Post too long (max 2000 characters)'}, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(author=request.user, content=content)
        return Response(serialize_post(post, request.user), status=status.HTTP_201_CREATED)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk, author=request.user)
        except Post.DoesNotExist:
            return Response({'error': 'Not found or not your post'}, status=status.HTTP_404_NOT_FOUND)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            return Response({'liked': False, 'likes': post.likes.count()})
        return Response({'liked': True, 'likes': post.likes.count()})


class PostCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        comments = post.comments.select_related('author').all()
        return Response({'results': [serialize_comment(c) for c in comments]})

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'Comment cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
        comment = PostComment.objects.create(post=post, author=request.user, content=content)
        return Response(serialize_comment(comment), status=status.HTTP_201_CREATED)
