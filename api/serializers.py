from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import GraduateProfile, EmployerProfile, Job, JobApplication
from .validators import validate_name, validate_password_strength, validate_email_value

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'full_name']

    def validate_email(self, value):
        # Normalise — lowercase and strip whitespace
        value = validate_email_value(value)

        # Gmail-only during pilot phase (spec §3.6.1)
        if not value.endswith('@gmail.com'):
            raise serializers.ValidationError(
                'Only Gmail addresses (@gmail.com) are accepted during the pilot phase.'
            )

        # Case-insensitive duplicate check
        existing = User.objects.filter(email=value).first()
        if existing:
            if not existing.is_email_verified and not existing.is_superuser:
                # Unverified ghost account — delete it so the user can re-register cleanly
                existing.delete()
                return value
            raise serializers.ValidationError(
                'An account with this email already exists. Please sign in instead.'
            )
        return value

    def validate_password(self, value):
        return validate_password_strength(value)

    def validate_full_name(self, value):
        """
        Validate the combined full_name field.
        Split into first/last and validate each part.
        """
        value = value.strip()
        parts = value.split(None, 1)  # split on first whitespace
        if len(parts) < 2:
            raise serializers.ValidationError(
                'Please enter both your first name and surname.'
            )
        validate_name(parts[0], 'First name')
        validate_name(parts[1], 'Surname')
        return value

    def validate_role(self, value):
        allowed = {'graduate', 'employer'}
        if value not in allowed:
            raise serializers.ValidationError('Invalid role selected.')
        return value

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        parts = full_name.split(None, 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'graduate'),
            first_name=first_name,
            last_name=last_name,
        )

        # Create profile based on role
        if user.role == 'graduate':
            from .models import GraduateProfile as ApiGraduateProfile
            ApiGraduateProfile.objects.create(user=user, full_name=full_name)
        elif user.role == 'employer':
            from .models import EmployerProfile as ApiEmployerProfile
            ApiEmployerProfile.objects.create(user=user, company_name=full_name)

        return user


class GraduateProfileSerializer(serializers.ModelSerializer):
    """
    Full serializer — used when:
    - The graduate is viewing their own profile
    - An employer views an applicant who applied to their job
    - An admin views any profile
    Academic credentials (GPA, degree, university, CV, phone, LinkedIn, GitHub)
    are included here but stripped in PublicGraduateProfileSerializer.
    """
    email = serializers.EmailField(source='user.email', read_only=True)
    skills_list = serializers.SerializerMethodField()
    cv_url = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = GraduateProfile
        fields = [
            'id', 'email', 'full_name', 'phone', 'bio', 'university',
            'degree', 'field_of_study', 'graduation_year', 'gpa',
            'skills', 'skills_list', 'linkedin_url', 'github_url',
            'portfolio_url', 'profile_photo', 'cv_url', 'photo_url',
            'profile_photo_url', 'is_available', 'created_at',
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

    def get_profile_photo_url(self, obj):
        request = self.context.get('request')
        if obj.profile_photo and request:
            return request.build_absolute_uri(obj.profile_photo.url)
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and not request.user.is_staff:
            data.pop('is_staff', None)
            data.pop('is_superuser', None)
        return data


class PublicGraduateProfileSerializer(serializers.ModelSerializer):
    """
    Privacy-safe serializer for the public graduate directory.
    Academic credentials (GPA, degree, university, graduation year, phone,
    LinkedIn, GitHub, CV) are intentionally excluded to prevent social
    engineering attacks. Only visible to authenticated users browsing the
    directory — not to the public internet.
    """
    skills_list = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    # Fields deliberately omitted (hidden from public):
    #   gpa, degree, field_of_study, graduation_year, university,
    #   phone, linkedin_url, github_url, cv_url, email

    class Meta:
        model = GraduateProfile
        fields = [
            'id', 'full_name', 'bio',
            'skills', 'skills_list',
            'photo_url', 'profile_photo',
            'is_available',
        ]

    def get_skills_list(self, obj):
        return obj.get_skills_list()

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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and not request.user.is_staff:
            data.pop('is_staff', None)
            data.pop('is_superuser', None)
        return data


class PublicJobSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the public jobs endpoint — no auth required."""
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'title', 'employer_name', 'location', 'job_type', 'created_at']


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
            'salary_min', 'salary_max', 'required_skills', 'required_degree',
            'required_gpa', 'status', 'created_at', 'deadline', 'applications_count',
        ]

    def get_employer_logo(self, obj):
        if obj.employer.logo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.employer.logo.url) if request else obj.employer.logo.url
        return None

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobApplicationSerializer(serializers.ModelSerializer):
    """
    Used by employers viewing applicants for their jobs.
    Includes the full academic profile (GPA, degree, CV URL) because
    the graduate explicitly consented to share these by applying.
    """
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    graduate_name = serializers.CharField(source='graduate.full_name', read_only=True)
    graduate_email = serializers.EmailField(source='graduate.user.email', read_only=True)
    # Academic credentials — visible to employer because graduate applied
    graduate_university = serializers.CharField(source='graduate.university', read_only=True)
    graduate_degree = serializers.CharField(source='graduate.degree', read_only=True)
    graduate_field_of_study = serializers.CharField(source='graduate.field_of_study', read_only=True)
    graduate_gpa = serializers.DecimalField(source='graduate.gpa', max_digits=3, decimal_places=2, read_only=True)
    graduate_cv_url = serializers.SerializerMethodField()
    graduate_skills = serializers.CharField(source='graduate.skills', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name',
            'graduate_name', 'graduate_email',
            'graduate_university', 'graduate_degree', 'graduate_field_of_study',
            'graduate_gpa', 'graduate_cv_url', 'graduate_skills',
            'cover_letter', 'status', 'match_score', 'applied_at',
        ]
        read_only_fields = ['status', 'match_score', 'applied_at']

    def get_graduate_cv_url(self, obj):
        if obj.graduate.cv:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.graduate.cv.url) if request else obj.graduate.cv.url
        return None
