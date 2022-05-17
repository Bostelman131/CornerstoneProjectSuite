from django.db import models
from django.conf import settings


class SalesOpp(models.Model):
    salesNumber = models.CharField(max_length=8, primary_key=True)
    clientName = models.CharField(max_length=25)
    projectName = models.CharField(max_length=25)
    contactFirstName = models.CharField(max_length=15)
    contactLastName = models.CharField(max_length=15)
    contactTitle = models.CharField(max_length=25)
    contactPhoneNumber = models.CharField(max_length=10)
    contactEmail = models.CharField(max_length=40)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT)
    projectNarrative = models.TextField()
    projectStreet = models.CharField(max_length=25)
    projectCity = models.CharField(max_length=25)
    projectState = models.CharField(max_length=2)
    projectZip = models.CharField(max_length=6)
    archived = models.BooleanField(default=False)
    submitted = models.BooleanField(default=False)
    submittedDate = models.DateTimeField(blank=True, null=True)
    creationDate = models.DateTimeField(auto_now_add=True)
    projectCreator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sales_opp_creator", on_delete=models.PROTECT)
    salesFilePath = models.CharField(max_length=200)

    def __str__ (self):
        return self.salesNumber + '_' + self.clientName + '_' + self.projectName


class Project(models.Model):
    projectNumber = models.CharField(max_length=8, primary_key=True)
    salesLink = models.ForeignKey(SalesOpp,on_delete=models.PROTECT)
    archived = models.BooleanField(default=False)
    watchList = models.BooleanField(default=False)
    customerID = models.CharField(max_length=8)
    projectFilePath = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT)
    projectType = models.CharField(max_length=25)
    projectCreationDate = models.DateTimeField(auto_now_add=True)
    projectCreator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="project_creator", on_delete=models.PROTECT)
    projectedCompletionDate = models.DateField()

    def __str__ (self):
        return self.projectNumber + '_' + self.salesLink.clientName + '_' + self.salesLink.projectName

    @property
    def client_name(self):
        return self.salesLink.clientName

    @property
    def project_name(self):
        return self.salesLink.projectName

    @property
    def project_narrative(self):
        return self.salesLink.projectNarrative

    @property
    def project_street(self):
        return self.salesLink.projectNarrative

    @property
    def project_city(self):
        return self.salesLink.projectNarrative

    @property
    def project_state(self):
        return self.salesLink.projectNarrative

    @property
    def salesman(self):
        return self.salesLink.projectCreator    

    @property
    def sales_filepath(self):
        return self.salesLink.salesFilePath


class PinnedProject(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT)
    project = models.ForeignKey('Project', on_delete=models.PROTECT)
    projectPinDate = models.DateTimeField(auto_now_add=True)

class PinnedSales(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT)
    salesOpp = models.ForeignKey('SalesOpp', on_delete=models.PROTECT)
    projectPinDate = models.DateTimeField(auto_now_add=True)