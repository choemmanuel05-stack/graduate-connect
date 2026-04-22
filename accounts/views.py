from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from .forms import RegistrationForm

User = get_user_model()


def register_view(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            names = data['full_name'].split(' ', 1)
            first_name = names[0]
            last_name = names[1] if len(names) > 1 else ''
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                first_name=first_name,
                last_name=last_name,
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
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return _redirect_by_role(user)
        else:
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
