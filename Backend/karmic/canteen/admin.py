# from django.contrib import admin

# # Register your models here.
# from .models import Menu


# admin.site.register(Menu)


##########
from django.contrib import admin
from .models import Menu, MealSelection

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'meal_type', 'price', 'available')

@admin.register(MealSelection)
class MealSelectionAdmin(admin.ModelAdmin):
    list_display = ('user', 'menu_item', 'date', 'opted')
    list_filter = ('date', 'opted', 'menu_item')
