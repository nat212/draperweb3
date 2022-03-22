from django.urls import include, path

urlpatterns = [
    path("budgets/", include("draperweb.budgets.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path('', include('social_django.urls', namespace="social")),
]