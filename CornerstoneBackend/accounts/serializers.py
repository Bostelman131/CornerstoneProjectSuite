from rest_framework import serializers

from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ("id", "profile_picture", "email", "username", "employee_id", 
            "first_name", "last_name", "job_title", "department", "user_phone", "is_admin", "base_url", "bio")

    def get_profile_picture(self, instance):
        request = self.context.get( 'request' )
        profile_picture = instance.profile_picture.url
        return request.build_absolute_uri(profile_picture) if instance.profile_picture else ''

class ChangePasswordSerializer(serializers.Serializer):
    model = Account

    """
    Serializer for password change endpoint.
    """
    password = serializers.CharField(required=True)