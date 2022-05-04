from django.contrib import admin

from .models import SalesOpp, Project

class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "projectNumber", "client_name", "project_name"
    )

class SalesAdmin(admin.ModelAdmin):
    list_display = (
        "salesNumber", "clientName", "projectName"
    )

admin.site.register(Project,ProjectAdmin)
admin.site.register(SalesOpp,SalesAdmin)