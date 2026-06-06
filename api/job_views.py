from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Job, JobApplication, EmployerProfile, GraduateProfile
from .serializers import JobSerializer, JobApplicationSerializer, PublicJobSerializer


class PublicJobListView(APIView):
    """
    Publicly accessible endpoint that returns open jobs without requiring authentication.
    Supports query params: status=open, ordering=-created_at, limit=6
    Returns fields: id, title, employer_name, location, job_type, created_at
    """
    permission_classes = [AllowAny]

    def get(self, request):
        jobs = Job.objects.filter(status='open').select_related('employer').order_by('-created_at')

        # Support explicit status filter (only 'open' is meaningful for public view)
        status_param = request.query_params.get('status', 'open')
        if status_param:
            jobs = jobs.filter(status=status_param)

        # Support limit param (default 6)
        try:
            limit = int(request.query_params.get('limit', 6))
        except (ValueError, TypeError):
            limit = 6
        jobs = jobs[:limit]

        serializer = PublicJobSerializer(jobs, many=True)
        return Response({'results': serializer.data, 'count': len(serializer.data)})


class JobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(status='open').select_related('employer')
        search = request.query_params.get('search', '')
        job_type = request.query_params.get('job_type', '')
        location = request.query_params.get('location', '')

        if search:
            jobs = jobs.filter(title__icontains=search) | jobs.filter(description__icontains=search)
        if job_type:
            jobs = jobs.filter(job_type=job_type)
        if location:
            jobs = jobs.filter(location__icontains=location)

        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': jobs.count()})

    def post(self, request):
        if request.user.role != 'employer':
            return Response({'error': 'Only employers can post jobs'}, status=status.HTTP_403_FORBIDDEN)
        try:
            employer = request.user.api_employer_profile
        except EmployerProfile.DoesNotExist:
            return Response({'error': 'Employer profile not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(employer=employer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = JobSerializer(job, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, employer=request.user.api_employer_profile)
        except (Job.DoesNotExist, EmployerProfile.DoesNotExist):
            return Response({'error': 'Not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)
        serializer = JobSerializer(job, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, employer=request.user.api_employer_profile)
        except (Job.DoesNotExist, EmployerProfile.DoesNotExist):
            return Response({'error': 'Not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class JobApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'graduate':
            return Response({'error': 'Only graduates can apply'}, status=status.HTTP_403_FORBIDDEN)
        try:
            job = Job.objects.get(pk=pk, status='open')
            graduate = request.user.api_graduate_profile
        except (Job.DoesNotExist, GraduateProfile.DoesNotExist):
            return Response({'error': 'Job not found or profile missing'}, status=status.HTTP_404_NOT_FOUND)

        if JobApplication.objects.filter(job=job, graduate=graduate).exists():
            return Response({'error': 'Already applied'}, status=status.HTTP_400_BAD_REQUEST)

        # Compute match score per spec Appendix B.1
        from .matching import calculate_match_score
        score = calculate_match_score(graduate, job)

        application = JobApplication.objects.create(
            job=job,
            graduate=graduate,
            cover_letter=request.data.get('cover_letter', ''),
            match_score=score,
        )
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            graduate = request.user.api_graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        applications = JobApplication.objects.filter(graduate=graduate).select_related('job', 'job__employer')
        serializer = JobApplicationSerializer(applications, many=True)
        return Response({'results': serializer.data})


class WithdrawApplicationView(APIView):
    """Graduate withdraws (deletes) their own application."""
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            graduate = request.user.api_graduate_profile
        except GraduateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            application = JobApplication.objects.get(pk=pk, graduate=graduate)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        # Only allow withdrawal if still pending/reviewed (not shortlisted/accepted)
        if application.status in ('shortlisted', 'accepted'):
            return Response(
                {'error': f'Cannot withdraw — application is already {application.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.delete()
        return Response({'message': 'Application withdrawn successfully'}, status=status.HTTP_204_NO_CONTENT)


class EmployerJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employer = request.user.api_employer_profile
        except EmployerProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        jobs = Job.objects.filter(employer=employer)
        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response({'results': serializer.data})


class JobApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, employer=request.user.api_employer_profile)
        except (Job.DoesNotExist, EmployerProfile.DoesNotExist):
            return Response({'error': 'Not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)
        applications = job.applications.select_related('graduate', 'graduate__user')
        serializer = JobApplicationSerializer(applications, many=True)
        return Response({'results': serializer.data})

    def patch(self, request, pk):
        """Update application status and send email notification."""
        app_id = request.data.get('application_id')
        new_status = request.data.get('status')
        try:
            application = JobApplication.objects.get(pk=app_id, job__employer=request.user.api_employer_profile)
        except (JobApplication.DoesNotExist, EmployerProfile.DoesNotExist):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        old_status = application.status
        application.status = new_status
        application.save()

        # Send email notification to graduate
        if old_status != new_status:
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                graduate_email = application.graduate.user.email
                job_title = application.job.title
                company = application.job.employer.company_name
                status_messages = {
                    'shortlisted': f'Congratulations! You have been shortlisted for {job_title} at {company}.',
                    'accepted': f'Great news! Your application for {job_title} at {company} has been accepted!',
                    'rejected': f'Thank you for applying to {job_title} at {company}. Unfortunately, your application was not successful this time.',
                    'reviewed': f'Your application for {job_title} at {company} has been reviewed.',
                }
                msg = status_messages.get(new_status, f'Your application status for {job_title} has been updated to: {new_status}')
                send_mail(
                    subject=f'Application Update: {job_title} at {company}',
                    message=msg,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@graduateconnect.com'),
                    recipient_list=[graduate_email],
                    fail_silently=True,
                )
                # Also create in-app notification
                from .notification_views import create_notification
                create_notification(application.graduate.user.id, msg, 'application')
            except Exception:
                pass  # Don't fail the request if email fails

        return Response(JobApplicationSerializer(application).data)
