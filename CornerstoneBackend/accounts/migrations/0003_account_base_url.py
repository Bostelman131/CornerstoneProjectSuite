# Generated by Django 4.0.3 on 2022-04-05 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_rename_employeeid_account_employee_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='base_url',
            field=models.CharField(default=0, max_length=200),
            preserve_default=False,
        ),
    ]
