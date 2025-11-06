#!/usr/bin/env python
import os
import sys
import django

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from django.contrib.auth.models import User

def update_user():
    """Update user yj password"""
    username = 'yj'
    password = 'yj@here'
    
    try:
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print(f"Updated password for user '{username}'")
        print(f"Login credentials: username='{username}', password='{password}'")
    except User.DoesNotExist:
        print(f"User '{username}' not found")

if __name__ == '__main__':
    update_user()