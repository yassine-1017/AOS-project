
# from rest_framework import serializers
# from .models import User

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ['username', 'first_name', 'last_name', 'email', 'password', 'role']

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             first_name=validated_data.get('first_name', ''),
#             last_name=validated_data.get('last_name', ''),
#             email=validated_data['email'],
#             password=validated_data['password'],
#             role=validated_data.get('role', 'CLIENT')
#         )
#         return user
    
from rest_framework import serializers
from .models import User
import uuid

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        # Auto-generate username from first+last name
        base = f"{validated_data['first_name'].lower()}.{validated_data['last_name'].lower()}"
        username = base
        # Make sure it's unique
        while User.objects.filter(username=username).exists():
            username = f"{base}.{uuid.uuid4().hex[:4]}"

        user = User.objects.create_user(
            username=username,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='CLIENT'  # always CLIENT, never user-controlled
        )
        return user