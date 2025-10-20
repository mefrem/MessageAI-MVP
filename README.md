# MessageAI - Production-Quality Messaging App

A WhatsApp-level messaging application built with React Native, Expo, and Firebase, featuring real-time messaging, offline support, group chats, and image sharing.

## 🚀 Features

### Core Messaging

- ✅ Real-time one-on-one messaging
- ✅ Group chat with 3+ participants
- ✅ Message delivery states (sending, sent, delivered, read)
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Image sharing

### Reliability

- ✅ Offline message queueing
- ✅ Optimistic UI updates
- ✅ Local message persistence (AsyncStorage)
- ✅ Automatic retry with exponential backoff
- ✅ Network state monitoring

### User Features

- ✅ Email/password authentication
- ✅ User profiles with display names and photos
- ✅ Online/offline presence indicators
- ✅ Push notifications (foreground)

## 📦 Tech Stack

### Mobile App

- **Framework:** React Native with Expo (SDK 50)
- **Language:** TypeScript 5.3+
- **UI Library:** React Native Paper (Material Design)
- **Navigation:** React Navigation 6
- **State Management:** React Context API
- **Local Storage:** AsyncStorage
- **Network:** NetInfo

### Backend

- **Platform:** Firebase (Google Cloud Platform)
- **Database:** Cloud Firestore (real-time NoSQL)
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Functions:** Cloud Functions (Node.js 18)
- **Notifications:** Firebase Cloud Messaging (FCM)

### Architecture

- **Pattern:** Serverless BaaS with direct client-to-Firebase integration
- **Repository:** Monorepo with npm workspaces
- **Structure:** `/mobile`, `/functions`, `/shared`

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **Expo CLI:** Latest version (`npm install -g expo-cli`)
- **Firebase CLI:** Latest version (`npm install -g firebase-tools`)
- **Xcode:** (for iOS development) Latest version with iOS Simulator
- **Git:** For version control

## 📋 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MVP-2
```

### 2. Install Dependencies

```bash
# Install root dependencies and all workspace packages
npm install
```

This will install dependencies for:

- Root workspace
- Mobile app (`/mobile`)
- Cloud Functions (`/functions`)
- Shared types (`/shared`)

### 3. Firebase Project Setup

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "messageai-prod")
4. Enable Google Analytics (optional)
5. Create project

#### 3.2 Enable Firebase Services

**Authentication:**

1. Go to Authentication → Sign-in method
2. Enable "Email/Password" provider

**Firestore Database:**

1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location (e.g., us-central)

**Storage:**

1. Go to Storage
2. Click "Get started"
3. Start in **production mode**

**Cloud Messaging:**

1. Go to Cloud Messaging
2. FCM is automatically enabled

#### 3.3 Register iOS App

1. Go to Project Settings → General
2. Click "Add app" → iOS
3. Enter iOS bundle ID: `com.messageai.app`
4. Download `GoogleService-Info.plist`
5. Place it in `/mobile/` directory (gitignored)

#### 3.4 Get Firebase Config

1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Click "Add app" (web icon)
4. Copy the config object

#### 3.5 Configure Mobile App

Create `/mobile/.env` file:

```bash
cp mobile/.env.example mobile/.env
```

Edit `mobile/.env` with your Firebase config:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firebase Rules and Functions

#### 4.1 Login to Firebase

```bash
firebase login
```

#### 4.2 Initialize Firebase (if needed)

```bash
firebase init
```

Select:

- Firestore
- Storage
- Functions

Or use existing configuration (already set up in this project).

#### 4.3 Set Firebase Project

Create `.firebaserc` file:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

#### 4.4 Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

#### 4.5 Deploy Storage Rules

```bash
firebase deploy --only storage
```

#### 4.6 Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### 5. Run the Mobile App

#### 5.1 Start Expo Development Server

```bash
npm run mobile
# or
cd mobile && expo start
```

#### 5.2 Run on iOS Simulator

Press `i` in the terminal or run:

```bash
npm run mobile:ios
```

#### 5.3 Run on Physical Device

1. Install "Expo Go" app from App Store
2. Scan QR code from terminal

## 🧪 Testing

### Testing Scenarios (from PRD)

The app is designed to pass these reliability tests:

1. **Real-time chat:** Two devices exchanging 10+ messages show instant delivery
2. **Offline receiving:** Device A offline, Device B sends 5 messages, Device A comes online and receives all
3. **Backgrounded app:** Message sent while app backgrounded shows notification
4. **Force-quit persistence:** App force-quit mid-conversation, reopened, all messages still visible
5. **Airplane mode:** Device in airplane mode, send 3 messages (queued), exit airplane mode, all send
6. **Rapid-fire:** Send 20+ messages quickly, all appear in correct order
7. **Poor network:** Throttled connection, messages send within 5 seconds

### Running Tests

```bash
# Run all tests
npm run test

# Mobile tests
cd mobile && npm test

