from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from accounts.decorators import role_required
from .models import EmployerProfile
from .forms import EmployerProfileForm, JobListingForm
from jobs.models import JobListing, Application
from graduates.models import GraduateProfile


@login_required
@role_required('employer')
def employer_profile(request):
    profile, _ = EmployerProfile.objects.get_or_create(
        user=request.user,
        defaults={'company_name': request.user.get_full_name() or request.user.email}
    )
    if request.method == 'POST':
        form = EmployerProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated.')
            return redirect('employer_dashboard')
    else:
        form = EmployerProfileForm(instance=profile)
    return render(request, 'employers/profile_form.html', {'form': form})


@login_required
@role_required('employer')
def employer_dashboard(request):
    profile, _ = EmployerProfile.objects.get_or_create(
        user=request.user,
        defaults={'company_name': request.user.get_full_name() or request.user.email}
    )
    listings = JobListing.objects.filter(employer=profile).order_by('-created_at')
    return render(request, 'employers/dashboard.html', {'profile': profile, 'listings': listings})


@login_required
@role_required('employer')
def job_create(request):
    profile, _ = EmployerProfile.objects.get_or_create(
        user=request.user,
        defaults={'company_name': request.user.get_full_name() or request.user.email}
    )
    if request.method == 'POST':
        form = JobListingForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.employer = profile
            job.save()
            messages.success(request, 'Job listing created.')
            return redirect('employer_dashboard')
    else:
        form = JobListingForm()
    return render(request, 'employers/job_form.html', {'form': form, 'action': 'Create'})


@login_required
@role_required('employer')
def job_update(request, pk):
    profile = get_object_or_404(EmployerProfile, user=request.user)
    job = get_object_or_404(JobListing, pk=pk, employer=profile)
    if request.method == 'POST':
        form = JobListingForm(request.POST, instance=job)
        if form.is_valid():
            form.save()
            messages.success(request, 'Job listing updated.')
            return redirect('employer_dashboard')
    else:
        form = JobListingForm(instance=job)
    return render(request, 'employers/job_form.html', {'form': form, 'action': 'Update'})


@login_required
@role_required('employer')
def job_deactivate(request, pk):
    profile = get_object_or_404(EmployerProfile, user=request.user)
    job = get_object_or_404(JobListing, pk=pk, employer=profile)
    job.is_active = False
    job.save()
    messages.success(request, 'Job listing deactivated.')
    return redirect('employer_dashboard')


@login_required
@role_required('employer')
def candidate_search(request):
    profiles = GraduateProfile.objects.filter(
        credentials__status='verified'
    ).distinct()

    degree = request.GET.get('degree_type', '')
    min_gpa = request.GET.get('min_gpa', '')
    specialization = request.GET.get('specialization', '')
    skills = request.GET.get('skills', '')

    if degree:
        profiles = profiles.filter(degree_type=degree)
    if min_gpa:
        try:
            profiles = profiles.filter(gpa__gte=float(min_gpa))
        except ValueError:
            pass
    if specialization:
        profiles = profiles.filter(specialization__icontains=specialization)
    if skills:
        profiles = profiles.filter(skills__icontains=skills)

    paginator = Paginator(profiles, 20)
    page = request.GET.get('page')
    profiles_page = paginator.get_page(page)

    return render(request, 'employers/candidate_search.html', {
        'profiles': profiles_page,
        'filters': {'degree_type': degree, 'min_gpa': min_gpa, 'specialization': specialization, 'skills': skills},
    })


@login_required
@role_required('employer')
def application_management(request, pk):
    profile = get_object_or_404(EmployerProfile, user=request.user)
    job = get_object_or_404(JobListing, pk=pk, employer=profile)
    applications = Application.objects.filter(job_listing=job).select_related('graduate__user').order_by('-match_score')

    if request.method == 'POST':
        app_id = request.POST.get('application_id')
        new_status = request.POST.get('status')
        valid_statuses = ['shortlisted', 'interviewed', 'rejected']
        if app_id and new_status in valid_statuses:
            app = get_object_or_404(Application, pk=app_id, job_listing=job)
            app.status = new_status
            app.save()
            messages.success(request, 'Application status updated.')
        return redirect('application_management', pk=pk)

    return render(request, 'employers/application_management.html', {'job': job, 'applications': applications})
