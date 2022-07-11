from email import message
from pyexpat import model
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from rest_framework.parsers import JSONParser
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from datetime import date
from django.conf import settings
from django.core.mail import send_mail
from django.core import serializers

from .models import PinnedSales, Project,SalesOpp, PinnedProject, PinnedSales, AssignedSale
from accounts.models import Account
from .serializers import ProjectSerializer, SalesSerializer, SalesPostSerializer, PinnedProjectSerializer, ProjectsPinnedSerializer, PinnedSalesSerializer, SalesPinnedSerializer, AssignedSalesSerializer
from accounts.serializers import AccountSerializer, ChangePasswordSerializer, ChangeProfilePictureSerializer

from apis.csd import create
from apis.relocate import move_directory
from apis.links import get_link_list

server_root = "\\\\172.18.50.2\\sedata\\"


class ProjectApiView(generics.ListCreateAPIView):
    queryset = Project.objects.filter(archived = False)
    serializer_class = ProjectSerializer

class ProjectArchivedApiView(generics.ListCreateAPIView):
    queryset = Project.objects.filter(archived = True)
    serializer_class = ProjectSerializer

class ProjectView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class DetailProject(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer


    def get_queryset(self):      
        projects = Project.objects.all()

        try:
            user_id = self.request.query_params.get('id')
            if(user_id != None ):
                projects = projects.filter(owner__id=user_id)
        except:
            pass

        try:
            projectNumber = self.request.query_params.get('projectNumber')
            if(projectNumber != None ):
                char = projectNumber[0].lower()
                if(char != "p"  and char != 's' and char != 'm' and char != 'w'):
                    projectNumber = 'P' + projectNumber
                projects = projects.filter(projectNumber__istartswith=projectNumber)
        except:
            pass

        try:
            clientName = self.request.query_params.get('clientName')
            if(clientName != None ):
                projects = projects.filter(salesLink__clientName__icontains=clientName)
        except:
            pass

        try:
            customerID = self.request.query_params.get('customerID')
            if(customerID != None ):
                projects = projects.filter(customerID__startswith=customerID)
        except:
            pass

        try:
            projectCreationDate = self.request.query_params.get('projectCreationDate')
            if(projectCreationDate != None ):
                projects = projects.filter(projectCreationDate__startswith=projectCreationDate)
        except:
            pass


        try:
            owner = self.request.query_params.get('owner')
            if(owner != None ):
                projects = projects.filter(owner__first_name__istartswith=owner)
        except:
            pass

        try:
            projectState = self.request.query_params.get('projectState')
            if(projectState != None ):
                projects = projects.filter(salesLink__projectState__istartswith=projectState)
        except:
            pass

        try:
            projectType = self.request.query_params.get('projectType')
            if(projectType != None ):
                projects = projects.filter(projectType__istartswith=projectType)
        except:
            pass

        try:
            archived = self.request.query_params.get('archived')
            if(archived != None ):
                projects = projects.filter(archived=True)
            else:
                projects = projects.filter(archived=False)
        except:
            pass

        try:
            salesStatus = self.request.query_params.get('salesStatus')
            if(salesStatus != None ):
                projects = None
        except:
            pass

        try:
            watchList = self.request.query_params.get('watchList')
            if(watchList != None ):
                projects = projects.filter(watchList=True)
        except:
            pass

        return projects

class SalesApiView(generics.ListAPIView):
    # permission_classes = [permissions.IsAuthenticated]

    queryset = SalesOpp.objects.all()
    serializer_class = SalesSerializer

class SalesView(generics.RetrieveUpdateAPIView):
    queryset = SalesOpp.objects.all()
    serializer_class = SalesSerializer

class DetailSale(generics.ListCreateAPIView):
    serializer_class = SalesSerializer


    def get_queryset(self):      
        projects = SalesOpp.objects.all()

        try:
            user_id = self.request.query_params.get('id')
            if(user_id != None ):
                projects = projects.filter(owner__id=user_id)
        except:
            pass

        try:
            projectNumber = self.request.query_params.get('projectNumber')
            if(projectNumber != None ):
                projects = projects.filter(salesNumber__istartswith=projectNumber)
        except:
            pass

        try:
            clientName = self.request.query_params.get('clientName')
            if(clientName != None ):
                projects = projects.filter(clientName__icontains=clientName)
        except:
            pass

        try:
            customerID = self.request.query_params.get('customerID')
            if(customerID != None ):
                projects = None
        except:
            pass

        try:
            projectCreationDate = self.request.query_params.get('projectCreationDate')
            if(projectCreationDate != None ):
                projects = projects.filter(creationDate__startswith=projectCreationDate)
        except:
            pass


        try:
            owner = self.request.query_params.get('owner')
            if(owner != None ):
                projects = projects.filter(owner__first_name__istartswith=owner)
        except:
            pass

        try:
            projectState = self.request.query_params.get('projectState')
            if(projectState != None ):
                projects = projects.filter(projectState__istartswith=projectState)
        except:
            pass

        try:
            projectType = self.request.query_params.get('projectType')
            if(projectType != None ):
                projects = None
        except:
            pass

        try:
            salesStatus = self.request.query_params.get('salesStatus')
            if(salesStatus == "Sent" ):
                projects = projects.filter(submitted=True)
            if(salesStatus == "Not Sent" ):
                projects = projects.filter(submitted=False)
        except:
            pass

        return projects

class PostSalesOpp(generics.CreateAPIView):
    serializer_class = SalesPostSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def post(self, request, *args, **kwargs):
        
        sales = SalesOpp.objects.all()

        salesNumberArray = []
        current_year = str(date.today().year)
        year_section = current_year[2:]
        for sale in sales:
            if(sale.salesNumber[1:3] == year_section):
                salesNumberArray.append(sale.salesNumber[3:6])
        
        if len(salesNumberArray) < 1:
            new_number = str(1).zfill(3)
        else:
            salesNumberArray.sort(reverse=True)
            new_number = str(int(salesNumberArray[0])+1).zfill(3)
            
        branch_id = "61"
        prefix = "S"
        sales_number = prefix+year_section+new_number+branch_id

        res_names = {
            "projectNumber" : sales_number,
            "clientName" : request.data['clientName'],
            "projectName" : request.data['projectName']
        }

        sales_filepath = "Sales_Estimating\\"+res_names["projectNumber"]+"_"+res_names["clientName"]+"_"+res_names["projectName"]

        new_filepath = server_root+sales_filepath

        sale_template_filepath = "RESOURCES\\Templates\\Sales\\$projectNumber$_$clientName$_$projectName$"
        temp_filepath = server_root+sale_template_filepath

        request.data['salesNumber'] = sales_number
        request.data['owner'] = request.data['userId']
        request.data['projectCreator'] = request.data['userId']
        request.data['salesFilePath'] = sales_filepath

        create(res_names, temp_filepath, new_filepath)

        return self.create(request, *args, **kwargs)

class DetailAccount(generics.RetrieveUpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

class ChangePassword(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = Account

    def update(self, request, *args, **kwargs):
        self.object = Account.objects.get(id = self.kwargs['pk'])
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.object.set_password(serializer.data.get("password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }
            
            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadView(generics.UpdateAPIView):
    serializer_class = ChangeProfilePictureSerializer
    model = Account

    def update(self, request, *args, **kwargs):
        self.object = Account.objects.get(id = self.kwargs['pk'])
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            file = request.data['file']
            self.object.profile_picture = file
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }
            
            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PinnedProjectView(generics.ListCreateAPIView):
    serializer_class = ProjectsPinnedSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PinnedProject.objects.filter(owner = self.kwargs.get('pk'))

class PinnedSalesView(generics.ListCreateAPIView):
    serializer_class = SalesPinnedSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PinnedSales.objects.filter(owner = self.kwargs.get('pk'))

class FilteredPinnedProjectView(generics.ListCreateAPIView):
    serializer_class = PinnedProjectSerializer

    def get_queryset(self):
        pinned_projects = PinnedProject.objects.filter(owner = self.kwargs.get('pk'))

        try:
            projectNumber = self.request.query_params.get('projectNumber')
            if(projectNumber != None ):
                pinned_projects = pinned_projects.project.filter(salesNumber__istartswith=projectNumber)
        except:
            pass

        try:
            clientName = self.request.query_params.get('clientName')
            if(clientName != None ):
                pinned_projects = pinned_projects.project.filter(clientName__icontains=clientName)
        except:
            pass

        try:
            customerID = self.request.query_params.get('customerID')
            if(customerID != None ):
                pinned_projects = pinned_projects.project.filter(customerID__startswith=customerID)
        except:
            pass

        try:
            projectCreationDate = self.request.query_params.get('projectCreationDate')
            if(projectCreationDate != None ):
                pinned_projects = pinned_projects.project.filter(creationDate__startswith=projectCreationDate)
        except:
            pass


        try:
            owner = self.request.query_params.get('owner')
            if(owner != None ):
                projects = projects.filter(owner__first_name__istartswith=owner)
        except:
            pass

        try:
            projectState = self.request.query_params.get('projectState')
            if(projectState != None ):
                projects = projects.filter(projectState__istartswith=projectState)
        except:
            pass

        try:
            projectType = self.request.query_params.get('projectType')
            if(projectType != None ):
                projects = None
        except:
            pass

        try:
            salesStatus = self.request.query_params.get('salesStatus')
            if(salesStatus == "Sent" ):
                projects = projects.filter(submitted=True)
            if(salesStatus == "Not Sent" ):
                projects = projects.filter(submitted=False)
        except:
            pass

        return projects
    

# ALLOWS A USER TO BE CREATED
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)

            # PREP WORK FOR AUTOGENERATED EMPLOYEE ID
            current_year = str(date.today().year)
            shortended_year = current_year[2:]
            number = Account.objects.all().count()+1

            employee_id = "E"+str(shortended_year)+"_"+str(number)

            # PREP WORK FOR AUTOGENERATED USERNAME
            username = data['email'].split('@')
            
            user = get_user_model().objects.create_user(
                email = data['email'],
                username = username[0],
                password = data['password'],
                employee_id = employee_id,
                first_name = data['first_name'],
                last_name = data['last_name'],
                job_title = data['job_title'],
                department = data['department'],
                user_phone = data['user_phone'],
                is_admin = data['is_admin'],
            )

            user.save()

            token = Token.objects.create(user = user)
            return JsonResponse({'token':str(token)}, status=201)
        except IntegrityError:
            return JsonResponse({ 'error' : 'An error occurred while saving the user'}, status=400)



# ALLOWS A USER TO LOGIN
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user = authenticate(
            request,
            email = data['email'],
            password = data['password']
        )
        if user is None:
            return JsonResponse(
                {'error': 'Unable to login. Please check the username and password and try again.'},
                status=400)
        else:
            try:
                token = Token.objects.get(user=user)
                return JsonResponse({ 'token'  : str(token), 
                    'id' : str(user.id),
                    }, status = 200)
            except:
                return JsonResponse(
                    {'error': 'Unable to get authentication token.  Please contact an administrator.'},
                    status=500)

@csrf_exempt
def getProjectManagers(request):
    try:
        tempManagerList = []

        project_managers = Account.objects.filter(job_title='Project Manager')
        for manager in project_managers:
            tempObject = {}
            tempObject['first_name'] = manager.first_name
            tempObject['last_name'] = manager.last_name
            tempObject['id'] = manager.id
            tempManagerList.append(tempObject)

        return JsonResponse({'project_managers': tempManagerList}, status = 200)
    except:
        return JsonResponse({'error': 'Unable to get List of Project Managers.'}, status=500)

@csrf_exempt
def getSalesmen(request):
    try:
        tempSalesmanList = []

        project_managers = Account.objects.filter(department__icontains='sales')
        for manager in project_managers:
            tempObject = {}
            tempObject['first_name'] = manager.first_name
            tempObject['last_name'] = manager.last_name
            tempObject['id'] = manager.id
            tempSalesmanList.append(tempObject)

        return JsonResponse({'project_managers': tempSalesmanList}, status = 200)
    except:
        return JsonResponse({'error': 'Unable to get List of Project Managers.'}, status=500)

@csrf_exempt
def linkList(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            
            url = data["url"]

            link_list = get_link_list(server_root+url)
                
            return JsonResponse({'linkList': link_list}, status = 200)
        except:
            return JsonResponse({'error': 'Unable to get Link List.'}, status=500)

@csrf_exempt
def UniqueProjectNumber(request, pk):
    if request.method == 'GET':
        try:
            if(pk):
                try:
                    obj = Project.objects.get(projectNumber=pk)

                except:
                    return JsonResponse({'unique': True}, status = 200)

            else:
                return JsonResponse({'error': 'Please supply a project number'}, status = 200)
                
            return JsonResponse({'unique': False}, status = 200)

        except:
            return JsonResponse({'error': 'Could not establish if project number was unique.'}, status=500)


@csrf_exempt
def UpdateBatch(request, pk):
    try:
        if(pk[0].lower() == 'p' or pk[0].lower() == 'm' or pk[0].lower() == 'w'):
            data = JSONParser().parse(request)
            sales_data = data['sales']
            project_data = data['projects']


            projectRecord = Project.objects.get(projectNumber=pk)
            saleRecord = SalesOpp.objects.get(salesNumber=sales_data['salesNumber'])
            project_data['owner'] = Account.objects.get(id=project_data['owner'])
            sales_data['owner'] = Account.objects.get(id=sales_data['owner'])

            for field in project_data:
                if(field == 'archived'):
                    if(projectRecord.archived == False and project_data[field] == True):
                        move_directory('archive', server_root, projectRecord)

                    elif(projectRecord.archived == True and project_data[field] == False):
                        move_directory('unarchive', server_root, projectRecord)

                setattr(projectRecord, field, project_data[field])

            for field in sales_data:
                setattr(saleRecord, field, sales_data[field])

            projectRecord.save()
            saleRecord.save()


        else:
            data = JSONParser().parse(request)
            sales_data = data['sales']

            saleRecord = SalesOpp.objects.get(salesNumber=sales_data['salesNumber'])
            sales_data['owner'] = Account.objects.get(id=sales_data['owner'])

            for field in sales_data:
                setattr(saleRecord, field, sales_data[field])

                if(field == 'submitted' and sales_data[field] == True):
                    todays_date = date.today()
                    setattr(saleRecord, 'submittedDate', todays_date)

            saleRecord.save()



        return JsonResponse({'message': 'Project has been updated'}, status=200)

    except:
        return JsonResponse({'message': 'Could not update the record. Please contact and administrator'}, status=500)

@csrf_exempt
def getAssignedProjects(request, pk):
    if(pk == None or pk == 'undefined'):
        return JsonResponse({'message': 'Please supply a valid project Number'}, status=404)

    try:
        saleRecord = SalesOpp.objects.get(salesNumber=pk)
        projects = Project.objects.filter(salesLink=saleRecord)

        tempArray = []

        for project in projects:
            tempObject = {
                'projectNumber' : project.projectNumber,
                'ownerFirstName' : project.owner.first_name,
                'ownerLastName' : project.owner.last_name,
            }
            
            tempArray.append(tempObject)

        return JsonResponse({'assigned':tempArray}, status=200)

    except:
        return JsonResponse({'message': 'Could not get assigned project list'}, status=500)

@csrf_exempt
def CreateProject(request):
    try:
        data = JSONParser().parse(request)

        saleRecord = SalesOpp.objects.get(salesNumber=data["salesNumber"])
        owner = Account.objects.get(id = data["owner"])
        creator = Account.objects.get(id = data["projectCreator"])

        if(data["projectNumber"][0] == 'P'):
            file_path = "PROJECTS\\" + data["projectNumber"] + "_" + saleRecord.clientName + "_" + saleRecord.projectName
            project_template_filepath = "RESOURCES\\Templates\\Projects\\$projectNumber$_$clientName$_$projectName$"
        elif(data["projectNumber"][0] == 'W'):
            file_path = "WARRANTY\\" + data["projectNumber"] + "_" + saleRecord.clientName + "_" + saleRecord.projectName
            project_template_filepath = "RESOURCES\\Templates\\Warranty\\$projectNumber$_$clientName$_$projectName$"
        elif(data["projectNumber"][0] == 'M'):
            file_path = "MAINTENANCE\\" + data["projectNumber"] + "_" + saleRecord.clientName + "_" + saleRecord.projectName
            project_template_filepath = "RESOURCES\\Templates\\\Maintenance\\$projectNumber$_$clientName$_$projectName$"
        else:
            return JsonResponse({'message': 'Not a proper project number'}, status=400)

        new_filepath = server_root+file_path

        newProject = Project.objects.create(
            projectNumber = data["projectNumber"],
            salesLink = saleRecord,
            customerID = data["customerID"],
            projectFilePath = file_path,
            owner = owner,
            projectType = data["projectType"],
            projectCreator = creator,
            projectedCompletionDate = data["projectedCompletionDate"],
        )

        newProject.save()

        res_names = {
            "projectNumber" : data["projectNumber"],
            "clientName" : saleRecord.clientName,
            "projectName" : saleRecord.projectName
        }

        temp_filepath = server_root+project_template_filepath
        create(res_names, temp_filepath, new_filepath)

        if(owner != creator):
                send_mail(
                f"New Project Assignment - {newProject.projectNumber}",
                f"Hi {owner.first_name},\n\n{creator.first_name} {creator.last_name} created a {newProject.projectType} project with the job number {newProject.projectNumber} and assigned it to you.\nPlease contact {creator.first_name} if you believe this project has been assigned out of error.\n\nThank you,\n{creator}\n\n\n\n\"Do Not contact this email address, this email server is not monitored for responses and only inteded to send out updates from within the Cornerstone Project Suite. For any questions about how this email was generated, please contact your system administrator.\"",
                {settings.EMAIL_HOST_USER},
                [owner], 
                fail_silently=False,
            )

        return JsonResponse({'newFilePath': file_path}, status=200)

    except:
        return JsonResponse({'message': 'Could not get assigned project list'}, status=500)

@csrf_exempt
def CheckPinnedView(request, pk):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            projectNumber = data['projectNumber']

            if projectNumber[0] == 'S':
                pinnedSales = PinnedSales.objects.filter(owner = pk)
                pinnedSales = pinnedSales.filter(salesOpp = projectNumber)

                if(pinnedSales.count() > 0):
                    return JsonResponse({'pinned': True}, status=200)
                else:
                    return JsonResponse({'pinned': False}, status=200)

            else:
                pinnedProjects = PinnedProject.objects.filter(owner = pk)
                pinnedProjects = pinnedProjects.filter(project = projectNumber)

                if(pinnedProjects.count() > 0):
                    return JsonResponse({'pinned': True}, status=200)
                else:
                    return JsonResponse({'pinned': False}, status=200)


        except:
            return JsonResponse({'message': 'Could Not Getted Pinned Project List'}, status=500)

@csrf_exempt
def pinProject(request, pk):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)

            userId = pk
            user = Account.objects.get(id = userId)

            projectNumber = data['projectNumber']            

            if projectNumber[0] == 'S':
                project = SalesOpp.objects.get(salesNumber = projectNumber)

                if(data["delete"]):
                    pinnedSales = PinnedSales.objects.filter(owner = pk)
                    pinnedSales = pinnedSales.get(salesOpp = project)

                    PinnedSales.delete(pinnedSales)

                    return JsonResponse({'message': 'Pin Successfully Deleted'}, status=200)

                else:
                    newPin = PinnedSales.objects.create(
                        owner = user,
                        salesOpp = project,
                    )

                    newPin.save()

                    return JsonResponse({'message': 'Pin Successfully Created'}, status=201)
            else:
                project = Project.objects.get(projectNumber = projectNumber)

                if(data["delete"]):
                    pinnedProjects = PinnedProject.objects.filter(owner = pk)
                    pinnedProjects = pinnedProjects.get(project = data['projectNumber'])

                    PinnedProject.delete(pinnedProjects)

                    return JsonResponse({'message': 'Pin Successfully Deleted'}, status=200)

                else:
                    newPin = PinnedProject.objects.create(
                        owner = user,
                        project = project,
                    )

                    newPin.save()

                    return JsonResponse({'message': 'Pin Successfully Created'}, status=201)

        except:
            return JsonResponse({'message': 'Could not get assigned project list'}, status=500)

@csrf_exempt
def assignNotification(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            sNumber = data['salesNumber'] 
            userId = data['userId'] 
            assignedUserId = data['assignedUserId'] 

            sales = SalesOpp.objects.get(salesNumber = sNumber)
            user = Account.objects.get(id = userId)
            assignedUser = Account.objects.get(id = assignedUserId)

            newAssignment = AssignedSale.objects.create(
                owner = assignedUser,
                salesRef = sales,
            )

            newAssignment.save()

            send_mail(
                f"Convert {sNumber} to a Project",
                f"Hi {assignedUser.first_name},\n\n{user.first_name} {user.last_name} sent you a sales opportunity with the sales number {sNumber} to convert to project.\nPlease contact {user.first_name} to schedule a turn-over meeting.\n\nThank you,\n{user}\n\n\n\n\"Do Not contact this email address, this email server is not monitored for responses and only inteded to send out updates from within the Cornerstone Project Suite. For any questions about how this email was generated, please contact your system administrator.\"",
                {settings.EMAIL_HOST_USER},
                [assignedUser],
                fail_silently=False,
            )


            return JsonResponse({'message': 'Assignment notification successfully sent'}, status=200)

        except:
            return JsonResponse({'message': 'Could not send assignment notification'}, status=500)

@csrf_exempt
def CheckAssignedSale(request, pk):
    try:
        assignedProjectList = AssignedSale.objects.filter(salesRef__salesNumber = pk)
        serializer  = AssignedSalesSerializer(assignedProjectList, many=True)

        if(assignedProjectList.count() > 0):
            return JsonResponse({'assigned': True, 'list':serializer.data}, status=200)
        else:
            return JsonResponse({'assigned': False}, status=200)

    except:
        return JsonResponse({'message': 'Could Not Getted Pinned Project List'}, status=500)




# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
