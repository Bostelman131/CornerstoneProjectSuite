# Generated by Django 4.0.3 on 2022-04-22 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0002_salesopp_archived'),
    ]

    operations = [
        migrations.AddField(
            model_name='salesopp',
            name='projectZip',
            field=models.CharField(default='27601', max_length=6),
        ),
    ]
