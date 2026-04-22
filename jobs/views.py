from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from accounts.decorators import role_required
from .models import JobListing, Application
from .matching import compute_match_score
from graduates.models import GraduateProfile


def job_list(request):
    """Public job listing page — shows all active jobs."""
    jobs = JobListing.objects.filter(is_active=True).select_related('employer').order_by('-created_at')

    # Optional search filter
    q = request.GET.get('q', '').strip()
    if q:
        jobs = jobs.filter(title__icontains=q) | jobs.filter(description__icontains=q)

    return render(request, 'jobs/job_list.html', {'jobs': jobs, 'query': q})


def job_detail(request, pk):
    job = get_object_or_404(JobListing, pk=pk)
    already_applied = False
    if request.user.is_authenticated and hasattr(request.user, 'graduate_profile'):
        already_applied = Application.objects.filter(
            graduate=request.user.graduate_profile, job_listing=job
        ).exists()
    return render(request, 'jobs/job_detail.html', {'job': job, 'already_applied': already_applied})


@login_required
@role_required('graduate')
def apply_view(request, pk):
    job = get_object_or_404(JobListing, pk=pk)
    if not job.is_active:
        messages.error(request, 'This job listing is no longer active.')
        return redirect('job_detail', pk=pk)

    profile, _ = GraduateProfile.objects.get_or_create(user=request.user)

    if Application.objects.filter(graduate=profile, job_listing=job).exists():
        messages.error(request, 'You have already applied to this job.')
        return redirect('job_detail', pk=pk)

    score = compute_match_score(
        graduate_gpa=profile.gpa,
        graduate_degree=profile.degree_type,
        graduate_specialization=profile.specialization,
        graduate_skills_str=profile.skills,
        required_gpa=job.minimum_gpa,
        required_degree=job.required_degree_type,
        required_specialization=job.required_specialization,
        required_skills_str=job.required_skills,
    )

    Application.objects.create(graduate=profile, job_listing=job, match_score=score)
    messages.success(request, f'Application submitted! Your match score is {score}.')
    return redirect('application_dashboard')


@login_required
@role_required('employer')
def candidate_list(request, pk):
    from employers.models import EmployerProfile
    employer = get_object_or_404(EmployerProfile, user=request.user)
    job = get_object_or_404(JobListing, pk=pk, employer=employer)
    applications = Application.objects.filter(job_listing=job).select_related(
        'graduate__user'
    ).order_by('-match_score')
    return render(request, 'jobs/candidate_list.html', {'job': job, 'applications': applications})
