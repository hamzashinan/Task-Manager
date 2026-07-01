from rest_framework import serializers
from .models import Task
from .models import Project


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
        )

class ProjectSerializer(serializers.ModelSerializer):
    total_tasks = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    pending_tasks = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "color",
            "created_at",
            "total_tasks",
            "completed_tasks",
            "pending_tasks",
        ]

    def get_total_tasks(self, obj):
        return obj.tasks.count()

    def get_completed_tasks(self, obj):
        return obj.tasks.filter(status="COMPLETED").count()

    def get_pending_tasks(self, obj):
        return obj.tasks.exclude(status="COMPLETED").count()