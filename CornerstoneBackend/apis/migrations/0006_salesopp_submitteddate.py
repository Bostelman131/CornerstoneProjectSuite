# Generated by Django 4.0.3 on 2022-05-03 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0005_salesopp_submitted'),
    ]

    operations = [
        migrations.AddField(
            model_name='salesopp',
            name='submittedDate',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]