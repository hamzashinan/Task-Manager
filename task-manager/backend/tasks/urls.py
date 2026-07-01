from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet

router = DefaultRouter()
router.register(r"tasks",TaskViewSet,basename="tasks")
router.register(r"projects", ProjectViewSet, basename="projects")

urlpatterns = [
    path("", include(router.urls)),
]