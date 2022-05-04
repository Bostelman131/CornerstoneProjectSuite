from django.urls import path

from .views import NetworkStatus

urlpatterns = [
    path("", NetworkStatus, name="network_status"),
]