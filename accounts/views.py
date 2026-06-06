import logging
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from django.core.cache import cache
from django.views.decorators.http import require_http_methods
import time

from .forms import RegistrationForm

logger = logging.getLogger(__name__)
User = get_user_model()


def _get_client_ip(request) -> str:
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '127.0.0.1')


def _is_rate_limited(key: str, max_attempts: int, window_seconds: int) -> bool:
    cache_key = f'rl:{key}'
    attempts = cache.get(cache_key, [])
    now = time.time()
    attempts = [t for t in attempts if now - t < window_seconds]
    if len(attempts) >= max_attempts:
        return True
    attempts.append(now)
    cache.set(cache_key, attempts, timeout=window_seconds)
    return False


def register_view(request):
    if request.user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        ip = _get_client_ip(request)
        if _is_rate_limited(f'register:{ip}', max_attempts=10, window_seconds=3600):
            messages.error(request, 'Too many registration attempts. Please try again later.')
            return render(request, 'accounts/register.html', {'form': RegistrationForm()})

        form = RegistrationForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            # Use ORM — no raw SQL
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=data['role'],
            )
            login(request, user)
            return _redirect_by_role(user)
    else:
        form = RegistrationForm()

    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return _redirect_by_role(request.user)

    if request.method == 'POST':
        ip = _get_client_ip(request)
        if _is_rate_limited(f'login:{ip}', max_attempts=5, window_seconds=300):
            messages.error(request, 'Too many login attempts. Please try again in 5 minutes.')
            return render(request, 'accounts/login.html')

        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        user = authenticate(request, email=email, password=password)
        if user is not None:
            cache.delete(f'login:{ip}')  # reset on success
            login(request, user)
            return _redirect_by_role(user)
        else:
            # Generic message — do not reveal whether email exists
            messages.error(request, 'Invalid email or password.')

    return render(request, 'accounts/login.html')


def logout_view(request):
    logout(request)
    return redirect('/accounts/login/')


def _redirect_by_role(user):
    if user.role == 'employer':
        return redirect('/employers/dashboard/')
    elif user.role == 'administrator':
        return redirect('/admin-panel/')
    else:
        return redirect('/graduates/profile/')
