from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),  # home/login page
    path('signup/', views.signup_view, name='signup'),
    path('employee_home/', views.employee_home, name='employee_home'),
    path('my_selections/', views.my_selections, name='my_selections'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('logout/', views.logout_view, name='logout_view'),
    path('manage_menu/', views.manage_menu, name='manage_menu'),
    path('generate_report/', views.generate_report, name='generate_report'),
    path('add_menu_item/', views.add_menu_item, name='add_menu_item'),
    path('update_menu_item/<int:pk>/', views.update_menu_item, name='update_menu_item'),
    path('delete_menu_item/<int:pk>/', views.delete_menu_item, name='delete_menu_item'),
    path('generate_report/', views.generate_report, name='generate_report'),
    path('view_opted_users/<int:menu_id>/', views.view_opted_users, name='view_opted_users'),
    ]
