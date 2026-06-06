from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """
    Creates the Notification model using standard Django CreateModel
    so it works on both SQLite (local) and PostgreSQL (production).
    """

    dependencies = [
        ('api', '0005_follow_required_fields_match_score'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
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
    ]
