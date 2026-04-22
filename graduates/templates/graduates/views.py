from django.shortcuts import render, redirect
from .forms import UserForm, GraduateProfileForm
from django.contrib.auth import login

def graduate_register(request):
    if request.method == 'POST':
        user_form = UserForm(request.POST)
        profile_form = GraduateProfileForm(request.POST, request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save(commit=False)
            user.set_password(user.password)
            user.save()
            profile = profile_form.save(commit=False)
            profile.user = user
            profile.save()
            login(request, user)
            return redirect('graduate_dashboard')  # You will create this view later
    else:
        user_form = UserForm()
        profile_form = GraduateProfileForm()
    return render(request, 'graduates/register.html', {'user_form': user_form, 'profile_form': profile_form})
