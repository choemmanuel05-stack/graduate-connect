from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import GraduateProfile, EmployerProfile, Job, JobApplication

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'full_name']

    def validate_email(self, value):
        if not value.lower().endswith('@gmail.com'):
            raise serializers.ValidationError('Only Gmail addresses (@gmail.com) are accepted.')
        return value.lower()

    def validate_full_name(self, value):
        if len(value.strip()) < 8:
            raise serializers.ValidationError('Full name must be at least 8 characters.')
        return value

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        user = User.objects.create_user(**validated_data)
        # Create profile based on role
        if user.role == 'graduate':
            from .models import GraduateProfile as ApiGraduateProfile
            ApiGraduateProfile.objects.create(user=user, full_name=full_name)
        elif user.role == 'employer':
            from .models import EmployerProfile as ApiEmployerProfile
            ApiEmployerProfile.objects.create(user=user, company_name=full_name)
        return user


class GraduateProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    skills_list = serializers.SerializerMethodField()
    cv_url = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = GraduateProfile
        fields = [
            'id', 'email', 'full_name', 'phone', 'bio', 'university',
            'degree', 'field_of_study', 'graduation_year', 'gpa',
            'skills', 'skills_list', 'linkedin_url', 'github_url',
            'portfolio_url', 'cv_url', 'photo_url', 'is_available',
            'created_at',
        ]

    def get_skills_list(self, obj):
        return obj.get_skills_list()

    def get_cv_url(self, obj):
        if obj.cv:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.cv.url) if request else obj.cv.url
        return None

    def get_photo_url(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.profile_photo.url) if request else obj.profile_photo.url
        return None


class EmployerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = EmployerProfile
        fields = [
            'id', 'email', 'company_name', 'industry', 'company_size',
            'description', 'website', 'location', 'logo_url', 'created_at',
        ]

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
        return None


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    employer_logo = serializers.SerializerMethodField()
    employer_location = serializers.CharField(source='employer.location', read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'employer_name', 'employer_logo', 'employer_location',
            'title', 'description', 'requirements', 'location', 'job_type',
            'salary_min', 'salary_max', 'required_skills', 'status',
            'created_at', 'deadline', 'applications_count',
        ]

    def get_employer_logo(self, obj):
        if obj.employer.logo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.employer.logo.url) if request else obj.employer.logo.url
        return None

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    graduate_name = serializers.CharField(source='graduate.full_name', read_only=True)
    graduate_email = serializers.EmailField(source='graduate.user.email', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'graduate_name',
            'graduate_email', 'cover_letter', 'status', 'applied_at',
        ]
        read_only_fields = ['status', 'applied_at']
