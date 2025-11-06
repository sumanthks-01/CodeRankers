#!/usr/bin/env python
import os
import sys
import django

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from django.contrib.auth.models import User

def create_user():
    """Create user yj"""
    username = 'yj'
    password = 'yj@here'
    email = 'yj@karmic.com'
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists")
        return
    
    # Create new user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_staff=False,
        is_superuser=False
    )
    print(f"Created user '{username}' with password '{password}'")

if __name__ == '__main__':
    create_user()