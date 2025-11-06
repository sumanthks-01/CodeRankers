import requests
import json
from django.conf import settings
from datetime import date

# Store device tokens (in production, use database)
DEVICE_TOKENS = {}

def register_device_token(user_id, token):
    """Register device token for push notifications"""
    DEVICE_TOKENS[user_id] = token

def is_user_on_site(user_id):
    """Check if user is working from office today"""
    from .models import WorkStatus
    try:
        work_status = WorkStatus.objects.get(user_id=user_id, date=date.today())
        return work_status.status == 'office'
    except WorkStatus.DoesNotExist:
        # Default to office if no status set
        return True

def send_push_notification(user_id, message):
    """Send push notification only to users working from office"""
    if not is_user_on_site(user_id):
        print(f"User {user_id} not on-site - notification skipped")
        return False
    
    token = DEVICE_TOKENS.get(user_id)
    
    # For development - log notification
    print(f"PUSH NOTIFICATION for on-site user {user_id}: {message['title']} - {message['body']}")
    
    if not token:
        print(f"No device token for user {user_id} - notification logged only")
        return True
    
    # In production, you would implement actual push notification service here
    print(f"Notification would be sent to device token: {token[:10]}...")
    return True

def send_bulk_notification_to_onsite_users(message):
    """Send notification to all users working from office today"""
    from django.contrib.auth.models import User
    from .models import WorkStatus
    
    # Get all users who are working from office today
    today = date.today()
    office_users = User.objects.filter(
        workstatus__date=today,
        workstatus__status='office'
    ).values_list('id', flat=True)
    
    # Also include users with no status (default to office)
    users_with_no_status = User.objects.exclude(
        workstatus__date=today
    ).values_list('id', flat=True)
    
    all_onsite_users = list(office_users) + list(users_with_no_status)
    
    sent_count = 0
    for user_id in all_onsite_users:
        if send_push_notification(user_id, message):
            sent_count += 1
    
    print(f"Bulk notification sent to {sent_count} on-site users")
    return sent_count