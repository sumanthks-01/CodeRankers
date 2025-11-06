from django.core.management.base import BaseCommand
from canteen.notification_service import check_unselected_employees

class Command(BaseCommand):
    help = 'Send notifications to employees who haven\'t selected food'

    def handle(self, *args, **options):
        self.stdout.write('Checking for unselected employees...')
        check_unselected_employees()
        self.stdout.write(self.style.SUCCESS('Notifications sent successfully'))