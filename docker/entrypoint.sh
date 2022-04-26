#!/bin/sh

python3 manage.py migrate

nginx &

gunicorn -w 3 draperweb.wsgi:application --bind=0.0.0.0:8080
