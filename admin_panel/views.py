from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from functools import wraps
from graduates.models import GraduateProfile, Credential
from jobs.models import JobListing

User = get_user_model()

# ── Admin auth guard ──────────────────────────────────────────────────────────

def admin_login_required(view_func):
    """Redirect to the admin login page (not the main app login)."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('admin_login')
        if request.user.role != 'administrator' and not request.user.is_staff:
            messages.error(request, 'Access denied. Administrator account required.')
            return redirect('admin_login')
        return view_func(request, *args, **kwargs)
    return wrapper


# ── Admin Login / Logout ──────────────────────────────────────────────────────

def admin_login(request):
    """Standalone admin login — completely separate from the main app login."""
    # Already logged in as admin → go straight to dashboard
    if request.user.is_authenticated and (
        request.user.role == 'administrator' or request.user.is_staff
    ):
        return redirect('admin_dashboard')

    error = None
    if request.method == 'POST':
        email    = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        user = authenticate(request, username=email, password=password)
        if user is None:
            error = 'Invalid email or password.'
        elif not user.is_active:
            error = 'This account has been deactivated.'
        elif user.role != 'administrator' and not user.is_staff:
            error = 'Access denied. This portal is for administrators only.'
        else:
            login(request, user)
            return redirect('admin_dashboard')

    return render(request, 'admin_panel/login.html', {'error': error})


def admin_logout(request):
    logout(request)
    return redirect('admin_login')


# ── Dashboard ─────────────────────────────────────────────────────────────────

@admin_login_required
def admin_dashboard(request):
    try:
        active_listings = JobListing.objects.filter(is_active=True).count()
    except Exception:
        active_listings = 0

    context = {
        'graduate_count':       GraduateProfile.objects.count(),
        'employer_count':       User.objects.filter(role='employer').count(),
        'pending_credentials':  Credential.objects.filter(status='pending').count(),
        'active_listings':      active_listings,
        'total_users':          User.objects.count(),
        'admin_user':           request.user,
    }
    return render(request, 'admin_panel/dashboard.html', context)


# ── User Management ───────────────────────────────────────────────────────────

@admin_login_required
def user_list(request):
    query = request.GET.get('q', '')
    role  = request.GET.get('role', '')
    users = User.objects.all().order_by('-date_joined')

    if query:
        users = users.filter(email__icontains=query)
    if role:
        users = users.filter(role=role)

    return render(request, 'admin_panel/user_list.html', {
        'users': users, 'query': query, 'role_filter': role,
    })


# Keep old name working
def user_search(request):
    return user_list(request)


@admin_login_required
def user_deactivate(request, pk):
    user = get_object_or_404(User, pk=pk)
    if user == request.user:
        messages.error(request, 'You cannot deactivate your own account.')
    else:
        user.is_active = False
        user.save()
        messages.success(request, f'{user.email} has been deactivated.')
    return redirect('user_list')


@admin_login_required
def user_reactivate(request, pk):
    user = get_object_or_404(User, pk=pk)
    user.is_active = True
    user.save()
    messages.success(request, f'{user.email} has been reactivated.')
    return redirect('user_list')


# ── Credential Verification ───────────────────────────────────────────────────

@admin_login_required
def credential_queue(request):
    status_filter = request.GET.get('status', 'pending')
    credentials   = Credential.objects.select_related('profile__user', 'verified_by')

    if status_filter in ('pending', 'verified', 'rejected'):
        credentials = credentials.filter(status=status_filter)

    credentials = credentials.order_by('uploaded_at')
    return render(request, 'admin_panel/credential_queue.html', {
        'credentials':    credentials,
        'status_filter':  status_filter,
        'pending_count':  Credential.objects.filter(status='pending').count(),
        'statuses':       ['pending', 'verified', 'rejected'],
    })


@admin_login_required
def credential_verify(request, pk):
    credential = get_object_or_404(Credential, pk=pk)
    if credential.status != 'verified':
        credential.status      = 'verified'
        credential.verified_by = request.user
        credential.verified_at = timezone.now()
        credential.rejection_reason = ''
        credential.save()
        messages.success(request, f'Credential #{pk} verified successfully.')
    return redirect('credential_queue')


@admin_login_required
def credential_reject(request, pk):
    credential = get_object_or_404(Credential, pk=pk)
    if request.method == 'POST':
        reason = request.POST.get('reason', '').strip()
        if not reason:
            messages.error(request, 'A rejection reason is required.')
            return render(request, 'admin_panel/credential_detail.html', {'credential': credential})
        credential.status           = 'rejected'
        credential.rejection_reason = reason
        credential.verified_by      = request.user
        credential.verified_at      = timezone.now()
        credential.save()
        messages.success(request, f'Credential #{pk} rejected.')
        return redirect('credential_queue')
    return render(request, 'admin_panel/credential_detail.html', {'credential': credential})
