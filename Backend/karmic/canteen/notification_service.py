import schedule
import time
import threading
from datetime import date, timedelta
from django.contrib.auth.models import User
from .models import MealSelection
from .push_notifications import send_push_notification

def check_unselected_employees():
    """Check for employees who haven't selected food for tomorrow"""
    tomorrow = date.today() + timedelta(days=1)
    
    # Get all employees (non-staff users)
    all_employees = User.objects.filter(is_staff=False, is_active=True)
    
    # Get employees who have made selections for tomorrow
    selected_employees = MealSelection.objects.filter(
        date=tomorrow,
        opted=True
    ).values_list('user_id', flat=True).distinct()
    
    # Find employees who haven't selected
    unselected_employees = all_employees.exclude(id__in=selected_employees)
    
    # Send notifications
    for employee in unselected_employees:
        send_notification_to_employee(employee)
    
    print(f"Sent notifications to {unselected_employees.count()} employees")

def send_notification_to_employee(employee):
    """Send notification to individual employee"""
    message = {
        'title': 'Food Selection Reminder',
        'body': f'Hi {employee.username}, please select your food for tomorrow before 9 PM!',
        'data': {
            'type': 'food_reminder',
            'user_id': employee.id
        }
    }
    
    # For testing - print notification
    print(f"NOTIFICATION TO {employee.username}: {message['title']} - {message['body']}")
    
    # Send push notification (implement based on your push service)
    send_push_notification(employee.id, message)

def start_notification_scheduler():
    """Start the notification scheduler"""
    # Schedule notification at 8:30 PM daily
    schedule.every().day.at("20:30").do(check_unselected_employees)
    
    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    # Run scheduler in background thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    print("Notification scheduler started")