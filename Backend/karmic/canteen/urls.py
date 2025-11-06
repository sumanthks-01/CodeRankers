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
    #############

      path('users/', views.user_list, name='user_list'),
    path('users/<int:user_id>/', views.user_detail, name='user_detail'),
    path('users/<int:user_id>/toggle_staff/', views.toggle_staff, name='toggle_staff'),
    path('users/<int:user_id>/toggle_active/', views.toggle_active, name='toggle_active'),
    path('users/<int:user_id>/reset_password/', views.reset_password, name='reset_password'),
    path('impersonate/<int:user_id>/', views.impersonate, name='impersonate'),             # optional
    path('impersonate/stop/', views.stop_impersonate, name='stop_impersonate'),          # optional

##########################
 path('menu/all/', views.menu_list_all, name='menu_list_all'),
    path('menu/edit/<int:menu_id>/', views.menu_edit, name='menu_edit'),
    path('menu/delete/<int:menu_id>/', views.menu_delete, name='menu_delete'),

    # Superuser user control
    path('users/<int:user_id>/edit/', views.user_edit, name='user_edit'),
    path('users/<int:user_id>/delete/', views.user_delete, name='user_delete'),



#********************************************************************************#
 path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('manage-users/', views.manage_users, name='manage_users'),
    path('edit-user/<int:user_id>/', views.edit_user, name='edit_user'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
    ]
