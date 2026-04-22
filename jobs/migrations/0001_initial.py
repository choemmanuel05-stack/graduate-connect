from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('employers', '0001_initial'),
        ('graduates', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('required_degree_type', models.CharField(blank=True, max_length=20)),
                ('minimum_gpa', models.DecimalField(blank=True, decimal_places=2, max_digits=3, null=True)),
                ('required_specialization', models.CharField(blank=True, max_length=200)),
                ('required_skills', models.TextField(blank=True)),
                ('application_deadline', models.DateField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_listings', to='employers.employerprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('applied', 'Applied'), ('shortlisted', 'Shortlisted'), ('interviewed', 'Interviewed'), ('rejected', 'Rejected')], default='applied', max_length=20)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('status_updated_at', models.DateTimeField(auto_now=True)),
                ('match_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('graduate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='graduates.graduateprofile')),
                ('job_listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='jobs.joblisting')),
            ],
            options={
                'unique_together': {('graduate', 'job_listing')},
            },
        ),
    ]
