import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karmic.settings')
django.setup()

from canteen.models import Menu

# Create sample menu items
menu_items = [
    {'name': 'Idli Sambar', 'description': 'Steamed rice cakes with lentil curry', 'meal_type': 'breakfast', 'price': 25.00},
    {'name': 'Masala Dosa', 'description': 'Crispy crepe with spiced potato filling', 'meal_type': 'breakfast', 'price': 35.00},
    {'name': 'Rice & Dal', 'description': 'Steamed rice with lentil curry', 'meal_type': 'lunch', 'price': 40.00},
    {'name': 'Chicken Curry', 'description': 'Spicy chicken curry with rice', 'meal_type': 'lunch', 'price': 80.00},
    {'name': 'Tea & Biscuits', 'description': 'Hot tea with assorted biscuits', 'meal_type': 'snacks', 'price': 15.00},
    {'name': 'Samosa', 'description': 'Fried pastry with spiced filling', 'meal_type': 'snacks', 'price': 20.00},
]

for item in menu_items:
    Menu.objects.get_or_create(
        name=item['name'],
        defaults={
            'description': item['description'],
            'meal_type': item['meal_type'],
            'price': item['price'],
            'available': True
        }
    )

print("Sample menu items created successfully!")