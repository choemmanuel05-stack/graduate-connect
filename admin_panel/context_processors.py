from graduates.models import Credential


def admin_context(request):
    """Inject pending credential count into every admin_panel template."""
    if request.path.startswith('/admin-panel/') and request.user.is_authenticated:
        return {
            'pending_credentials': Credential.objects.filter(status='pending').count(),
        }
    return {}
