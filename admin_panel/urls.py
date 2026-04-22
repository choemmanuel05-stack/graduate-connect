from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),
    path('users/', views.user_search, name='user_search'),
    path('users/<int:pk>/deactivate/', views.user_deactivate, name='user_deactivate'),
    path('users/<int:pk>/reactivate/', views.user_reactivate, name='user_reactivate'),
    path('credentials/', views.credential_queue, name='credential_queue'),
    path('credentials/<int:pk>/verify/', views.credential_verify, name='credential_verify'),
    path('credentials/<int:pk>/reject/', views.credential_reject, name='credential_reject'),
]
