from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """
    Creates the Notification model.
    Uses RunSQL with IF NOT EXISTS so it is safe to re-run if the table
    was already created outside of migrations.
    """

    dependencies = [
        ('api', '0005_follow_required_fields_match_score'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Create table only if it doesn't already exist
        migrations.RunSQL(
            sql="""
                CREATE TABLE IF NOT EXISTS api_notification (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    message    TEXT NOT NULL,
                    notif_type VARCHAR(20) NOT NULL DEFAULT 'system',
                    read       BOOLEAN NOT NULL DEFAULT 0,
                    created_at DATETIME NOT NULL,
                    user_id    INTEGER NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE
                );
            """,
            reverse_sql="DROP TABLE IF EXISTS api_notification;",
        ),
        # Tell Django the model state exists (for future migrations)
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name='Notification',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('message', models.TextField()),
                        ('notif_type', models.CharField(
                            choices=[('application', 'Application Update'), ('system', 'System'), ('job', 'Job Alert')],
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
                    options={'ordering': ['-created_at']},
                ),
            ],
        ),
    ]
