#!/usr/bin/env bash
# Render build script — runs at BUILD time (no database available here)
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput
