# Backend Connection Guide

## Django Backend Setup

### 1. Install Dependencies
```bash
cd Backend
pip install -r requirements.txt
```

### 2. Setup Database and Sample Data
```bash
python setup_backend.py
```

### 3. Start Django Server
```bash
python manage.py runserver
```

## API Endpoints

The React Native app connects to these Django REST API endpoints:

### Authentication
- `POST /api/auth/login/` - User login

### Employee Endpoints
- `GET /api/menu/tomorrow/` - Get tomorrow's menu
- `GET /api/employee/selections/` - Get user's meal selections
- `POST /api/employee/selections/` - Save meal selections

### Admin Endpoints
- `GET /api/admin/menu/` - Get all menu items
- `POST /api/admin/menu/create/` - Create menu item
- `PUT /api/admin/menu/{id}/` - Update menu item
- `DELETE /api/admin/menu/{id}/delete/` - Delete menu item
- `GET /api/admin/reports/daily/` - Get daily report

## Test Credentials

### Admin Access
- Username: `admin`
- Password: `admin123`

### Employee Access
- Username: `employee1`
- Password: `emp123`

## Frontend Configuration

The React Native app is configured to connect to:
- **API Base URL**: `http://127.0.0.1:8000/api`
- **Authentication**: Token-based authentication
- **Headers**: `Authorization: Token {token}`

## Database Models

### Menu
- `name`: Menu item name
- `description`: Item description
- `meal_type`: breakfast/lunch/snacks
- `price`: Item price
- `available`: Boolean availability

### MealSelection
- `user`: Foreign key to User
- `menu_item`: Foreign key to Menu
- `date`: Selection date
- `opted`: Boolean (opted in/out)

## Running the Full Stack

1. **Start Django Backend**:
   ```bash
   cd Backend
   python manage.py runserver
   ```

2. **Start React Native App**:
   ```bash
   npm start
   ```

3. **Test Connection**:
   - Open the mobile app
   - Use test credentials to login
   - Verify data loads from Django backend

## Troubleshooting

### Connection Issues
- Ensure Django server is running on `127.0.0.1:8000`
- Check CORS settings in Django settings.py
- Verify API endpoints are accessible

### Authentication Issues
- Check token format: `Token {token}` not `Bearer {token}`
- Verify user exists in Django admin panel
- Check token creation in Django admin

### Data Issues
- Run `python setup_backend.py` to reset sample data
- Check Django admin panel for data verification
- Verify API responses in Django logs