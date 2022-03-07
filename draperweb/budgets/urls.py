from django.urls import include, path
from rest_framework.routers import DefaultRouter

from draperweb.budgets import views

router = DefaultRouter()

router.register(r"budgets", views.BudgetViewSet)
router.register(r"categories", views.CategoryViewSet)
router.register(r"columns", views.BudgetColumnViewSet)
router.register(r"items", views.BudgetItemViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
