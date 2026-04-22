from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import SavedJob, Job
from .serializers import JobSerializer


class SavedJobsView(APIView):
    """List all saved jobs for the current user, or save/unsave a job."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved = SavedJob.objects.filter(user=request.user).select_related('job', 'job__employer')
        jobs = [s.job for s in saved]
        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': len(jobs)})

    def post(self, request):
        """Toggle save/unsave for a job."""
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            saved.delete()
            return Response({'saved': False, 'message': 'Job removed from saved'})
        return Response({'saved': True, 'message': 'Job saved successfully'}, status=status.HTTP_201_CREATED)


class SavedJobStatusView(APIView):
    """Check if a specific job is saved by the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        is_saved = SavedJob.objects.filter(user=request.user, job_id=job_id).exists()
        return Response({'saved': is_saved})
