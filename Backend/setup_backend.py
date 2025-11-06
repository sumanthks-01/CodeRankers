#!/usr/bin/env python
"""
Setup script for Karmic Canteen Django Backend
Run this after installing requirements.txt
"""

import os
import django
from django.core.management import execute_from_command_line

def setup_backend():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
    django.setup()
    
    from django.contrib.auth.models import User
    
    print("🚀 Setting up Karmic Canteen Backend...")
    
    # Run migrations
    print("📦 Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create superuser if it doesn't exist
    print("👤 Creating admin user...")
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser('admin', 'admin@karmic.com', 'admin123')
        print("✅ Admin user created: admin/admin123")
    else:
        admin_user = User.objects.get(username='admin')
        admin_user.set_password('admin123')  # Reset password
        admin_user.save()
        print("ℹ️  Admin user password reset: admin/admin123")
    
    # Create sample employees
    print("👥 Creating sample employees...")
    employees = [
        ('employee1', 'emp1@karmic.com', 'emp123'),
        ('employee2', 'emp2@karmic.com', 'emp123'),
    ]
    
    for username, email, password in employees:
        if not User.objects.filter(username=username).exists():
            User.objects.create_user(username, email, password)
            print(f"✅ Employee created: {username}/{password}")
        else:
            emp_user = User.objects.get(username=username)
            emp_user.set_password(password)  # Reset password
            emp_user.save()
            print(f"ℹ️  Employee password reset: {username}/{password}")
    
    # Create sample menu items
    print("🍽️  Creating sample menu items...")
    from canteen.models import Menu
    
    sample_items = [
        {'name': 'Idli Sambar', 'description': 'South Indian breakfast with coconut chutney', 'meal_type': 'breakfast', 'price': 50.00},
        {'name': 'Poha', 'description': 'Maharashtrian flattened rice breakfast', 'meal_type': 'breakfast', 'price': 40.00},
        {'name': 'Upma', 'description': 'Semolina breakfast with vegetables', 'meal_type': 'breakfast', 'price': 45.00},
        
        {'name': 'Rice & Dal', 'description': 'Traditional rice with lentil curry', 'meal_type': 'lunch', 'price': 80.00},
        {'name': 'Roti & Sabzi', 'description': 'Indian bread with vegetable curry', 'meal_type': 'lunch', 'price': 75.00},
        {'name': 'Biryani', 'description': 'Aromatic rice with spices and vegetables', 'meal_type': 'lunch', 'price': 120.00},
        
        {'name': 'Tea & Biscuits', 'description': 'Evening tea with assorted biscuits', 'meal_type': 'snacks', 'price': 25.00},
        {'name': 'Coffee & Samosa', 'description': 'Fresh coffee with crispy samosas', 'meal_type': 'snacks', 'price': 35.00},
        {'name': 'Juice & Sandwich', 'description': 'Fresh juice with vegetable sandwich', 'meal_type': 'snacks', 'price': 60.00},
    ]
    
    for item_data in sample_items:
        if not Menu.objects.filter(name=item_data['name']).exists():
            Menu.objects.create(**item_data)
            print(f"✅ Menu item created: {item_data['name']}")
    
    print("\n🎉 Backend setup complete!")
    print("\n📱 Mobile App Connection:")
    print("   API Base URL: http://127.0.0.1:8000/api")
    print("\n🔑 Test Credentials:")
    print("   Admin: admin/admin123")
    print("   Employee: employee1/emp123")
    print("\n🚀 Start the server with: python manage.py runserver")

if __name__ == '__main__':
    setup_backend()