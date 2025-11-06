# Karmic Canteen Web Application

React web application that matches the Django interface design for the Karmic Canteen system.

## Features

- **Login System** - Matches Django login interface with animated gradient background
- **Admin Dashboard** - Menu management and reports access
- **Employee Interface** - Menu selection with table layout matching Django
- **Menu Management** - Full CRUD operations for menu items
- **Daily Reports** - View meal selection statistics

## Setup Instructions

### 1. Install Dependencies
```bash
cd web-app
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Access Application
- Open http://localhost:3000
- Use same credentials as Django backend:
  - Admin: admin/admin123
  - Employee: employee1/emp123

## API Connection

The React app connects to the Django backend at:
- **Base URL**: http://127.0.0.1:8000/api
- **Authentication**: Token-based

## Components

- **Login** - Animated login form matching Django CSS
- **AdminDashboard** - Simple navigation menu
- **EmployeeHome** - Menu table with opt-in/opt-out functionality
- **ManageMenu** - Add/edit/delete menu items
- **Reports** - Daily meal selection reports

## Styling

All components use CSS that closely matches the original Django templates:
- Same color schemes and layouts
- Responsive design
- Form styling matches Django interface
- Table layouts identical to Django templates

## Running Full Stack

1. Start Django backend: `cd Backend && python manage.py runserver`
2. Start React app: `cd web-app && npm start`
3. Access web interface at http://localhost:3000