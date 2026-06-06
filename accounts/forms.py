from django import forms
from django.contrib.auth import get_user_model
from api.validators import validate_name, validate_password_strength, validate_email_value

User = get_user_model()

ROLE_CHOICES = [
    ('graduate', 'Graduate'),
    ('employer', 'Employer'),
]


class RegistrationForm(forms.Form):
    first_name = forms.CharField(max_length=75, label='First Name')
    last_name = forms.CharField(max_length=75, label='Surname')
    email = forms.EmailField()
    role = forms.ChoiceField(choices=ROLE_CHOICES)
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    password_confirm = forms.CharField(widget=forms.PasswordInput, label='Confirm Password')

    def clean_first_name(self):
        return validate_name(self.cleaned_data.get('first_name', ''), 'First name')

    def clean_last_name(self):
        return validate_name(self.cleaned_data.get('last_name', ''), 'Surname')

    def clean_email(self):
        email = validate_email_value(self.cleaned_data.get('email', ''))
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email

    def clean_password(self):
        return validate_password_strength(self.cleaned_data.get('password', ''))

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError('Passwords do not match.')
        return cleaned_data
