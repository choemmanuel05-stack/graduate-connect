from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import PermissionDenied


def role_required(role):
    def check_role(user):
        if user.is_authenticated:
            if user.role == role:
                return True
            raise PermissionDenied
        return False
    return user_passes_test(check_role, login_url='/accounts/login/')
