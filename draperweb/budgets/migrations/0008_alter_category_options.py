# Generated by Django 4.0.3 on 2022-04-02 10:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("budgets", "0007_alter_category_description"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="category",
            options={"ordering": ["name"]},
        ),
    ]
