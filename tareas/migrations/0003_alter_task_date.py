# Generated by Django 5.1.7 on 2025-03-23 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tareas', '0002_alter_task_options_task_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
