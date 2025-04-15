from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_faculty = models.BooleanField(default=False)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    faculty_advisor = models.CharField(max_length=100)
    program = models.CharField(max_length=50)
    branch = models.CharField(max_length=50, blank=True, null=True)
    semester = models.CharField(max_length=20, blank=True, null=True)
    roll_number = models.CharField(
        max_length=20, unique=True, blank=True, null=True)


class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[
                              ('Present', 'Present'), ('Absent', 'Absent')])
    percentage = models.FloatField(
        default=0.0)  # Stores calculated attendance %

    def __str__(self):
        return f"{self.student.username} - {self.subject} ({self.date})"

# accounts/models.py


class Exam(models.Model):
    subject = models.CharField(max_length=100)
    exam_type = models.CharField(max_length=50, choices=[
                                 ('MIDTERM', 'Midterm'), ('FINAL', 'Final')])
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)
    syllabus = models.TextField(blank=True)
