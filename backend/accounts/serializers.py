from rest_framework import serializers
from .models import Exam


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'subject', 'exam_type', 'date',
                  'start_time', 'end_time', 'room', 'syllabus']
