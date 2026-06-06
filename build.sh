#!/usr/bin/env bash
# Render build script for Django backend (graduate-connect-api)
# Spec §3.5.5: Gunicorn as the production WSGI server
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running database migrations..."
python manage.py migrate
