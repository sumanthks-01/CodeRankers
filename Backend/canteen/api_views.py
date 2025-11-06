from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q
from datetime import date, datetime
from .models import Menu, MealSelection
from .serializers import UserSerializer, MenuSerializer, MealSelectionSerializer, LoginSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'employee')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_staff = (role == 'admin')
    user.save()
    
    token, created = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_staff,
            'employee_id': f'EMP{user.id:03d}'
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    print(f"Login attempt - Data: {request.data}")
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"Username: {username}, Password: {password}")
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    print(f"Authentication result: {user}")
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        print(f"Token created: {created}, Token: {token.key}")
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_admin': user.is_staff,
                'is_superuser': user.is_superuser,
                'employee_id': f'EMP{user.id:03d}'
            }
        })
    else:
        print("Authentication failed")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def menu_tomorrow(request):
    """Get tomorrow's menu"""
    menu_items = Menu.objects.filter(available=True)
    
    # Group by meal type
    meals = {
        'breakfast': [],
        'lunch': [],
        'snacks': []
    }
    
    for item in menu_items:
        serialized_item = MenuSerializer(item).data
        meals[item.meal_type].append(serialized_item)
    
    return Response({
        'date': str(date.today()),
        'meals': meals
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def employee_selections(request):
    if request.method == 'GET':
        # Get user's current selections
        selections = MealSelection.objects.filter(
            user=request.user, 
            date=date.today()
        )
        
        # Group by meal type
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
        # Save user's selections
        selections_data = request.data.get('selections', {})
        selection_date = request.data.get('date', str(date.today()))
        
        # Clear existing selections for today
        MealSelection.objects.filter(
            user=request.user,
            date=selection_date
        ).delete()
        
        # Save new selections
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
        
        return Response({'message': 'Selections saved successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_menu(request):
    """Admin: Get all menu items"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    menu_items = Menu.objects.all()
    serializer = MenuSerializer(menu_items, many=True)
    return Response({'items': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_menu_create(request):
    """Admin: Create menu item"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = MenuSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_menu_update(request, pk):
    """Admin: Update menu item"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        menu_item = Menu.objects.get(pk=pk)
    except Menu.DoesNotExist:
        return Response({'error': 'Menu item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MenuSerializer(menu_item, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_menu_delete(request, pk):
    """Admin: Delete menu item"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        menu_item = Menu.objects.get(pk=pk)
        menu_item.delete()
        return Response({'message': 'Menu item deleted successfully'})
    except Menu.DoesNotExist:
        return Response({'error': 'Menu item not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_daily_report(request):
    """Admin: Get daily report"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    report_date = request.GET.get('date', str(date.today()))
    
    # Get all menu items with selection counts
    menu_items = Menu.objects.filter(available=True).annotate(
        selection_count=Count(
            'mealselection',
            filter=Q(mealselection__date=report_date, mealselection__opted=True)
        )
    )
    
    # Group by meal type
    report = {
        'breakfast': [],
        'lunch': [],
        'snacks': []
    }
    
    for item in menu_items:
        if item.selection_count > 0:  # Only include items with selections
            report[item.meal_type].append({
                'item_name': item.name,
                'count': item.selection_count
            })
    
    total_employees = User.objects.filter(is_staff=False).count()
    
    return Response({
        'date': report_date,
        'total_employees': total_employees,
        'report': report
    })

# Superuser-only endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    """Superuser: Get all users"""
    if not request.user.is_superuser:
        return Response({'error': 'Superuser access required'}, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_users_create(request):
    """Superuser: Create new user"""
    if not request.user.is_superuser:
        return Response({'error': 'Superuser access required'}, status=status.HTTP_403_FORBIDDEN)
    
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password', 'defaultpass123')
    is_staff = request.data.get('is_staff', False)
    is_superuser = request.data.get('is_superuser', False)
    is_active = request.data.get('is_active', True)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_staff=is_staff,
        is_superuser=is_superuser,
        is_active=is_active
    )
    
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_users_update(request, pk):
    """Superuser: Update user"""
    if not request.user.is_superuser:
        return Response({'error': 'Superuser access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Update user fields
    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.is_staff = request.data.get('is_staff', user.is_staff)
    user.is_superuser = request.data.get('is_superuser', user.is_superuser)
    user.is_active = request.data.get('is_active', user.is_active)
    user.save()
    
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_users_delete(request, pk):
    """Superuser: Delete user"""
    if not request.user.is_superuser:
        return Response({'error': 'Superuser access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(pk=pk)
        if user.is_superuser and User.objects.filter(is_superuser=True).count() <= 1:
            return Response({'error': 'Cannot delete the last superuser'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_stats(request):
    """Superuser: Get user statistics"""
    if not request.user.is_superuser:
        return Response({'error': 'Superuser access required'}, status=status.HTTP_403_FORBIDDEN)
    
    total_users = User.objects.count()
    total_admins = User.objects.filter(is_staff=True).count()
    total_employees = User.objects.filter(is_staff=False).count()
    active_users = User.objects.filter(is_active=True).count()
    
    return Response({
        'totalUsers': total_users,
        'totalAdmins': total_admins,
        'totalEmployees': total_employees,
        'activeUsers': active_users,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_user_selections(request):
    """Check if user has made selections for today"""
    today = date.today()
    user_selections = MealSelection.objects.filter(
        user=request.user,
        date=today,
        opted=True
    )
    
    # Group by meal type
    selections_by_type = {
        'breakfast': [],
        'lunch': [],
        'snacks': []
    }
    
    for selection in user_selections:
        selections_by_type[selection.menu_item.meal_type].append(selection.menu_item.id)
    
    # Check if any selections exist
    has_selections = any(len(items) > 0 for items in selections_by_type.values())
    
    return Response({
        'has_selections': has_selections,
        'selections': selections_by_type,
        'date': str(today)
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def test_endpoint(request):
    """Test endpoint to verify API is working"""
    return Response({
        'message': 'API is working!',
        'timestamp': str(datetime.now()),
        'user': request.user.username if request.user.is_authenticated else 'Anonymous'
    })