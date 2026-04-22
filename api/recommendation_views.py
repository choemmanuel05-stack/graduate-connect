from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .matching import get_recommended_jobs, get_recommended_graduates
from .serializers import JobSerializer, GraduateProfileSerializer
from .models import GraduateProfile, Job, EmployerProfile


class RecommendedJobsView(APIView):
    """Returns AI-matched jobs for the logged-in graduate."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            graduate = request.user.api_graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'results': []})

        matches = get_recommended_jobs(graduate, limit=10)
        results = []
        for score, job in matches:
            data = JobSerializer(job, context={'request': request}).data
            data['match_score'] = score
            results.append(data)

        return Response({'results': results, 'count': len(results)})


class RecommendedGraduatesView(APIView):
    """Returns AI-matched graduates for a specific job."""
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(pk=job_id, employer=request.user.api_employer_profile)
        except (Job.DoesNotExist, EmployerProfile.DoesNotExist):
            return Response({'error': 'Not found'}, status=404)

        matches = get_recommended_graduates(job, limit=20)
        results = []
        for score, grad in matches:
            data = GraduateProfileSerializer(grad, context={'request': request}).data
            data['match_score'] = score
            results.append(data)

        return Response({'results': results, 'count': len(results)})
