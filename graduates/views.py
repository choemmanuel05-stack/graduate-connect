from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from accounts.decorators import role_required
from .models import GraduateProfile, Credential
from .forms import GraduateProfileForm, CredentialUploadForm


@login_required
@role_required('graduate')
def profile_create_update(request):
    profile, _ = GraduateProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = GraduateProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile_detail', pk=profile.pk)
    else:
        form = GraduateProfileForm(instance=profile)
    return render(request, 'graduates/profile_form.html', {'form': form})


def profile_detail(request, pk):
    profile = get_object_or_404(GraduateProfile, pk=pk)
    credentials = profile.credentials.all()
    return render(request, 'graduates/profile_detail.html', {
        'profile': profile,
        'credentials': credentials,
    })


@login_required
@role_required('graduate')
def credential_upload(request):
    profile, _ = GraduateProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = CredentialUploadForm(request.POST, request.FILES)
        if form.is_valid():
            credential = form.save(commit=False)
            credential.profile = profile
            credential.file_type = request.FILES['file'].content_type
            credential.save()
            messages.success(request, 'Credential uploaded successfully. Pending verification.')
            return redirect('profile_create_update')
    else:
        form = CredentialUploadForm()
    return render(request, 'graduates/credential_upload.html', {'form': form})


@login_required
@role_required('graduate')
def application_dashboard(request):
    profile, _ = GraduateProfile.objects.get_or_create(user=request.user)
    try:
        from jobs.models import Application
        applications = Application.objects.filter(graduate=profile).select_related('job_listing')
    except Exception:
        applications = []
    return render(request, 'graduates/application_dashboard.html', {'applications': applications})
