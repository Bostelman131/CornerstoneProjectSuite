# Generated by Django 4.0.3 on 2022-04-05 14:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='account',
            old_name='employeeID',
            new_name='employee_id',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='firstName',
            new_name='first_name',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='jobTitle',
            new_name='job_title',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='lastName',
            new_name='last_name',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='profilePicture',
            new_name='profile_picture',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='userPhone',
            new_name='user_phone',
        ),
    ]