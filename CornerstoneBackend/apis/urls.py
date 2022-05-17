from django.urls import path

from .views import ProjectApiView, ProjectArchivedApiView, DetailProject, ProjectView, CreateProject
from .views import pinProject, CheckPinnedView, PinnedProjectView, PinnedSalesView, FilteredPinnedProjectView
from .views import DetailAccount,ChangePassword,UploadView
from .views import SalesApiView,DetailSale,PostSalesOpp, SalesView
from .views import login, signup
from .views import linkList, UniqueProjectNumber,getProjectManagers,getSalesmen,UpdateBatch,getAssignedProjects

urlpatterns = [
    
    path("projects/", ProjectApiView.as_view(), name="projects"),
    path("projects/archived/", ProjectArchivedApiView.as_view(), name="archived_projects"),
    path("projects/filter/", DetailProject.as_view(), name="project_detail"),
    path("projects/<pk>/", ProjectView.as_view(), name="project_detail"),
    path("projects/unique/<pk>/", UniqueProjectNumber, name="project_unique"),
    path("createProject/",CreateProject),

    path('signup/', signup),
    path('login/', login),

    path('account/<int:pk>/', DetailAccount.as_view(), name="account_detail"),
    path('changePassword/<pk>', ChangePassword.as_view(), name="change_password"),
    path('projectManagers/', getProjectManagers, name="project_managers"),
    path('salesmen/', getSalesmen, name="salesmen"),
    path('profilePicture/<pk>/', UploadView.as_view(), name="upload_profile_picture"),

    path("sales/", SalesApiView.as_view(), name="sales"),
    path("sales/filter/", DetailSale.as_view(), name="sales_filter"),
    path("sales/post/", PostSalesOpp.as_view(), name="sales_post"),
    path("sales/<pk>/", SalesView.as_view(), name="sales_detail"),

    path('links/', linkList),
    path('update/<pk>/', UpdateBatch),
    path('getAssigned/<pk>/',getAssignedProjects),

    path('pin/<pk>/', pinProject),
    path('checkPinned/<pk>/', CheckPinnedView),
    path('getPinned/<pk>/',PinnedProjectView.as_view()),
    path('getPinnedSales/<pk>/',PinnedSalesView.as_view()),
    path('getFilteredPinned/<pk>/',FilteredPinnedProjectView.as_view()),
]