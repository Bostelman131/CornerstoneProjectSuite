from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import AccountCreationForm, AccountChangeForm

Account = get_user_model()

class AccountAdmin(UserAdmin):
    add_form = AccountCreationForm
    form = AccountChangeForm
    model = Account
    list_display = ('employee_id', 'email', 'first_name', 'last_name', 'job_title')
    fieldsets = (
        ('Account Settings', {'fields': ('employee_id', 'email', 'password', 'first_name', 'last_name', 'job_title', 'department', 'user_phone', 'profile_picture', 'base_url')}),
        ('Account Permissions', {'fields': ('is_staff', 'is_active', 'is_admin', 'is_superuser')}),
    )
    search_fields = ('email', 'username',)
    ordering = ('email',)


admin.site.register(Account, AccountAdmin)