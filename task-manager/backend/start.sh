#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
python manage.py migrate --no-input
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}
