# Quick Start Guide

## 1. Update API URL
Edit `src/services/api.js` line 4:
```javascript
const BASE_URL = 'http://YOUR_DJANGO_SERVER_IP:8000/api';
```

## 2. Start Development Server
```bash
npm start
```

## 3. Test the App
- Scan QR code with Expo Go app (Android/iOS)
- Or press 'w' for web version

## 4. Test Credentials
Use these test credentials (coordinate with Django teammate):
- Employee: username: `emp001`, password: `test123`
- Admin: username: `admin`, password: `admin123`

## 5. Key Features to Test
- Login with employee/admin credentials
- View menu (employee)
- Select meals (employee)
- Manage menu items (admin)
- View reports (admin)

## Next Steps
1. Share `API_ENDPOINTS.md` with Django teammate
2. Test API integration once backend is ready
3. Configure push notifications for production