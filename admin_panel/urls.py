from django.urls import path
from . import views

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path('login/',  views.admin_login,  name='admin_login'),
    path('logout/', views.admin_logout, name='admin_logout'),

    # ── Dashboard ─────────────────────────────────────────────────────────────
    path('', views.admin_dashboard, name='admin_dashboard'),

    # ── Users ─────────────────────────────────────────────────────────────────
    path('users/',                        views.user_list,       name='user_list'),
    path('users/<int:pk>/deactivate/',    views.user_deactivate, name='user_deactivate'),
    path('users/<int:pk>/reactivate/',    views.user_reactivate, name='user_reactivate'),

    # ── Credentials ───────────────────────────────────────────────────────────
    path('credentials/',                  views.credential_queue,  name='credential_queue'),
    path('credentials/<int:pk>/verify/',  views.credential_verify, name='credential_verify'),
    path('credentials/<int:pk>/reject/',  views.credential_reject, name='credential_reject'),
]
