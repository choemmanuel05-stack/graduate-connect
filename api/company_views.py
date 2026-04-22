from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import EmployerProfile, Job
from .serializers import EmployerProfileSerializer, JobSerializer


class CompanyDetailView(APIView):
    """Public company profile page — any authenticated user can view."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            company = EmployerProfile.objects.get(pk=pk)
        except EmployerProfile.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        # Active job listings for this company
        jobs = Job.objects.filter(employer=company, status='open').order_by('-created_at')

        company_data = EmployerProfileSerializer(company, context={'request': request}).data
        jobs_data = JobSerializer(jobs, many=True, context={'request': request}).data

        return Response({
            'company': company_data,
            'jobs': jobs_data,
            'jobs_count': jobs.count(),
            'total_jobs_ever': Job.objects.filter(employer=company).count(),
        })


class CompanyListView(APIView):
    """List all employer companies — for browsing."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '')
        industry = request.query_params.get('industry', '')

        companies = EmployerProfile.objects.all()
        if search:
            companies = companies.filter(company_name__icontains=search)
        if industry:
            companies = companies.filter(industry__icontains=industry)

        # Annotate with active job count
        from django.db.models import Count, Q
        companies = companies.annotate(
            active_jobs=Count('jobs', filter=Q(jobs__status='open'))
        ).order_by('-active_jobs', 'company_name')

        results = []
        for c in companies:
            data = EmployerProfileSerializer(c, context={'request': request}).data
            data['active_jobs'] = c.active_jobs
            results.append(data)

        return Response({'results': results, 'count': len(results)})
