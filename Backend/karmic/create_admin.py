#!/usr/bin/env python
import os
import sys
import django

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin():
    """Create an admin user"""
    username = 'admin'
    password = 'admin123'
    email = 'admin@karmic.com'
    
    # Check if admin already exists
    if User.objects.filter(username=username).exists():
        admin_user = User.objects.get(username=username)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        print(f"Updated existing user '{username}' to admin")
    else:
        # Create new admin user
        admin_user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True,
            is_superuser=True
        )
        print(f"Created new admin user '{username}'")
    
    print(f"Admin credentials: username='{username}', password='{password}'")

if __name__ == '__main__':
    create_admin()