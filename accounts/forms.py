from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

ROLE_CHOICES = [
    ('graduate', 'Graduate'),
    ('employer', 'Employer'),
]


class RegistrationForm(forms.Form):
    email = forms.EmailField()
    full_name = forms.CharField(max_length=150)
    role = forms.ChoiceField(choices=ROLE_CHOICES)
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    password_confirm = forms.CharField(widget=forms.PasswordInput, label='Confirm Password')

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError('Passwords do not match.')
        return cleaned_data
