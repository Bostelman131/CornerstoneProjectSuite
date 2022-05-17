from rest_framework import serializers
from PIL import Image

from .models import PinnedSales, SalesOpp, Project, PinnedProject

class SalesSerializer(serializers.ModelSerializer):
    archived = False
    projectNumber = serializers.CharField(source = 'salesNumber')
    projectCreationDate = serializers.DateTimeField(source = 'creationDate')
    first_name = serializers.CharField(source = 'owner.first_name')
    last_name = serializers.CharField(source = 'owner.last_name')
    jobTitle = serializers.CharField(source = 'owner.job_title')
    profile_picture = serializers.ImageField(source = 'owner.profile_picture')
    file_path = serializers.CharField(source = 'salesFilePath')
    owner_id = serializers.IntegerField(source = 'owner.id')

    class Meta:
        model = SalesOpp
        fields = ("projectNumber", "clientName", "projectName", "projectNarrative", "archived", "submitted", "submittedDate", "projectCreationDate", "first_name", "last_name", "jobTitle", "profile_picture", "file_path", "projectStreet", "projectCity", "projectState", "projectZip", "contactFirstName", "contactLastName", "contactTitle", "contactPhoneNumber", "contactEmail","owner_id")

class SalesPostSerializer(serializers.ModelSerializer):
    archived = False

    class Meta:
        model = SalesOpp
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    clientName = serializers.CharField(source = 'salesLink.clientName')
    projectName = serializers.CharField(source = 'salesLink.projectName')
    first_name = serializers.CharField(source = 'owner.first_name')
    last_name = serializers.CharField(source = 'owner.last_name')
    jobTitle = serializers.CharField(source = 'owner.job_title')
    profile_picture = serializers.ImageField(source = 'owner.profile_picture')
    file_path = serializers.CharField(source = 'projectFilePath')
    sales_number = serializers.CharField(source = 'salesLink.salesNumber')
    sage_number = serializers.CharField(source = 'customerID')
    owner_id = serializers.IntegerField(source = 'owner.id')

    class Meta:
        model = Project
        fields = ("projectNumber", "clientName", "projectName", "archived", "watchList", "projectCreationDate", "first_name", "last_name", "jobTitle", "profile_picture", "file_path", "sales_number", "sage_number", "owner_id")

class PinnedProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = PinnedProject
        fields = '__all__'

class PinnedSalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PinnedSales
        fields = '__all__'

class ProjectsPinnedSerializer(serializers.ModelSerializer):
    try:
        projectNumber = serializers.CharField(source = 'project.projectNumber')
        clientName = serializers.CharField(source = 'project.salesLink.clientName')
        projectName = serializers.CharField(source = 'project.salesLink.projectName')
        archived = serializers.CharField(source = 'project.archived')
        watchList = serializers.CharField(source = 'project.watchList')
        projectCreationDate = serializers.DateTimeField(source = 'project.projectCreationDate')
        first_name = serializers.CharField(source = 'project.owner.first_name')
        last_name = serializers.CharField(source = 'project.owner.last_name')
        jobTitle = serializers.CharField(source = 'project.owner.job_title')
        profile_picture = serializers.ImageField(source = 'project.owner.profile_picture')
        file_path = serializers.CharField(source = 'project.projectFilePath')
        sales_number = serializers.CharField(source = 'project.salesLink.salesNumber')
        sage_number = serializers.CharField(source = 'project.customerID')
        owner_id = serializers.IntegerField(source = 'project.owner.id')

    except:
        pass


    class Meta:
        model = Project
        fields = ("projectNumber", "clientName", "projectName", "archived", "watchList", "projectCreationDate", "first_name", "last_name", "jobTitle", "profile_picture", "file_path", "sales_number", "sage_number", "owner_id")

class SalesPinnedSerializer(serializers.ModelSerializer):
    projectNumber = serializers.CharField(source = 'salesOpp.salesNumber')
    clientName = serializers.CharField(source = 'salesOpp.clientName')
    projectName = serializers.CharField(source = 'salesOpp.projectName')
    projectNarrative = serializers.CharField(source = 'salesOpp.projectNarrative')
    archived = False
    submitted = serializers.BooleanField(source = 'salesOpp.submitted')
    submittedDate = serializers.DateTimeField(source = 'salesOpp.submittedDate')
    projectCreationDate = serializers.DateTimeField(source = 'salesOpp.creationDate')
    first_name = serializers.CharField(source = 'salesOpp.owner.first_name')
    last_name = serializers.CharField(source = 'salesOpp.owner.last_name')
    jobTitle = serializers.CharField(source = 'salesOpp.owner.job_title')
    profile_picture = serializers.ImageField(source = 'salesOpp.owner.profile_picture')
    file_path = serializers.CharField(source = 'salesOpp.salesFilePath')
    projectStreet = serializers.CharField(source = 'salesOpp.projectStreet')
    projectCity = serializers.CharField(source = 'salesOpp.projectCity')
    projectState = serializers.CharField(source = 'salesOpp.projectState')
    projectZip = serializers.CharField(source = 'salesOpp.projectZip')
    contactFirstName = serializers.CharField(source = 'salesOpp.contactFirstName')
    contactLastName = serializers.CharField(source = 'salesOpp.contactLastName')
    contactTitle = serializers.CharField(source = 'salesOpp.contactTitle')
    contactPhoneNumber = serializers.CharField(source = 'salesOpp.contactPhoneNumber')
    contactEmail = serializers.CharField(source = 'salesOpp.contactEmail')
    owner_id = serializers.IntegerField(source = 'salesOpp.owner.id')

    class Meta:
        model = SalesOpp
        fields = ("projectNumber", "clientName", "projectName", "projectNarrative", "archived", "submitted", "submittedDate", "projectCreationDate", "first_name", 
        "last_name", "jobTitle", "profile_picture", "file_path", "projectStreet", "projectCity", "projectState", "projectZip", "contactFirstName", "contactLastName", 
        "contactTitle", "contactPhoneNumber", "contactEmail","owner_id")