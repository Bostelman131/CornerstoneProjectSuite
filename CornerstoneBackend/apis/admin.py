from django.contrib import admin

from .models import SalesOpp, Project, PinnedProject, PinnedSales, AssignedSale

class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "projectNumber", "client_name", "project_name"
    )

class SalesAdmin(admin.ModelAdmin):
    list_display = (
        "salesNumber", "clientName", "projectName"
    )

class PinnedAdmin(admin.ModelAdmin):
    list_display = (
        "id", "owner", "project", "projectPinDate"
    )

class PinnedSalesAdmin(admin.ModelAdmin):
    list_display = (
        "id", "owner", "salesOpp", "projectPinDate"
    )

class AssignedSaleAdmin(admin.ModelAdmin):
    list_display = (
        "id", "owner", "salesRef", "assignedDate"
    )



admin.site.register(Project,ProjectAdmin)
admin.site.register(SalesOpp,SalesAdmin)
admin.site.register(PinnedProject,PinnedAdmin)
admin.site.register(PinnedSales,PinnedSalesAdmin)
admin.site.register(AssignedSale,AssignedSaleAdmin)