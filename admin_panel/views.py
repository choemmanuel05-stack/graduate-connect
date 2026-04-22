from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.utils import timezone
from accounts.decorators import role_required
from graduates.models import GraduateProfile, Credential
from jobs.models import JobListing

User = get_user_model()


@login_required
@role_required('administrator')
def admin_dashboard(request):
    context = {
        'graduate_count': GraduateProfile.objects.count(),
        'employer_count': User.objects.filter(role='employer').count(),
        'pending_credentials': Credential.objects.filter(status='pending').count(),
        'active_listings': JobListing.objects.filter(is_active=True).count(),
    }
    return render(request, 'admin_panel/dashboard.html', context)


@login_required
@role_required('administrator')
def user_search(request):
    query = request.GET.get('q', '')
    users = User.objects.all()
    if query:
        users = users.filter(email__icontains=query) | users.filter(first_name__icontains=query) | users.filter(last_name__icontains=query)
    return render(request, 'admin_panel/user_search.html', {'users': users, 'query': query})


@login_required
@role_required('administrator')
def user_deactivate(request, pk):
    user = get_object_or_404(User, pk=pk)
    if user == request.user:
        messages.error(request, 'You cannot deactivate your own account.')
    else:
        user.is_active = False
        user.save()
        messages.success(request, f'{user.email} has been deactivated.')
    return redirect('user_search')


@login_required
@role_required('administrator')
def user_reactivate(request, pk):
    user = get_object_or_404(User, pk=pk)
    user.is_active = True
    user.save()
    messages.success(request, f'{user.email} has been reactivated.')
    return redirect('user_search')


@login_required
@role_required('administrator')
def credential_queue(request):
    credentials = Credential.objects.filter(status='pending').order_by('uploaded_at')
    return render(request, 'admin_panel/credential_queue.html', {'credentials': credentials})


@login_required
@role_required('administrator')
def credential_verify(request, pk):
    credential = get_object_or_404(Credential, pk=pk)
    credential.status = 'verified'
    credential.verified_by = request.user
    credential.verified_at = timezone.now()
    credential.save()
    messages.success(request, 'Credential verified.')
    return redirect('credential_queue')


@login_required
@role_required('administrator')
def credential_reject(request, pk):
    credential = get_object_or_404(Credential, pk=pk)
    if request.method == 'POST':
        credential.status = 'rejected'
        credential.rejection_reason = request.POST.get('reason', '')
        credential.save()
        messages.success(request, 'Credential rejected.')
        return redirect('credential_queue')
    return render(request, 'admin_panel/credential_detail.html', {'credential': credential})
