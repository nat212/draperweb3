from django.contrib import admin
from django.urls import include, path

from . import views
from .views import authenticated

urlpatterns = [
    path("api/budgets/", include("draperweb.budgets.urls")),
    path("api/auth/authenticated/", authenticated),
    path("api/auth/", include("rest_framework.urls")),
    path("api/social/", include("social_django.urls", namespace="api/social")),
    path("admin/", admin.site.urls),
]
