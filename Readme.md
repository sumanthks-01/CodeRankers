# Karmic Canteen - Complete Mobile & Web Application

## Overview
A comprehensive canteen management system with both web and mobile applications, featuring employee meal selection and admin management capabilities.

## Features

### 🍽️ Employee Features
- **Menu Selection**: View daily menu (Breakfast, Lunch, Evening Snacks)
- **Meal Opt-in/Out**: Select or skip meals with real-time updates
- **Selection History**: View past meal selections
- **Work Status Management**: Set work location (Office/WFH/Sick/Leave)
- **Smart Notifications**: Only receive notifications when working from office
- **Cross-platform**: Available on web and mobile

### 👨💼 Admin Features
- **Menu Management**: Add, edit, delete menu items
- **Daily Reports**: View meal selection statistics
- **Work Status Reports**: Monitor employee work locations
- **Smart Notification Control**: View who receives notifications
- **User Management**: (Super admin) Manage user accounts
- **Real-time Analytics**: Track meal preferences and counts

### 🔐 Authentication
- Role-based access (Employee/Admin/Super Admin)
- Secure token-based authentication
- Auto-login functionality

## Technology Stack

### Backend
- **Django 5.2.7** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database (Neon cloud)
- **Token Authentication** - Secure API access

### Web Application
- **React 19.2.0** - Frontend framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **React Router** - Navigation

### Mobile Application
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform
- **React Navigation** - Mobile navigation
- **AsyncStorage** - Local data persistence

## Quick Start

### 1. Backend Setup
```bash
cd Backend/karmic
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Web App Setup
```bash
cd web-app
npm install
npm start
```

### 3. Mobile App Setup
```bash
cd karmic-canteen-app
npm install
npm start
```

## Project Structure
```
CodeRankers/
├── karmic-canteen-app/          # React Native Mobile App
│   ├── src/
│   │   ├── screens/             # App screens
│   │   ├── components/          # Reusable components
│   │   ├── navigation/          # Navigation setup
│   │   ├── services/           # API services
│   │   └── context/            # State management
│   ├── Backend/                # Django Backend
│   │   └── karmic/
│   │       ├── canteen/        # Main app
│   │       ├── models.py       # Database models
│   │       ├── views.py        # Web views
│   │       ├── api_views.py    # API endpoints
│   │       └── serializers.py  # API serializers
│   └── web-app/               # React Web Application
│       └── src/
│           └── components/     # React components
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/signup/` - User registration

### Employee
- `GET /api/menu/tomorrow/` - Get available menu
- `GET/POST /api/employee/selections/` - Manage meal selections
- `GET /api/employee/my-selections/` - View selection history
- `GET/POST /api/employee/work-status/` - Manage work status

### Admin
- `GET /api/admin/menu/` - List all menu items
- `POST /api/admin/menu/add/` - Add menu item
- `PUT/DELETE /api/admin/menu/{id}/` - Update/delete menu item
- `GET /api/admin/reports/` - Daily reports
- `GET /api/admin/work-status-report/` - Work status reports
- `POST /api/admin/demo-notification/` - Test notification system
- `GET /api/admin/users/` - User management (Super admin)

## Database Schema

### Models
- **User** - Django's built-in user model with roles
- **Menu** - Menu items with meal types and pricing
- **MealSelection** - User meal selections with dates
- **WorkStatus** - Employee work location status (Office/WFH/Sick/Leave)

## Features Comparison

| Feature | Web App | Mobile App |
|---------|---------|------------|
| Authentication | ✅ | ✅ |
| Menu Selection | ✅ | ✅ |
| Work Status Management | ✅ | ✅ |
| Smart Notifications | ✅ | ✅ |
| Admin Dashboard | ✅ | ✅ |
| Menu Management | ✅ | ✅ |
| Reports | ✅ | ✅ |
| Work Status Reports | ✅ | ✅ |
| Selection History | ✅ | ✅ |
| Push Notifications | ❌ | ✅ |
| Offline Support | ❌ | ✅ |
| Native UI | ❌ | ✅ |

## Deployment

### Backend
- Deploy Django to platforms like Heroku, AWS, or DigitalOcean
- Configure PostgreSQL database
- Set up static file serving

### Web App
- Build: `npm run build`
- Deploy to Netlify, Vercel, or AWS S3

### Mobile App
- Build APK/IPA: `expo build`
- Publish to App Store/Google Play
- Or use Expo's OTA updates

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - see LICENSE file for details

---

**Built with ❤️ by CodeRankers Team**
