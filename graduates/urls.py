from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile_create_update, name='profile_create_update'),
    path('profile/<int:pk>/', views.profile_detail, name='profile_detail'),
    path('credentials/upload/', views.credential_upload, name='credential_upload'),
    path('applications/', views.application_dashboard, name='application_dashboard'),
]
