# Generated by Django 4.0.3 on 2022-03-31 07:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("budgets", "0004_budgetitem_order"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="budgetitem",
            options={
                "ordering": ["order", "column__budget__name", "column__name", "name"]
            },
        ),
    ]