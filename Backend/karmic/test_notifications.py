#!/usr/bin/env python
import os
import sys
import django
from datetime import date, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from django.contrib.auth.models import User
from canteen.models import MealSelection

def test_notification_system():
    """Test the notification system"""
    tomorrow = date.today() + timedelta(days=1)
    
    print("=== NOTIFICATION SYSTEM TEST ===")
    print(f"Checking for tomorrow: {tomorrow}")
    
    # Get all employees (non-staff users)
    all_employees = User.objects.filter(is_staff=False, is_active=True)
    print(f"Total employees: {all_employees.count()}")
    
    for emp in all_employees:
        print(f"- {emp.username} (ID: {emp.id})")
    
    # Get employees who have made selections for tomorrow
    selected_employees = MealSelection.objects.filter(
        date=tomorrow,
        opted=True
    ).values_list('user_id', flat=True).distinct()
    
    print(f"Employees who selected food for tomorrow: {len(selected_employees)}")
    
    # Find employees who haven't selected
    unselected_employees = all_employees.exclude(id__in=selected_employees)
    print(f"Employees who NEED notifications: {unselected_employees.count()}")
    
    for emp in unselected_employees:
        print(f"- {emp.username} needs notification")
    
    print("\n=== RUNNING NOTIFICATION CHECK ===")
    from canteen.notification_service import check_unselected_employees
    check_unselected_employees()

if __name__ == '__main__':
    test_notification_system()