from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from draperweb.budgets.models import Budget, BudgetColumn, BudgetItem, Category
from draperweb.fields import RelatedModelField


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("url", "id", "name", "description", "icon")


class BudgetImportSerializer(serializers.Serializer):
    budget = serializers.HyperlinkedRelatedField(
        queryset=Budget.objects.all(), view_name="budget-detail"
    )
    columns = serializers.ListField(child=serializers.IntegerField())
    items = serializers.DictField(
        child=serializers.ListField(child=serializers.IntegerField())
    )


class BudgetItemSerializer(serializers.HyperlinkedModelSerializer):
    column = serializers.HyperlinkedRelatedField(
        many=False,
        view_name="budgetcolumn-detail",
        read_only=False,
        queryset=BudgetColumn.objects.all(),
    )
    category = RelatedModelField(CategorySerializer, queryset=Category.objects.all())

    class Meta:
        model = BudgetItem
        fields = (
            "id",
            "url",
            "name",
            "category",
            "column",
            "amount",
            "order",
            "created_at",
        )


class BudgetColumnSerializer(serializers.HyperlinkedModelSerializer):
    items = BudgetItemSerializer(many=True, read_only=True)
    budget = serializers.HyperlinkedRelatedField(
        view_name="budget-detail",
        read_only=False,
        queryset=Budget.objects.all(),
    )
    summary = serializers.HyperlinkedIdentityField(
        view_name="budgetcolumn-summary", read_only=True
    )

    breakdown = serializers.HyperlinkedIdentityField(
        view_name="budgetcolumn-breakdown", read_only=True
    )

    class Meta:
        model = BudgetColumn
        fields = (
            "url",
            "id",
            "name",
            "budget",
            "items",
            "summary",
            "breakdown",
            "created_at",
        )


class BudgetSerializer(serializers.HyperlinkedModelSerializer):
    columns = BudgetColumnSerializer(many=True, read_only=True)
    import_columns = serializers.HyperlinkedIdentityField(view_name="budget-import")

    class Meta:
        model = Budget
        fields = (
            "url",
            "id",
            "name",
            "start_date",
            "end_date",
            "columns",
            "import_columns",
            "created_at",
        )
