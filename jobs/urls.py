from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list, name='job_list'),
    path('<int:pk>/', views.job_detail, name='job_detail'),
    path('<int:pk>/apply/', views.apply_view, name='apply'),
    path('<int:pk>/candidates/', views.candidate_list, name='candidate_list'),
]
