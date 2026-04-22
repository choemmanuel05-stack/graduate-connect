from django.db import models
from django.conf import settings
from employers.models import EmployerProfile
from graduates.models import GraduateProfile, DEGREE_CHOICES


class JobListing(models.Model):
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='job_listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    required_degree_type = models.CharField(max_length=20, choices=DEGREE_CHOICES, blank=True)
    minimum_gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    required_specialization = models.CharField(max_length=200, blank=True)
    required_skills = models.TextField(blank=True, help_text='Comma-separated list of skills')
    application_deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.employer.company_name}"


class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('interviewed', 'Interviewed'),
        ('rejected', 'Rejected'),
    ]
    graduate = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE, related_name='applications')
    job_listing = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    submitted_at = models.DateTimeField(auto_now_add=True)
    status_updated_at = models.DateTimeField(auto_now=True)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        unique_together = ('graduate', 'job_listing')

    def __str__(self):
        return f"{self.graduate.user.email} → {self.job_listing.title}"
