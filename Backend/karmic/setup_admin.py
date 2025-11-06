#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from django.contrib.auth.models import User
from canteen.models import Menu

def create_admin_user():
    """Create admin user if it doesn't exist"""
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@karmic.com',
            password='admin123',
            is_staff=True,
            is_superuser=True
        )
        print("Admin user created: username='admin', password='admin123'")
    else:
        print("Admin user already exists")

def create_sample_menu():
    """Create sample menu items"""
    menu_items = [
        {'name': 'Idli Sambar', 'meal_type': 'breakfast', 'price': 30.00},
        {'name': 'Dosa', 'meal_type': 'breakfast', 'price': 35.00},
        {'name': 'Upma', 'meal_type': 'breakfast', 'price': 25.00},
        {'name': 'Rice & Dal', 'meal_type': 'lunch', 'price': 50.00},
        {'name': 'Chicken Curry', 'meal_type': 'lunch', 'price': 80.00},
        {'name': 'Veg Biryani', 'meal_type': 'lunch', 'price': 70.00},
        {'name': 'Tea', 'meal_type': 'snacks', 'price': 10.00},
        {'name': 'Coffee', 'meal_type': 'snacks', 'price': 15.00},
        {'name': 'Samosa', 'meal_type': 'snacks', 'price': 20.00},
    ]
    
    for item_data in menu_items:
        if not Menu.objects.filter(name=item_data['name']).exists():
            Menu.objects.create(**item_data)
            print(f"Created menu item: {item_data['name']}")
        else:
            print(f"Menu item already exists: {item_data['name']}")

if __name__ == '__main__':
    print("Setting up Karmic Canteen...")
    create_admin_user()
    create_sample_menu()
    print("Setup complete!")