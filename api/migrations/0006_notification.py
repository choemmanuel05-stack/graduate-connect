from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """
    Creates the Notification model.

    Uses SeparateDatabaseAndState so the migration is IDEMPOTENT:
    - The database_operations block runs a raw SQL CREATE TABLE IF NOT EXISTS
      which is a no-op when the table already exists (safe to re-run).
    - The state_operations block tells Django's ORM about the model so
      it can generate future migrations correctly.

    This handles the case where a previous broken migration partially created
    the table, leaving the DB and migration history out of sync.
    """

    dependencies = [
        ('api', '0005_follow_required_fields_match_score'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            # ── What Django's migration STATE should know ──────────────────
            state_operations=[
                migrations.CreateModel(
                    name='Notification',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('message', models.TextField()),
                        ('notif_type', models.CharField(
                            choices=[
                                ('application', 'Application Update'),
                                ('system', 'System'),
                                ('job', 'Job Alert'),
                            ],
                            default='system',
                            max_length=20,
                        )),
                        ('read', models.BooleanField(default=False)),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('user', models.ForeignKey(
                            on_delete=django.db.models.deletion.CASCADE,
                            related_name='notifications',
                            to=settings.AUTH_USER_MODEL,
                        )),
                    ],
                    options={
                        'ordering': ['-created_at'],
                    },
                ),
            ],
            # ── What actually runs against the database ────────────────────
            database_operations=[
                migrations.RunSQL(
                    sql="""
                        CREATE TABLE IF NOT EXISTS api_notification (
                            id          BIGSERIAL PRIMARY KEY,
                            message     TEXT NOT NULL,
                            notif_type  VARCHAR(20) NOT NULL DEFAULT 'system',
                            read        BOOLEAN NOT NULL DEFAULT FALSE,
                            created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            user_id     BIGINT NOT NULL
                                REFERENCES accounts_user(id)
                                ON DELETE CASCADE
                                DEFERRABLE INITIALLY DEFERRED
                        );
                    """,
                    reverse_sql="DROP TABLE IF EXISTS api_notification;",
                ),
            ],
        ),
    ]
