from django.urls import path
from . import api_views

urlpatterns = [
    # Auth endpoints
    path('auth/login/', api_views.login_api, name='api_login'),
    path('auth/signup/', api_views.signup_api, name='api_signup'),
    
    # Employee endpoints
    path('menu/tomorrow/', api_views.menu_tomorrow, name='api_menu_tomorrow'),
    path('employee/selections/', api_views.employee_selections, name='api_employee_selections'),
    path('employee/my-selections/', api_views.my_selections, name='api_my_selections'),
    
    # Admin endpoints
    path('admin/menu/', api_views.admin_menu_list, name='api_admin_menu_list'),
    path('admin/menu/add/', api_views.admin_add_menu, name='api_admin_add_menu'),
    path('admin/menu/add', api_views.admin_add_menu, name='api_admin_add_menu_no_slash'),
    path('admin/menu/<int:menu_id>/', api_views.admin_menu_detail, name='api_admin_menu_detail'),
    path('admin/reports/', api_views.admin_reports, name='api_admin_reports'),
    path('admin/users/', api_views.admin_users_list, name='api_admin_users'),
    
    # Push notifications
    path('notifications/register-token/', api_views.register_push_token, name='api_register_push_token'),
    
    # Work Status endpoints
    path('employee/work-status/', api_views.work_status, name='api_work_status'),
    path('admin/work-status-report/', api_views.admin_work_status_report, name='api_admin_work_status_report'),
    path('admin/demo-notification/', api_views.demo_notification_test, name='api_demo_notification'),
]