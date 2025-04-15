"""
URL configuration for erp_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import get_profile, get_attendance, get_exam_schedule

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include([
        path('login/', TokenObtainPairView.as_view(), name='token_obtain'),
        path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    ])),
    path('api/profile/', get_profile, name='profile'),
    path('api/attendance/', get_attendance, name='attendance'),
    path('api/exams/', get_exam_schedule, name='exams'),  # Not api/exams/
]
