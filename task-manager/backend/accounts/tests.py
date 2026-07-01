from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase


class AuthLoginTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="demouser",
            email="demo@example.com",
            password="StrongPassword123!",
        )

    def test_login_with_username_succeeds(self):
        response = self.client.post(
            reverse("login"),
            {"username": "demouser", "password": "StrongPassword123!"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_email_succeeds(self):
        response = self.client.post(
            reverse("login"),
            {"username": "demo@example.com", "password": "StrongPassword123!"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_register_with_existing_username_returns_validation_error(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "demouser",
                "email": "another@example.com",
                "password": "StrongPassword123!",
                "password2": "StrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("username", response.data)
