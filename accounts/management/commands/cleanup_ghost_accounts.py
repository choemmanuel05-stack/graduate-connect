"""
Management command: cleanup_ghost_accounts
------------------------------------------
Deletes all user accounts that were registered but never verified,
and are older than 24 hours (giving users time to verify).

Run: python manage.py cleanup_ghost_accounts
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Delete unverified accounts older than 24 hours'

    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(hours=24)
        qs = User.objects.filter(
            is_email_verified=False,
            is_superuser=False,
            is_staff=False,
            date_joined__lt=cutoff,
        )
        count = qs.count()
        qs.delete()
        self.stdout.write(
            self.style.SUCCESS(f'Deleted {count} unverified ghost account(s).')
        )
