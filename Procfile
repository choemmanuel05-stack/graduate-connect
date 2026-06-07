web: python manage.py migrate && python manage.py cleanup_ghost_accounts && gunicorn graduate_connect.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
