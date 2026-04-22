from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.auth_views import RegisterView, LoginView, MeView
from api.graduate_views import GraduateProfileView, GraduateListView, GraduateDetailView
from api.employer_views import EmployerProfileView, EmployerListView
from api.job_views import JobListCreateView, JobDetailView, JobApplicationView, MyApplicationsView
from api.search_views import SearchView

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),

    # Graduates
    path('graduates/', GraduateListView.as_view(), name='graduate-list'),
    path('graduates/profile/', GraduateProfileView.as_view(), name='graduate-profile'),
    path('graduates/<int:pk>/', GraduateDetailView.as_view(), name='graduate-detail'),

    # Employers
    path('employers/', EmployerListView.as_view(), name='employer-list'),
    path('employers/profile/', EmployerProfileView.as_view(), name='employer-profile'),

    # Jobs
    path('jobs/', JobListCreateView.as_view(), name='job-list'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/<int:pk>/apply/', JobApplicationView.as_view(), name='job-apply'),
    path('jobs/my-applications/', MyApplicationsView.as_view(), name='my-applications'),

    # Search
    path('search/', SearchView.as_view(), name='search'),
]
