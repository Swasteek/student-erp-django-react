from django.contrib import admin
from .models import Profile
from .models import Attendance, Exam

# Register your models here.

# accounts/admin.py
admin.site.register(Exam)
admin.site.register(Attendance)
admin.site.register(Profile)
