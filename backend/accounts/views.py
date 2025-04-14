from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Attendance  # Add this line with other imports


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        profile = request.user.profile
        return Response({
            'name': request.user.username,
            'advisor': profile.faculty_advisor,
            'program': profile.program,
            'branch': profile.branch,
            'semester': profile.semester,
            'roll_number': profile.roll_number,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance(request):

    semester = request.query_params.get('semester', None)

    queryset = Attendance.objects.filter(student=request.user)
    if semester:
        queryset = queryset.filter(subject__semester=semester)

    attendance = Attendance.objects.filter(student=request.user)
    subjects = attendance.values('subject').distinct()

    # Calculate attendance percentage per subject
    data = []
    for subj in subjects:
        subj_name = subj['subject']
        total_classes = attendance.filter(subject=subj_name).count()
        present_classes = attendance.filter(
            subject=subj_name, status='Present').count()
        percentage = (present_classes / total_classes *
                      100) if total_classes > 0 else 0

        data.append({
            'subject': subj_name,
            'present': present_classes,
            'total': total_classes,
            'percentage': round(percentage, 2)
        })

    return Response(data)
