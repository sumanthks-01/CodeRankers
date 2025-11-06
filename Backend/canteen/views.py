from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from datetime import date
from django.db.models import Count, Q
from .models import Menu, MealSelection
from .forms import MenuForm




def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            # Redirect based on role
            if user.is_staff:
                return redirect('admin_dashboard')  # You can create this later
            else:
                return redirect('employee_home')
        else:
            messages.error(request, "Invalid username or password")
            return redirect('login')

    return render(request, 'canteen/login.html')





def signup_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']  # ✅ New field
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        role = request.POST['role']

        # Check passwords match
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect('signup')

        # Check if username exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect('signup')

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered.")
            return redirect('signup')

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Assign role
        if role == 'admin':
            user.is_staff = True  # Make admin
        else:
            user.is_staff = False  # Employee
        
        user.save()

        messages.success(request, "Account created successfully! Please log in.")
        return redirect('login')

    return render(request, 'canteen/signup.html')

 

@login_required
def employee_home(request):
    user = request.user
    menu_items = Menu.objects.filter(available=True)  # show all available items

    if request.method == 'POST':
        menu_id = request.POST.get('menu_id')
        action = request.POST.get('action')
        menu_item = get_object_or_404(Menu, id=menu_id)

        if action == 'opt_in':
            MealSelection.objects.update_or_create(
                user=user, menu_item=menu_item, date=date.today(),
                defaults={'opted': True}
            )
            messages.success(request, f"You opted for {menu_item.name}.")
        elif action == 'opt_out':
            MealSelection.objects.update_or_create(
                user=user, menu_item=menu_item, date=date.today(),
                defaults={'opted': False}
            )
            messages.info(request, f"You opted out of {menu_item.name}.")
        return redirect('employee_home')

    selections = MealSelection.objects.filter(user=user, date=date.today())
    opted_items = [sel.menu_item.id for sel in selections if sel.opted]

    return render(request, 'canteen/employee_home.html', {
        'user': user,
        'menu_items': menu_items,
        'opted_items': opted_items
    })







def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully.")
    return redirect('login')





def admin_required(view_func):
    decorated_view_func = login_required(user_passes_test(lambda u: u.is_staff, login_url='login')(view_func))
    return decorated_view_func

@admin_required
def admin_dashboard(request):
    return render(request, 'canteen/admin_dashboard.html', {'user': request.user})

@admin_required
def manage_menu(request):
    menu_items = Menu.objects.all()
    return render(request, 'canteen/manage_menu.html', {'menu_items': menu_items})

@admin_required
def add_menu_item(request):
    if request.method == 'POST':
        form = MenuForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Menu item added successfully!")
            return redirect('manage_menu')
    else:
        form = MenuForm()
    return render(request, 'canteen/add_menu_item.html', {'form': form})

@admin_required
def update_menu_item(request, pk):
    menu_item = get_object_or_404(Menu, pk=pk)
    if request.method == 'POST':
        form = MenuForm(request.POST, instance=menu_item)
        if form.is_valid():
            form.save()
            messages.success(request, "Menu item updated successfully!")
            return redirect('manage_menu')
    else:
        form = MenuForm(instance=menu_item)
    return render(request, 'canteen/update_menu_item.html', {'form': form})

@admin_required
def delete_menu_item(request, pk):
    menu_item = get_object_or_404(Menu, pk=pk)
    menu_item.delete()
    messages.success(request, "Menu item deleted successfully!")
    return redirect('manage_menu')





@admin_required
def generate_report(request):
    today = date.today()

    report_data = (
        Menu.objects.filter(available=True)
        .annotate(
            total_opted=Count(
                'mealselection',
                filter=Q(mealselection__date=today, mealselection__opted=True)
            ),
        )
    )

    return render(request, 'canteen/report.html', {
        'report_data': report_data,
        'today': today,
    })


@login_required
def my_selections(request):
    user = request.user
    selections = MealSelection.objects.filter(user=user).order_by('-date')
    return render(request, 'canteen/my_selections.html', {'selections': selections})


@admin_required
def view_opted_users(request, menu_id):
    today = date.today()
    menu_item = get_object_or_404(Menu, id=menu_id)
    opted_users = MealSelection.objects.filter(
        menu_item=menu_item, opted=True, date=today
    ).select_related('user')

    return render(request, 'canteen/view_opted_users.html', {
        'menu_item': menu_item,
        'opted_users': opted_users,
        'today': today,
    })