# Functions tests
cd functions && npm test
```

## 📂 Project Structure

```
messageai/
├── mobile/                      # React Native mobile app
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Generic components (Avatar, StatusIndicator)
│   │   │   ├── chat/            # Chat components (MessageBubble, ChatInput)
│   │   │   └── conversation/    # Conversation list components
│   │   ├── screens/             # Screen components
│   │   │   ├── AuthScreen.tsx
│   │   │   ├── ConversationListScreen.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   ├── UserSelectionScreen.tsx
│   │   │   ├── GroupCreateScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── ProfileSetupScreen.tsx
│   │   ├── contexts/            # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ConversationsContext.tsx
│   │   │   ├── MessagesContext.tsx
│   │   │   └── NetworkContext.tsx
│   │   ├── services/            # Business logic services
│   │   │   ├── authService.ts
│   │   │   ├── conversationService.ts
│   │   │   ├── messageService.ts
│   │   │   ├── offlineQueueService.ts
│   │   │   ├── presenceService.ts
│   │   │   ├── mediaService.ts
│   │   │   ├── notificationService.ts
│   │   │   └── storageService.ts
│   │   ├── navigation/          # React Navigation setup
│   │   ├── utils/               # Utility functions
│   │   └── config/              # Configuration (Firebase)
│   ├── App.tsx                  # Root component
│   ├── app.json                 # Expo configuration
│   └── package.json
├── functions/                   # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts             # Function exports
│   │   ├── triggers/            # Firestore triggers
│   │   │   └── onMessageCreated.ts
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── shared/                      # Shared TypeScript types
│   ├── src/
│   │   ├── types/               # Type definitions
│   │   │   ├── User.ts
│   │   │   ├── Conversation.ts
│   │   │   ├── Message.ts
│   │   │   ├── Presence.ts
│   │   │   └── TypingStatus.ts
│   │   └── constants/           # Shared constants
│   └── package.json
├── docs/                        # Documentation
│   ├── prd.md                   # Product Requirements
│   └── architecture.md          # Architecture Document
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── storage.rules                # Storage security rules
├── package.json                 # Root package.json (workspaces)
└── README.md                    # This file
```

## 🔐 Security

### Firestore Security Rules

The app uses strict security rules:

- Users can only read/write their own profile
- Users can only access conversations they're participants in
- Messages can only be created by participants
- Presence can only be updated by the user themselves

### Storage Security Rules

- Profile pictures: Public read, owner write only
- Group photos: Authenticated read, authenticated write
- Message images: Authenticated read/write

## 🚦 Common Commands

```bash
# Development
npm run mobile              # Start mobile app
npm run mobile:ios          # Run on iOS simulator
npm run mobile:android      # Run on Android emulator

# Firebase
npm run functions:serve     # Run functions locally
npm run functions:deploy    # Deploy functions to Firebase
firebase emulators:start    # Run Firebase emulators

# Testing
npm run test               # Run all tests
npm run test --workspaces  # Run tests in all packages

# Deployment
firebase deploy --only firestore    # Deploy Firestore rules
firebase deploy --only storage      # Deploy Storage rules
firebase deploy --only functions    # Deploy Cloud Functions
```

## 🐛 Troubleshooting

### iOS Build Issues

**Issue:** Xcode build fails

```bash
cd mobile/ios
pod install
cd ../..
npm run mobile:ios
```

### Firebase Connection Issues

**Issue:** Firestore permission denied

- Ensure you've deployed Firestore rules: `firebase deploy --only firestore:rules`
- Check that user is authenticated

**Issue:** Storage upload fails

- Ensure you've deployed Storage rules: `firebase deploy --only storage`
- Check image file size (max 10MB)

### Expo Issues

**Issue:** Metro bundler won't start

```bash
cd mobile
rm -rf node_modules
npm install
expo start --clear
```

### Push Notifications

**Issue:** Notifications not working

- Ensure FCM is enabled in Firebase Console
- Check that `expo-notifications` plugin is in `app.json`
- For iOS: Ensure APNs certificates are configured in Firebase Console

## 📱 Features Roadmap

### MVP (Current)

- ✅ Core messaging infrastructure
- ✅ Offline support and reliability
- ✅ Group chats and media sharing

### Post-MVP

- [ ] AI-enhanced messaging features
- [ ] Voice messages
- [ ] Video calls
- [ ] Message search
- [ ] Message reactions
- [ ] Background/killed app push notifications
- [ ] Android support
- [ ] Web platform
- [ ] Message forwarding
- [ ] User blocking
- [ ] End-to-end encryption

## 🤝 Contributing

This is a demonstration project built according to the PRD and Architecture documents in `/docs`.

## 📄 License

This project is for educational and demonstration purposes.

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the PRD (`/docs/prd.md`) and Architecture (`/docs/architecture.md`)
3. Check Firebase Console for backend errors

## 🎯 Project Goals

From the PRD:

- Deliver a production-quality cross-platform messaging app with WhatsApp-level reliability
- Implement real-time sync capabilities with offline support
- Enable one-on-one and group chat functionality with complete message persistence
- Prove messaging infrastructure solidity through comprehensive testing scenarios

## 📊 Architecture Highlights

- **Serverless Backend:** Firebase eliminates server management
- **Offline-First:** AsyncStorage + optimistic UI + message queue = reliable messaging
- **Real-Time Sync:** Firestore listeners provide instant message delivery
- **Type Safety:** Shared TypeScript types between mobile and functions
- **Scalable:** Firebase auto-scales with user growth

---

**Built with ❤️ using React Native, Expo, and Firebase**
