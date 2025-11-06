from django.urls import path
from . import api_views

urlpatterns = [
    # Authentication
    path('auth/login/', api_views.login_api, name='api_login'),
    path('auth/signup/', api_views.signup_api, name='api_signup'),
    
    # Employee endpoints
    path('menu/tomorrow/', api_views.menu_tomorrow, name='api_menu_tomorrow'),
    path('employee/selections/', api_views.employee_selections, name='api_employee_selections'),
    
    # Admin endpoints
    path('admin/menu/', api_views.admin_menu, name='api_admin_menu'),
    path('admin/menu/create/', api_views.admin_menu_create, name='api_admin_menu_create'),
    path('admin/menu/<int:pk>/', api_views.admin_menu_update, name='api_admin_menu_update'),
    path('admin/menu/<int:pk>/delete/', api_views.admin_menu_delete, name='api_admin_menu_delete'),
    path('admin/reports/daily/', api_views.admin_daily_report, name='api_admin_daily_report'),
    
    # Superuser endpoints
    path('admin/users/', api_views.admin_users_list, name='api_admin_users_list'),
    path('admin/users/create/', api_views.admin_users_create, name='api_admin_users_create'),
    path('admin/users/<int:pk>/', api_views.admin_users_update, name='api_admin_users_update'),
    path('admin/users/<int:pk>/delete/', api_views.admin_users_delete, name='api_admin_users_delete'),
    path('admin/users/stats/', api_views.admin_users_stats, name='api_admin_users_stats'),
    
    # Notification endpoints
    path('employee/check-selections/', api_views.check_user_selections, name='api_check_selections'),
    
    # Test endpoint
    path('test/', api_views.test_endpoint, name='api_test'),
]