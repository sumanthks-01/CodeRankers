from django.db import models

# Create your models here.


class Menu(models.Model):
    MEAL_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('snacks', 'Evening Snacks'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    meal_type = models.CharField(max_length=20, choices=MEAL_CHOICES)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.meal_type})"

from django.contrib.auth.models import User

class MealSelection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menu_item = models.ForeignKey('Menu', on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    opted = models.BooleanField(default=True)  # True = opted in, False = opted out

    def __str__(self):
        return f"{self.user.username} - {self.menu_item.name} ({'Opted' if self.opted else 'Skipped'})"
