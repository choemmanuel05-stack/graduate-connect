from django.db import models
from django.conf import settings


DEGREE_CHOICES = [
    ('bachelor', 'Bachelor'),
    ('master', 'Master'),
    ('phd', 'PhD'),
    ('diploma', 'Diploma'),
    ('certificate', 'Certificate'),
]

CREDENTIAL_STATUS = [
    ('pending', 'Pending'),
    ('verified', 'Verified'),
    ('rejected', 'Rejected'),
]


class GraduateProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='graduate_profile')
    degree_type = models.CharField(max_length=20, choices=DEGREE_CHOICES, blank=True)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    university_name = models.CharField(max_length=200, blank=True)
    specialization = models.CharField(max_length=200, blank=True)
    skills = models.TextField(blank=True, help_text='Comma-separated list of skills')
    work_experience = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - Profile"


class Credential(models.Model):
    profile = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE, related_name='credentials')
    file = models.FileField(upload_to='credentials/')
    file_type = models.CharField(max_length=10, blank=True)
    status = models.CharField(max_length=10, choices=CREDENTIAL_STATUS, default='pending')
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='verified_credentials'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Credential for {self.profile.user.email} ({self.status})"
