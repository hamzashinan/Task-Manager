from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get("email")

        if not username or not password:
            return None

        UserModel = get_user_model()
        lookup = {"email__iexact": username} if "@" in username else {"username__iexact": username}

        try:
            user = UserModel._default_manager.get(**lookup)
        except UserModel.DoesNotExist:
            return None
        except UserModel.MultipleObjectsReturned:
            user = UserModel._default_manager.filter(**lookup).order_by("id").first()

        if user and self.user_can_authenticate(user) and user.check_password(password):
            return user

        return None
