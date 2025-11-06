import requests
import json
from django.conf import settings

# Store device tokens (in production, use database)
DEVICE_TOKENS = {}

def register_device_token(user_id, token):
    """Register device token for push notifications"""
    DEVICE_TOKENS[user_id] = token

def send_push_notification(user_id, message):
    """Send push notification to user's device"""
    token = DEVICE_TOKENS.get(user_id)
    
    # For development - log notification regardless of token
    print(f"PUSH NOTIFICATION for user {user_id}: {message['title']} - {message['body']}")
    
    if not token:
        print(f"No device token for user {user_id} - notification logged only")
        return True  # Return True for testing
    
    # In production, you would implement actual push notification service here
    print(f"Notification would be sent to device token: {token[:10]}...")
    return True