from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)

        def perform_create(self, serializer):
            serializer.save(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)