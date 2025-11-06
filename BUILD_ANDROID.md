# Build Android APK - Karmic Canteen App

## Prerequisites
1. **Node.js** installed
2. **Expo CLI** installed: `npm install -g @expo/cli`
3. **EAS CLI** installed: `npm install -g eas-cli`

## Quick Build Commands

### Option 1: Expo Development Build (Recommended)
```bash
# Navigate to project directory
cd karmic-canteen-app

# Install dependencies
npm install

# Build APK for Android
npx expo build:android --type apk

# Or use EAS Build (newer method)
eas build --platform android --profile preview
```

### Option 2: Local Build with Expo
```bash
# Start Expo development server
npx expo start

# In Expo Dev Tools, select "Build" > "Android APK"
```

## Build Configuration

### 1. Update app.json for Android
```json
{
  "expo": {
    "name": "Karmic Canteen",
    "slug": "karmic-canteen",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.coderankers.karmiccanteen",
      "versionCode": 1,
      "permissions": [
        "NOTIFICATIONS",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      "icon": "./assets/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#667eea"
      }
    }
  }
}
```

### 2. Create eas.json for EAS Build
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

## Features Included in Android Build

### ✅ Core Features
- **Employee Login/Signup**
- **Menu Selection (Breakfast, Lunch, Snacks)**
- **Real-time Selection Updates**
- **Admin Dashboard**
- **Menu Management**
- **User Management (Superuser)**
- **Reports & Analytics**

### ✅ Android-Specific Features
- **Push Notifications**
- **Background Notifications**
- **Pull-to-Refresh**
- **Auto-refresh on Focus**
- **Offline Storage (AsyncStorage)**
- **Network State Detection**

### ✅ UI/UX Features
- **Material Design Components**
- **Gradient Backgrounds**
- **Smooth Animations**
- **Touch Feedback**
- **Loading States**
- **Error Handling**

## Build Steps

### Step 1: Prepare Project
```bash
cd karmic-canteen-app
npm install
```

### Step 2: Update Configuration
- Update `app.json` with Android settings
- Ensure all dependencies are compatible
- Test on Android emulator first

### Step 3: Build APK
```bash
# Method 1: Expo Build
npx expo build:android --type apk

# Method 2: EAS Build (Recommended)
eas login
eas build --platform android --profile preview
```

### Step 4: Download APK
- Check build status: `eas build:list`
- Download APK from Expo dashboard
- Install on Android device

## Testing on Android

### 1. Android Emulator
```bash
# Start Android emulator
npx expo start --android
```

### 2. Physical Device
```bash
# Install Expo Go app on Android
# Scan QR code from expo start
npx expo start
```

## APK Installation

### Install APK on Android Device
1. **Enable Unknown Sources** in Android settings
2. **Transfer APK** to device
3. **Tap APK file** to install
4. **Grant Permissions** when prompted

## Production Build

### For Google Play Store
```bash
# Create production build
eas build --platform android --profile production

# Generate signed AAB
eas build --platform android --profile production --auto-submit
```

## Troubleshooting

### Common Issues
1. **Build Fails**: Check dependencies in package.json
2. **Permissions**: Ensure all required permissions in app.json
3. **Network**: Update API base URL for production
4. **Icons**: Ensure icon files exist in assets folder

### Debug Commands
```bash
# Check build logs
eas build:list
eas build:view [build-id]

# Test locally
npx expo start --android
```

## Final APK Features

### 📱 Employee Features
- Menu browsing with real-time updates
- Meal selection with deadline enforcement
- Selection history with auto-refresh
- Push notifications for reminders
- Offline capability

### 👨‍💼 Admin Features
- Complete menu management (CRUD)
- Daily reports and analytics
- User management (Superuser only)
- Real-time statistics
- Server status monitoring

### 🔔 Notification Features
- Daily reminders at 6:00 PM
- Selection check at 8:30 PM
- Personalized notifications for empty selections
- Background notification scheduling
- User-configurable notification settings

The Android APK will include all these features and work seamlessly on Android devices!