from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import GraduateProfile, Job, EmployerProfile
from .serializers import GraduateProfileSerializer, JobSerializer, EmployerProfileSerializer


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        search_type = request.query_params.get('type', 'all')
        results = {}

        if not query:
            return Response({'jobs': [], 'graduates': [], 'companies': [], 'query': ''})

        if search_type in ('all', 'jobs'):
            jobs = Job.objects.filter(status='open').select_related('employer')
            jobs = jobs.filter(
                __import__('django.db.models', fromlist=['Q']).Q(title__icontains=query) |
                __import__('django.db.models', fromlist=['Q']).Q(description__icontains=query) |
                __import__('django.db.models', fromlist=['Q']).Q(required_skills__icontains=query) |
                __import__('django.db.models', fromlist=['Q']).Q(employer__company_name__icontains=query)
            )
            results['jobs'] = JobSerializer(jobs[:8], many=True, context={'request': request}).data

        if search_type in ('all', 'graduates'):
            graduates = GraduateProfile.objects.filter(is_available=True)
            from django.db.models import Q
            graduates = graduates.filter(
                Q(full_name__icontains=query) |
                Q(skills__icontains=query) |
                Q(university__icontains=query) |
                Q(field_of_study__icontains=query)
            )
            results['graduates'] = GraduateProfileSerializer(
                graduates[:6], many=True, context={'request': request}
            ).data

        if search_type in ('all', 'companies'):
            companies = EmployerProfile.objects.filter(
                __import__('django.db.models', fromlist=['Q']).Q(company_name__icontains=query) |
                __import__('django.db.models', fromlist=['Q']).Q(industry__icontains=query) |
                __import__('django.db.models', fromlist=['Q']).Q(location__icontains=query)
            )
            results['companies'] = EmployerProfileSerializer(
                companies[:5], many=True, context={'request': request}
            ).data

        results['query'] = query
        return Response(results)
