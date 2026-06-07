"""
Management command: cleanup_ghost_accounts
------------------------------------------
Deletes all user accounts that were registered but never verified,
and are older than 24 hours (giving users time to verify).

Run: python manage.py cleanup_ghost_accounts

NOTE: Uses --no-fail flag by default — any error is logged but does NOT
crash the deploy. This ensures gunicorn always starts even if cleanup fails.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import sys

User = get_user_model()


class Command(BaseCommand):
    help = 'Delete unverified accounts older than 24 hours'

    def add_arguments(self, parser):
        parser.add_argument(
            '--fail-on-error',
            action='store_true',
            default=False,
            help='Exit with status 1 if an error occurs (default: log and continue)',
        )

    def handle(self, *args, **options):
        try:
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
        except Exception as exc:
            self.stderr.write(
                self.style.WARNING(f'cleanup_ghost_accounts skipped: {exc}')
            )
            if options.get('fail_on_error'):
                sys.exit(1)
            # Otherwise: log and exit cleanly so gunicorn still starts
