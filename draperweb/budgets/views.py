from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from draperweb.budgets.filters import BudgetFilter
from draperweb.budgets.models import Budget, BudgetColumn, BudgetItem, Category
from draperweb.budgets.serializers import (
    BudgetColumnSerializer,
    BudgetImportSerializer,
    BudgetItemSerializer,
    BudgetSerializer,
    CategorySerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["name", "description", "icon"]


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = BudgetFilter
    search_fields = ["name", "end_date"]

    @action(
        detail=True,
        methods=["POST"],
        url_path="import",
        url_name="import",
    )
    def import_columns(self, request: Request, *args, **kwargs):
        """Import another budget's columns into this budget."""
        budget: Budget = self.get_object()
        serializer = BudgetImportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        budget.import_columns(
            serializer.validated_data["budget"],
            serializer.validated_data["columns"],
            serializer.validated_data["items"],
        )
        return Response(BudgetSerializer(budget).data)


class BudgetColumnViewSet(viewsets.ModelViewSet):
    queryset = BudgetColumn.objects.all()
    serializer_class = BudgetColumnSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["budget"]
    search_fields = ["name", "budget__name"]

    @action(detail=True)
    def summary(self, request: Request, *args, **kwargs):
        budget_column: BudgetColumn = self.get_object()
        expenses = budget_column.get_total_expenses()
        income = budget_column.get_total_income()
        remaining = income - expenses
        return Response(dict(expenses=expenses, income=income, remaining=remaining))

    @action(detail=True)
    def breakdown(self, request: Request, *args, **kwargs):
        budget_column: BudgetColumn = self.get_object()
        return Response(budget_column.get_category_rundown())


class BudgetItemViewSet(viewsets.ModelViewSet):
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["column", "column__budget", "category"]
    search_fields = ["name", "column__name", "column__budget__name", "category__name"]
