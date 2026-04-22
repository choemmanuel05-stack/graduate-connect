from django import forms
from django.utils import timezone
from .models import EmployerProfile
from jobs.models import JobListing

CSS = 'form-control'
SELECT_CSS = 'form-select'


class EmployerProfileForm(forms.ModelForm):
    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'industry', 'location', 'contact_email']
        widgets = {
            'company_name': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Acme Corporation'}),
            'industry': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Technology, Finance, Healthcare'}),
            'location': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Bamenda, Cameroon'}),
            'contact_email': forms.EmailInput(attrs={'class': CSS, 'placeholder': 'hr@company.com'}),
        }


class JobListingForm(forms.ModelForm):
    class Meta:
        model = JobListing
        fields = ['title', 'description', 'required_degree_type', 'minimum_gpa',
                  'required_specialization', 'required_skills', 'application_deadline', 'is_active']
        widgets = {
            'title': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Software Engineer'}),
            'description': forms.Textarea(attrs={'class': CSS, 'rows': 6, 'placeholder': 'Describe the role, responsibilities, and requirements...'}),
            'required_degree_type': forms.Select(attrs={'class': SELECT_CSS}),
            'minimum_gpa': forms.NumberInput(attrs={'class': CSS, 'step': '0.01', 'min': '0', 'max': '4', 'placeholder': 'e.g. 3.0'}),
            'required_specialization': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Computer Science'}),
            'required_skills': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Python, Django, SQL'}),
            'application_deadline': forms.DateInput(attrs={'class': CSS, 'type': 'date'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def clean_minimum_gpa(self):
        gpa = self.cleaned_data.get('minimum_gpa')
        if gpa is not None:
            if gpa < 0 or gpa > 4:
                raise forms.ValidationError('Minimum GPA must be between 0.0 and 4.0.')
        return gpa

    def clean_application_deadline(self):
        deadline = self.cleaned_data.get('application_deadline')
        if deadline and deadline < timezone.now().date():
            raise forms.ValidationError('Application deadline must be a future date.')
        return deadline
