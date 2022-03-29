from django_filters import rest_framework as filters

from draperweb.budgets.models import Budget


class BudgetFilter(filters.FilterSet):
    """Filter class for Budgets."""

    year = filters.NumberFilter(field_name="end_date", lookup_expr="year")
    date = filters.DateFromToRangeFilter(field_name="end_date")

    class Meta:
        model = Budget
        fields = ["year", "date"]
