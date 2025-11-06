from datetime import date, time, datetime
from django.contrib.auth.models import User
from .models import WorkStatus
from .push_notifications import send_bulk_notification_to_onsite_users
import threading
import time as time_module

def send_meal_reminder_notifications():
    """Send meal reminder notifications only to employees working from office"""
    
    # Example notification messages for different times
    notifications = {
        'breakfast': {
            'title': '🍳 Breakfast Reminder',
            'body': 'Don\'t forget to select your breakfast options for today!'
        },
        'lunch': {
            'title': '🍽️ Lunch Reminder', 
            'body': 'Time to choose your lunch! Selection closes at 9 PM.'
        },
        'snacks': {
            'title': '☕ Evening Snacks',
            'body': 'Select your evening snacks before the deadline!'
        }
    }
    
    current_hour = datetime.now().hour
    
    # Determine which notification to send based on time
    if 7 <= current_hour < 10:
        message = notifications['breakfast']
    elif 11 <= current_hour < 14:
        message = notifications['lunch']
    elif 15 <= current_hour < 17:
        message = notifications['snacks']
    else:
        return  # No notifications outside meal times
    
    # Send notification only to on-site employees
    sent_count = send_bulk_notification_to_onsite_users(message)
    print(f"Meal reminder sent to {sent_count} on-site employees")
    
    return sent_count

def get_onsite_employees_count():
    """Get count of employees working from office today"""
    today = date.today()
    
    # Count users explicitly marked as office
    office_users = User.objects.filter(
        workstatus__date=today,
        workstatus__status='office'
    ).count()
    
    # Count users with no status (default to office)
    users_with_no_status = User.objects.exclude(
        workstatus__date=today
    ).count()
    
    return office_users + users_with_no_status

def get_remote_employees_count():
    """Get count of employees not working from office today"""
    today = date.today()
    
    return User.objects.filter(
        workstatus__date=today,
        workstatus__status__in=['wfh', 'sick', 'leave']
    ).count()

def schedule_daily_notifications():
    """Schedule notifications for meal times (demo function)"""
    
    def notification_scheduler():
        while True:
            current_time = datetime.now().time()
            
            # Send breakfast reminder at 8:30 AM
            if current_time.hour == 8 and current_time.minute == 30:
                send_meal_reminder_notifications()
                time_module.sleep(60)  # Wait 1 minute to avoid duplicate sends
            
            # Send lunch reminder at 12:30 PM  
            elif current_time.hour == 12 and current_time.minute == 30:
                send_meal_reminder_notifications()
                time_module.sleep(60)
            
            # Send snacks reminder at 4:00 PM
            elif current_time.hour == 16 and current_time.minute == 0:
                send_meal_reminder_notifications()
                time_module.sleep(60)
            
            time_module.sleep(30)  # Check every 30 seconds
    
    # Run scheduler in background thread
    scheduler_thread = threading.Thread(target=notification_scheduler, daemon=True)
    scheduler_thread.start()
    print("Notification scheduler started")

# Demo function to test the feature
def demo_notification_feature():
    """Demo function to show how notifications work with work status"""
    
    print("\n=== KARMIC CANTEEN NOTIFICATION DEMO ===")
    print(f"Date: {date.today()}")
    
    onsite_count = get_onsite_employees_count()
    remote_count = get_remote_employees_count()
    
    print(f"📊 Employee Status Summary:")
    print(f"   • On-site workers: {onsite_count} (will receive notifications)")
    print(f"   • Remote workers: {remote_count} (notifications disabled)")
    
    print(f"\n📱 Sending test notification...")
    test_message = {
        'title': '🍽️ Test Notification',
        'body': 'This is a test notification for on-site employees only!'
    }
    
    sent_count = send_bulk_notification_to_onsite_users(test_message)
    print(f"✅ Notification sent to {sent_count} on-site employees")
    print(f"❌ {remote_count} remote employees did not receive notification")
    
    return {
        'onsite_count': onsite_count,
        'remote_count': remote_count,
        'notifications_sent': sent_count
    }