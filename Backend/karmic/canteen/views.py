from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from datetime import date
from django.db.models import Count, Q
from .models import Menu, MealSelection
from .forms import MenuForm
from django.utils import timezone
from django.urls import reverse



from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            
            # 🔹 Role-based redirection
            if user.is_superuser:
                return redirect('admin_dashboard')  # Superuser gets full control
            elif user.is_staff:
                return redirect('admin_dashboard')  # Admin
            else:
                return redirect('employee_home')  # Employee
            
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


#super part
def superuser_required(view_func):
    decorated = login_required(user_passes_test(lambda u: u.is_superuser, login_url='login')(view_func))
    return decorated


User = get_user_model()

@superuser_required
def user_list(request):
    users = User.objects.all().order_by('username')
    return render(request, 'canteen/user_list.html', {'users': users})

@superuser_required
def user_detail(request, user_id):
    target = get_object_or_404(User, id=user_id)
    # show last 30 days of selections (example)
    start_date = timezone.now().date() - timezone.timedelta(days=30)
    selections = MealSelection.objects.filter(user=target, date__gte=start_date).select_related('menu_item').order_by('-date')
    return render(request, 'canteen/user_detail.html', {'target': target, 'selections': selections})

@superuser_required
def toggle_staff(request, user_id):
    if request.method == 'POST':
        target = get_object_or_404(User, id=user_id)
        # Prevent toggling yourself accidentally
        if target == request.user:
            messages.error(request, "You cannot change your own staff status here.")
            return redirect('user_detail', user_id=user_id)
        target.is_staff = not target.is_staff
        target.save()
        messages.success(request, f"{target.username} is_staff set to {target.is_staff}")
    return redirect('user_detail', user_id=user_id)

@superuser_required
def toggle_active(request, user_id):
    if request.method == 'POST':
        target = get_object_or_404(User, id=user_id)
        # Prevent deactivating yourself
        if target == request.user:
            messages.error(request, "You cannot deactivate your own account.")
            return redirect('user_detail', user_id=user_id)
        target.is_active = not target.is_active
        target.save()
        messages.success(request, f"{target.username} is_active set to {target.is_active}")
    return redirect('user_detail', user_id=user_id)

@superuser_required
def reset_password(request, user_id):
    target = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        new_pass = request.POST.get('new_password')
        if new_pass:
            target.set_password(new_pass)
            target.save()
            messages.success(request, f"Password for {target.username} reset.")
            return redirect('user_detail', user_id=user_id)
        else:
            messages.error(request, "Provide a new password.")
    return render(request, 'canteen/reset_password.html', {'target': target})

# OPTIONAL: Impersonate/sudo (see security note below)
@superuser_required
def impersonate(request, user_id):
    # WARNING: this implementation is a minimal demonstration. Use audited libraries in production.
    target = get_object_or_404(User, id=user_id)
    from django.contrib.auth import login
    # store original superuser id in session so we can revert
    request.session['impersonate_original_user_id'] = request.user.id
    # perform login as target
    login(request, target)
    messages.info(request, f"You are now impersonating {target.username}.")
    return redirect('employee_home')  # or admin_dashboard depending on role

@superuser_required
def stop_impersonate(request):
    orig_id = request.session.pop('impersonate_original_user_id', None)
    if orig_id:
        orig_user = get_object_or_404(User, id=orig_id)
        from django.contrib.auth import login
        login(request, orig_user)
        messages.success(request, "Returned to superuser session.")
    else:
        messages.error(request, "No impersonation session found.")
    return redirect('admin_dashboard')




User = get_user_model()

# -------------------- MENU MANAGEMENT --------------------

@superuser_required
def menu_list_all(request):
    """Superuser view: list all menu items (by any admin)."""
    items = Menu.objects.all().order_by('-id')
    return render(request, 'canteen/menu_list_all.html', {'items': items})

@superuser_required
def menu_edit(request, menu_id):
    item = get_object_or_404(Menu, id=menu_id)
    if request.method == 'POST':
        name = request.POST.get('name')
        meal_type = request.POST.get('meal_type')
        price = request.POST.get('price')
        available = 'available' in request.POST

        item.name = name
        item.meal_type = meal_type
        item.price = price
        item.available = available
        item.save()
        messages.success(request, f'Menu item "{item.name}" updated.')
        return redirect('menu_list_all')

    return render(request, 'canteen/menu_edit.html', {'item': item})

@superuser_required
def menu_delete(request, menu_id):
    item = get_object_or_404(Menu, id=menu_id)
    item.delete()
    messages.success(request, f'Menu item "{item.name}" deleted.')
    return redirect('menu_list_all')


@superuser_required
def user_edit(request, user_id):
    target = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        target.username = request.POST.get('username')
        target.email = request.POST.get('email')
        target.is_staff = 'is_staff' in request.POST
        target.is_active = 'is_active' in request.POST
        target.save()
        messages.success(request, f'User "{target.username}" updated successfully.')
        return redirect('user_detail', user_id=user_id)
    return render(request, 'canteen/user_edit.html', {'target': target})

@superuser_required
def user_delete(request, user_id):
    target = get_object_or_404(User, id=user_id)
    if target == request.user:
        messages.error(request, "You cannot delete your own account.")
    else:
        target.delete()
        messages.success(request, "User deleted successfully.")
    return redirect('user_list')

#*********************************************************#

# Allow only superuser access
def superuser_required(view_func):
    decorated_view_func = login_required(user_passes_test(lambda u: u.is_superuser, login_url='login')(view_func))
    return decorated_view_func

@superuser_required
def manage_users(request):
    users = User.objects.all()
    return render(request, 'canteen/user_list.html', {'users': users})

@superuser_required
def edit_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        user.username = request.POST.get('username')
        user.email = request.POST.get('email')
        user.is_staff = 'is_staff' in request.POST  # checkbox
        user.save()
        messages.success(request, "User details updated successfully.")
        return redirect('manage_users')
    return render(request, 'canteen/edit_user.html', {'user_obj': user})

@superuser_required
def delete_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        user.delete()
        messages.success(request, "User deleted successfully.")
        return redirect('manage_users')
    return render(request, 'canteen/delete_user.html', {'user_obj': user})
