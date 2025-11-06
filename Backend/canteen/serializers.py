from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Menu, MealSelection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'meal_type', 'price', 'available']

class MealSelectionSerializer(serializers.ModelSerializer):
    menu_item = MenuSerializer(read_only=True)
    
    class Meta:
        model = MealSelection
        fields = ['id', 'menu_item', 'date', 'opted']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()