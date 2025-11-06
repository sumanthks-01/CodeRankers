# React Native Expo Project Structure

```
karmic-canteen-app/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
└── src/
    ├── screens/                    # All screen components
    │   ├── auth/
    │   │   └── LoginScreen.js
    │   ├── employee/
    │   │   ├── MenuScreen.js
    │   │   └── SelectionsScreen.js
    │   └── admin/
    │       ├── AdminDashboard.js
    │       ├── MenuManagement.js
    │       └── ReportsScreen.js
    ├── components/                 # Reusable UI components
    │   ├── common/
    │   │   ├── Button.js
    │   │   └── Input.js
    │   └── menu/
    │       └── MenuItem.js
    ├── navigation/                 # Navigation configuration
    │   ├── AppNavigator.js
    │   ├── AuthNavigator.js
    │   └── AdminNavigator.js
    ├── services/                   # API and external services
    │   ├── api.js                  # Axios configuration
    │   ├── authService.js          # Authentication API calls
    │   ├── menuService.js          # Menu-related API calls
    │   └── notificationService.js  # Push notifications
    ├── context/                    # React Context for state management
    │   └── AuthContext.js
    └── utils/                      # Utility functions
        ├── constants.js
        └── helpers.js
```