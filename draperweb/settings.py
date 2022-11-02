"""
Django settings for draperweb project.

Generated by 'django-admin startproject' using Django 4.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import os
from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# noinspection SpellCheckingInspection
SECRET_KEY = os.getenv(
    "DRAPERWEB_SECRET",
    "django-insecure-45xoqd4_sg)t8k-mthd1)et(fwag#_h2djih4vy1x*&8okt=$c",
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DRAPERWEB_MODE", "development") != "production"

ALLOWED_HOSTS = ["*"]

STATIC_URL = "/static/"

if not DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        "https://web.draper.net.za",
        "https://v3.draper.net.za",
        "https://www.draper.net.za",
    ]

    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = ("X-Forwarded-Proto", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_PRELOAD = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_filters",
    "rest_framework",
    "draperweb.budgets",
    "social_django",
    "rest_social_auth",
    "rest_framework_simplejwt",
    "rest_framework_filters",
    "crispy_forms",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "draperweb.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "draperweb.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# noinspection SpellCheckingInspection
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DRAPERWEB_DB_NAME", "draperweb"),
        "USER": os.getenv("DRAPERWEB_DB_USER", "postgres"),
        "PASSWORD": os.getenv("DRAPERWEB_DB_PASSWORD", "masterkey"),
        "HOST": os.getenv("DRAPERWEB_DB_HOST", "localhost"),
        "PORT": os.getenv("DRAPERWEB_DB_PORT", "5432"),
    },
}

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

SOCIAL_AUTH_JSONFIELD_ENABLED = True

AUTHENTICATION_BACKENDS = ("draperweb.nextcloud_auth.NextcloudOAuth2",)

SOCIAL_AUTH_NAMESPACE = "api"

SOCIAL_AUTH_NEXTCLOUD_KEY = os.getenv("SOCIAL_AUTH_NEXTCLOUD_KEY")
SOCIAL_AUTH_NEXTCLOUD_SECRET = os.getenv("SOCIAL_AUTH_NEXTCLOUD_SECRET")

DRAPERWEB_BASE_URL = os.getenv("DRAPERWEB_BASE_URL", "https://box.draper.net.za/cloud")

ACCESS_TOKEN_LIFETIME = timedelta(days=1)
REFRESH_TOKEN_LIFETIME = timedelta(days=30)
