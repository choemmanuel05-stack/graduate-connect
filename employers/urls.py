from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.employer_profile, name='employer_profile'),
    path('dashboard/', views.employer_dashboard, name='employer_dashboard'),
    path('jobs/create/', views.job_create, name='job_create'),
    path('jobs/<int:pk>/update/', views.job_update, name='job_update'),
    path('jobs/<int:pk>/deactivate/', views.job_deactivate, name='job_deactivate'),
    path('candidates/', views.candidate_search, name='candidate_search'),
    path('jobs/<int:pk>/applications/', views.application_management, name='application_management'),
]
