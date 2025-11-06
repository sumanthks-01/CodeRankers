from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Menu, MealSelection, WorkStatus

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser']

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'meal_type', 'price', 'available']

class MealSelectionSerializer(serializers.ModelSerializer):
    menu_item = MenuSerializer(read_only=True)
    
    class Meta:
        model = MealSelection
        fields = ['id', 'menu_item', 'date', 'opted']

class WorkStatusSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = WorkStatus
        fields = ['id', 'status', 'status_display', 'date', 'reason']