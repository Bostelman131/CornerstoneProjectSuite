from django.contrib import admin
from django.urls import path, include

# Static files
from . import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("apis.urls")),
    path('', views.index),
    path('networks/', include("networks.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

