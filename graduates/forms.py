from django import forms
from .models import GraduateProfile, Credential

ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

CSS = 'form-control'
SELECT_CSS = 'form-select'


class GraduateProfileForm(forms.ModelForm):
    class Meta:
        model = GraduateProfile
        fields = ['degree_type', 'gpa', 'graduation_year', 'university_name',
                  'specialization', 'skills', 'work_experience']
        widgets = {
            'degree_type': forms.Select(attrs={'class': SELECT_CSS}),
            'gpa': forms.NumberInput(attrs={'class': CSS, 'step': '0.01', 'min': '0', 'max': '4', 'placeholder': 'e.g. 3.50'}),
            'graduation_year': forms.NumberInput(attrs={'class': CSS, 'placeholder': 'e.g. 2024'}),
            'university_name': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. CATUC Bamenda'}),
            'specialization': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Computer Science'}),
            'skills': forms.TextInput(attrs={'class': CSS, 'placeholder': 'e.g. Python, Django, SQL, JavaScript'}),
            'work_experience': forms.Textarea(attrs={'class': CSS, 'rows': 4, 'placeholder': 'Describe your work experience...'}),
        }

    def clean_gpa(self):
        gpa = self.cleaned_data.get('gpa')
        if gpa is not None:
            if gpa < 0 or gpa > 4:
                raise forms.ValidationError('GPA must be between 0.0 and 4.0.')
        return gpa


class CredentialUploadForm(forms.ModelForm):
    class Meta:
        model = Credential
        fields = ['file']
        widgets = {
            'file': forms.FileInput(attrs={'class': CSS, 'accept': '.pdf,.jpg,.jpeg,.png'}),
        }

    def clean_file(self):
        file = self.cleaned_data.get('file')
        if file:
            if file.size > MAX_FILE_SIZE:
                raise forms.ValidationError('File size must not exceed 5 MB.')
            content_type = getattr(file, 'content_type', '')
            if content_type not in ALLOWED_MIME_TYPES:
                raise forms.ValidationError('Only PDF, JPEG, and PNG files are allowed.')
        return file
