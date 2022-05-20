#!/bin/sh

python3 manage.py migrate
python3 manage.py collectstatic --noinput

nginx &

gunicorn -w 3 draperweb.wsgi:application --bind=0.0.0.0:8080
