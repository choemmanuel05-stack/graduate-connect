from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import RegisterView, LoginView, MeView
from .email_verification_views import VerifyEmailView, ResendVerificationView
from .graduate_views import GraduateProfileView, GraduateListView, GraduateDetailView
from .employer_views import EmployerProfileView
from .job_views import (
    JobListView, JobDetailView, JobApplyView,
    MyApplicationsView, EmployerJobsView, JobApplicationsView,
    WithdrawApplicationView,
)
from .post_views import PostView, PostDetailView, PostLikeView, PostCommentView
from .saved_job_views import SavedJobsView, SavedJobStatusView
from .password_reset_views import PasswordResetRequestView, PasswordResetConfirmView, PasswordChangeView
from .company_views import CompanyDetailView, CompanyListView
from .search_views import SearchView
from .admin_views import AdminUserListView, AdminUserDetailView
from .recommendation_views import RecommendedJobsView, RecommendedGraduatesView
from .notification_views import NotificationListView, MarkNotificationsReadView

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/me/', MeView.as_view()),
    path('auth/verify-email/', VerifyEmailView.as_view()),
    path('auth/resend-verification/', ResendVerificationView.as_view()),
    path('auth/password-reset/', PasswordResetRequestView.as_view()),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view()),
    path('auth/password-change/', PasswordChangeView.as_view()),

    # ── Graduates ─────────────────────────────────────────────────────────────
    path('graduates/profile/', GraduateProfileView.as_view()),
    path('graduates/', GraduateListView.as_view()),
    path('graduates/<int:pk>/', GraduateDetailView.as_view()),

    # ── Employers / Companies ─────────────────────────────────────────────────
    path('employers/profile/', EmployerProfileView.as_view()),
    path('employers/jobs/', EmployerJobsView.as_view()),
    path('employers/jobs/<int:pk>/applications/', JobApplicationsView.as_view()),
    path('companies/', CompanyListView.as_view()),
    path('companies/<int:pk>/', CompanyDetailView.as_view()),

    # ── Jobs ──────────────────────────────────────────────────────────────────
    path('jobs/', JobListView.as_view()),
    path('jobs/<int:pk>/', JobDetailView.as_view()),
    path('jobs/<int:pk>/apply/', JobApplyView.as_view()),
    path('jobs/my-applications/', MyApplicationsView.as_view()),
    path('jobs/applications/<int:pk>/withdraw/', WithdrawApplicationView.as_view()),

    # ── Saved Jobs ────────────────────────────────────────────────────────────
    path('jobs/saved/', SavedJobsView.as_view()),
    path('jobs/<int:job_id>/saved-status/', SavedJobStatusView.as_view()),

    # ── Posts / Feed ──────────────────────────────────────────────────────────
    path('posts/', PostView.as_view()),
    path('posts/<int:pk>/', PostDetailView.as_view()),
    path('posts/<int:pk>/like/', PostLikeView.as_view()),
    path('posts/<int:pk>/comments/', PostCommentView.as_view()),

    # ── AI Recommendations ────────────────────────────────────────────────────
    path('recommendations/jobs/', RecommendedJobsView.as_view()),
    path('recommendations/graduates/<int:job_id>/', RecommendedGraduatesView.as_view()),

    # ── Notifications ─────────────────────────────────────────────────────────
    path('notifications/', NotificationListView.as_view()),
    path('notifications/mark-read/', MarkNotificationsReadView.as_view()),

    # ── Admin ─────────────────────────────────────────────────────────────────
    path('admin/users/', AdminUserListView.as_view()),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view()),

    # ── Search ────────────────────────────────────────────────────────────────
    path('search/', SearchView.as_view()),
]
