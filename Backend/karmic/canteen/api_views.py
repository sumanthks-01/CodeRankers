from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q
from datetime import date, timedelta
from .models import Menu, MealSelection, WorkStatus
from .serializers import MenuSerializer, MealSelectionSerializer, UserSerializer, WorkStatusSerializer
from .push_notifications import register_device_token

@api_view(['POST'])
@permission_classes([])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_staff or user.is_superuser,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        })
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([])
def signup_api(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'employee')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    if role == 'admin':
        user.is_staff = True
        user.save()
    
    token, created = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_staff or user.is_superuser,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def menu_tomorrow(request):
    menu_items = Menu.objects.filter(available=True)
    
    meals = {
        'breakfast': [],
        'lunch': [],
        'snacks': []
    }
    
    for item in menu_items:
        serialized = MenuSerializer(item).data
        meals[item.meal_type].append(serialized)
    
    return Response({'meals': meals})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def employee_selections(request):
    if request.method == 'GET':
        today = date.today()
        selections = MealSelection.objects.filter(user=request.user, date=today)
        
        grouped_selections = {
            'breakfast': [],
            'lunch': [],
            'snacks': []
        }
        
        for selection in selections:
            if selection.opted:
                grouped_selections[selection.menu_item.meal_type].append(selection.menu_item.id)
        
        return Response({'selections': grouped_selections})
    
    elif request.method == 'POST':
        selections_data = request.data.get('selections', {})
        selection_date = request.data.get('date', str(date.today()))
        
        # Clear existing selections for the date
        MealSelection.objects.filter(user=request.user, date=selection_date).delete()
        
        # Create new selections
        for meal_type, item_ids in selections_data.items():
            for item_id in item_ids:
                try:
                    menu_item = Menu.objects.get(id=item_id)
                    MealSelection.objects.create(
                        user=request.user,
                        menu_item=menu_item,
                        date=selection_date,
                        opted=True
                    )
                except Menu.DoesNotExist:
                    continue
        
        return Response({'message': 'Selections updated successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_selections(request):
    selections = MealSelection.objects.filter(user=request.user).order_by('-date')[:30]
    serialized = MealSelectionSerializer(selections, many=True)
    return Response({'selections': serialized.data})

# Admin APIs
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_menu_list(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Permission denied'}, status=403)
    
    menu_items = Menu.objects.all()
    serialized = MenuSerializer(menu_items, many=True)
    return Response({'menu_items': serialized.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_add_menu(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Permission denied'}, status=403)
    
    serializer = MenuSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_menu_detail(request, menu_id):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Permission denied'}, status=403)
    
    try:
        menu_item = Menu.objects.get(id=menu_id)
    except Menu.DoesNotExist:
        return Response({'error': 'Menu item not found'}, status=404)
    
    if request.method == 'PUT':
        serializer = MenuSerializer(menu_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        menu_item.delete()
        return Response({'message': 'Menu item deleted'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_reports(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Permission denied'}, status=403)
    
    today = date.today()
    
    report_data = []
    menu_items = Menu.objects.filter(available=True)
    
    for item in menu_items:
        opted_count = MealSelection.objects.filter(
            menu_item=item,
            date=today,
            opted=True
        ).count()
        
        report_data.append({
            'menu_item': MenuSerializer(item).data,
            'opted_count': opted_count
        })
    
    return Response({'report_data': report_data, 'date': today})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=403)
    
    users = User.objects.all()
    serialized = UserSerializer(users, many=True)
    return Response({'users': serialized.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_push_token(request):
    token = request.data.get('token')
    if token:
        register_device_token(request.user.id, token)
        return Response({'message': 'Token registered successfully'})
    return Response({'error': 'Token required'}, status=400)

# Work Status APIs
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def work_status(request):
    if request.method == 'GET':
        today = date.today()
        try:
            status = WorkStatus.objects.get(user=request.user, date=today)
            serializer = WorkStatusSerializer(status)
            return Response({'status': serializer.data})
        except WorkStatus.DoesNotExist:
            return Response({'status': {'status': 'office', 'status_display': 'Working from Office', 'date': today, 'reason': ''}})
    
    elif request.method == 'POST':
        status_data = request.data.get('status')
        reason = request.data.get('reason', '')
        status_date = request.data.get('date', str(date.today()))
        
        work_status, created = WorkStatus.objects.update_or_create(
            user=request.user,
            date=status_date,
            defaults={'status': status_data, 'reason': reason}
        )
        
        serializer = WorkStatusSerializer(work_status)
        return Response({'status': serializer.data, 'message': 'Work status updated successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_work_status_report(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Permission denied'}, status=403)
    
    today = date.today()
    work_statuses = WorkStatus.objects.filter(date=today).select_related('user')
    
    status_report = {
        'office': [],
        'wfh': [],
        'sick': [],
        'leave': []
    }
    
    for ws in work_statuses:
        status_report[ws.status].append({
            'username': ws.user.username,
            'email': ws.user.email,
            'reason': ws.reason
        })
    
    # Count users with no status (default to office)
    users_with_no_status = User.objects.exclude(workstatus__date=today).count()
    
    return Response({
        'date': today,
        'status_report': status_report,
        'users_with_no_status': users_with_no_status,
        'total_onsite': len(status_report['office']) + users_with_no_status
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def demo_notification_test(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Permission denied'}, status=403)
    
    from .notification_service import demo_notification_feature
    
    result = demo_notification_feature()
    return Response({
        'message': 'Demo notification test completed',
        'results': result
    })