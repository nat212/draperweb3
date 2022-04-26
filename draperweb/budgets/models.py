from __future__ import annotations

from typing import Dict, List

from django.db import models


class Category(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True)
    icon = models.TextField()

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ["name"]


class Budget(models.Model):
    name = models.TextField()
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def import_columns(
        self, budget: Budget, columns: List[int], items: Dict[int, List[int]]
    ) -> Budget:
        for c in budget.columns.filter(pk__in=columns):
            column = self.columns.create(**dict(c))
            for i in c.items.filter(pk__in=items[c.id]):
                column.items.create(**dict(i))
        return self

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ["-end_date", "created_at"]


class BudgetColumn(models.Model):
    name = models.TextField()
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="columns")
    created_at = models.DateTimeField(auto_now_add=True)

    def get_total_expenses(self) -> float:
        """Get the total expenses of all items in this column."""
        items = self.items.filter(amount__lt=0)
        return sum([abs(item.amount) for item in items]) or 0

    def get_total_income(self) -> float:
        """Get the total income of all items in this column."""
        items = self.items.filter(amount__gt=0)
        return sum([abs(item.amount) for item in items]) or 0

    def get_category_rundown(self) -> Dict[str, float]:
        """Get a breakdown of expenses grouped by category."""
        items = self.items.filter(amount__lt=0)
        categories = {item.category for item in items if item.category}
        resp = {}
        total_amount = sum(abs(item.amount) for item in items)
        for category in categories:
            resp[category.name] = (
                sum(abs(item.amount) for item in items if item.category == category)
                / total_amount
            )
        return resp

    def __str__(self) -> str:
        return f"{self.name} ({self.budget.name})"

    class Meta:
        ordering = ["budget__name", "name"]


class BudgetItem(models.Model):
    name = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    column = models.ForeignKey(
        BudgetColumn, on_delete=models.CASCADE, related_name="items"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField(default=0.0, blank=False, null=False)
    order = models.PositiveIntegerField(default=0, blank=True, null=False)

    def save(self, *args, **kwargs):
        # Set order on first create
        if not self.pk:
            items = self.__class__.objects.filter(column=self.column).all()
            if len(items) == 0:
                self.order = 0
                return super().save(*args, **kwargs)
            orders = [item.order for item in items]
            max_order = max(orders)
            self.order = max_order + 1
            return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.name} ({self.column.name}, {self.column.budget.name})"

    class Meta:
        ordering = ["order", "column__budget__name", "column__name", "name"]
