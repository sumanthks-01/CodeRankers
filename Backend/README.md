# Django Backend for Karmic Canteen

## Setup Instructions

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

- **Admin**: admin/admin123
- **Employee**: employee1/emp123

## Database Models

- **Menu**: Menu items with meal types (breakfast/lunch/snacks)
- **MealSelection**: User meal selections with date tracking