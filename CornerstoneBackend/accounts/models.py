from ast import BinOp
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin


class MyAccountManager(BaseUserManager):
	def create_user(self, email, username, employee_id="", first_name="", last_name="", job_title="", department="", user_phone="", profile_picture='logo.jpg', base_url='\\\\172.18.50.2\\sedata\\',  password="CDP001", is_admin=False):
		if not email:
			raise ValueError('Users must have an email address')
		if not username:
			raise ValueError('Users must have a username')

		user = self.model(
			email=self.normalize_email(email),
			password=password,
			username=username,
		)


		
		user.employee_id = employee_id
		user.first_name = first_name
		user.last_name = last_name
		user.job_title = job_title
		user.department = department
		user.user_phone = user_phone
		user.profile_picture = profile_picture
		user.base_url = base_url
		user.is_staff = True
		user.is_superuser = False
		user.is_admin = is_admin
		user.set_password(password)


		return user

	def create_superuser(self, email, username, password, **extra_fields):
		user = self.create_user(
			email=self.normalize_email(email),
			password=password,
			username=username,
		)
		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.save()
		return user


class Account(AbstractBaseUser,PermissionsMixin):
	email 					= models.EmailField(verbose_name="email", max_length=60, unique=True)
	username 				= models.CharField(max_length=30, unique=True)
	employee_id				= models.CharField(max_length=10, unique=True)
	first_name 				= models.CharField(max_length=20)
	last_name 				= models.CharField(max_length=20)
	job_title 				= models.CharField(max_length=25)
	department 				= models.CharField(max_length=25)
	user_phone 				= models.CharField(max_length=10)
	date_joined				= models.DateTimeField(verbose_name='date joined', auto_now_add=True)
	last_login				= models.DateTimeField(verbose_name='last login', auto_now=True)
	is_admin				= models.BooleanField(default=False)
	is_active				= models.BooleanField(default=True)
	is_staff				= models.BooleanField(default=False)
	is_superuser			= models.BooleanField(default=False)
	profile_picture			= models.ImageField( blank=True, null=True )
	base_url				= models.CharField(max_length=200, null=True)
	bio						= models.CharField(max_length=1000, default="", null=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	objects = MyAccountManager()

	def __str__(self):
		return self.email

	# For checking permissions. to keep it simple all admin have ALL permissons
	def has_perm(self, perm, obj=None):
		return self.is_admin

	# Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
	def has_module_perms(self, app_label):
		return True

