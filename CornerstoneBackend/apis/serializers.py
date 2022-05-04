from rest_framework import serializers
from PIL import Image

from .models import SalesOpp, Project

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
        fields = ("projectNumber", "clientName", "projectName", "archived", "projectCreationDate", "first_name", "last_name", "jobTitle", "profile_picture", "file_path", "sales_number", "sage_number", "owner_id")

