from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graduates/', include('graduates.urls')),  # URLs for graduates app
    path('employers/', include('employers.urls')),  # URLs for employers app
]


