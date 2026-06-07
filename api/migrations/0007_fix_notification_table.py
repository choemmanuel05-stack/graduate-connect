"""
Migration 0007 — Fix broken api_notification table
----------------------------------------------------
The api_notification table exists in the production DB but is missing
the user_id column (created by a previous broken migration that used
SQLite AUTOINCREMENT syntax on PostgreSQL).

This migration drops and recreates the table cleanly.
SeparateDatabaseAndState is used because Django's state already knows
about the Notification model from 0006 — we only need the DB fix.
"""
from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_notification'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            # State is already correct from 0006 — nothing to change
            state_operations=[],
            # Drop the broken table and recreate it properly
            database_operations=[
                migrations.RunSQL(
                    sql="DROP TABLE IF EXISTS api_notification CASCADE;",
                    reverse_sql="",
                ),
                migrations.RunSQL(
                    sql="""
                        CREATE TABLE api_notification (
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
                    reverse_sql="DROP TABLE IF EXISTS api_notification CASCADE;",
                ),
            ],
        ),
    ]
