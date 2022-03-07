from rest_framework import serializers

from draperweb.budgets.models import Budget, BudgetColumn, BudgetItem, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "description", "icon")


class BudgetSerializer(serializers.HyperlinkedModelSerializer):
    columns = serializers.HyperlinkedRelatedField(
        many=True, view_name="budgetcolumn-detail", read_only=True
    )
    import_columns = serializers.HyperlinkedIdentityField(view_name="budget-import")

    class Meta:
        model = Budget
        fields = ("url", "name", "start_date", "end_date", "columns", "import_columns")


class BudgetImportSerializer(serializers.BaseSerializer):
    budget = serializers.RelatedField(queryset=Budget.objects.all())
    columns = serializers.ListField(child=serializers.IntegerField())
    items = serializers.DictField(
        child=serializers.ListField(child=serializers.IntegerField())
    )


class BudgetColumnSerializer(serializers.HyperlinkedModelSerializer):
    items = serializers.HyperlinkedRelatedField(
        many=True, view_name="budgetitem-detail", read_only=True
    )
    budget = serializers.HyperlinkedRelatedField(
        view_name="budget-detail",
        read_only=False,
        queryset=Budget.objects.all(),
    )
    summary = serializers.HyperlinkedIdentityField(
        view_name="budgetcolumn-summary", read_only=True
    )

    class Meta:
        model = BudgetColumn
        fields = ("url", "name", "budget", "items", "summary")


class BudgetItemSerializer(serializers.HyperlinkedModelSerializer):
    column = serializers.HyperlinkedRelatedField(
        many=False,
        view_name="budgetcolumn-detail",
        read_only=False,
        queryset=BudgetColumn.objects.all(),
    )

    class Meta:
        model = BudgetItem
        fields = ("url", "name", "category", "column", "amount")
