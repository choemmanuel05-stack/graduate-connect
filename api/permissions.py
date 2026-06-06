"""
api/permissions.py
------------------
Role-Based Access Control permission classes.
Referenced in Appendix B.2 of the specification.

Usage:
    from api.permissions import IsGraduate, IsEmployer, IsAdmin

    class MyView(APIView):
        permission_classes = [IsAuthenticated, IsGraduate]
"""
from rest_framework.permissions import BasePermission


class IsGraduate(BasePermission):
    """Allows access only to authenticated users with role == 'graduate'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', '') == 'graduate'
        )


class IsEmployer(BasePermission):
    """Allows access only to authenticated users with role == 'employer'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', '') == 'employer'
        )


class IsAdmin(BasePermission):
    """Allows access only to authenticated users with role == 'administrator'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                getattr(request.user, 'role', '') == 'administrator'
                or request.user.is_staff
            )
        )


class IsGraduateOrReadOnly(BasePermission):
    """Write access restricted to graduates; read access to all authenticated users."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return getattr(request.user, 'role', '') == 'graduate'


class IsEmployerOrReadOnly(BasePermission):
    """Write access restricted to employers; read access to all authenticated users."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return getattr(request.user, 'role', '') == 'employer'
