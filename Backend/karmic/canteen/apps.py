from django.apps import AppConfig


class CanteenConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'canteen'
    
    def ready(self):
        from .notification_service import start_notification_scheduler
        start_notification_scheduler()


class CanteenConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'canteen'
