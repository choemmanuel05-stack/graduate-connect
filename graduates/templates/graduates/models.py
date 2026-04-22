from django.db import models
from django.contrib.auth.models import User

class GraduateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    degree_type = models.CharField(max_length=100)
    gpa = models.DecimalField(max_digits=4, decimal_places=2)
    specialization = models.CharField(max_length=100)
    skills = models.TextField()
    experience = models.TextField(blank=True)
    verified = models.BooleanField(default=False)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    def __str__(self):
        return self.user.username
