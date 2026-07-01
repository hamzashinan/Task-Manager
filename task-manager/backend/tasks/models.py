from django.db import models
from django.conf import settings



class Project(models.Model):
    owner = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="projects"
   )

    name = models.CharField(max_length=100)

    description = models.TextField(blank=True)

    color = models.CharField(
        max_length=20,
        default="#6366F1"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Task(models.Model):
    PRIORITY_CHOICES = (
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    )

    STATUS_CHOICES = (
        ("TODO", "Todo"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="MEDIUM"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="TODO"
    )

    due_date = models.DateField(null=True, blank=True)
    tags = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    project = models.ForeignKey(
        Project,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
    )