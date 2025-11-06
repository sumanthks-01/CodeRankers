import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from canteen.models import Menu

# Sample menu items
items = [
    {'name': 'Idli Sambar', 'description': 'Steamed rice cakes with sambar', 'meal_type': 'breakfast', 'price': 25},
    {'name': 'Masala Dosa', 'description': 'Crispy dosa with potato filling', 'meal_type': 'breakfast', 'price': 35},
    {'name': 'Rice & Dal', 'description': 'Rice with dal curry', 'meal_type': 'lunch', 'price': 40},
    {'name': 'Chicken Curry', 'description': 'Spicy chicken with rice', 'meal_type': 'lunch', 'price': 80},
    {'name': 'Tea & Snacks', 'description': 'Tea with biscuits', 'meal_type': 'snacks', 'price': 15},
    {'name': 'Samosa', 'description': 'Fried pastry with filling', 'meal_type': 'snacks', 'price': 20},
]

for item in items:
    menu_obj, created = Menu.objects.get_or_create(
        name=item['name'],
        defaults={
            'description': item['description'],
            'meal_type': item['meal_type'],
            'price': item['price'],
            'available': True
        }
    )
    if created:
        print(f"Created: {item['name']}")
    else:
        print(f"Already exists: {item['name']}")

print("Menu items setup complete!")