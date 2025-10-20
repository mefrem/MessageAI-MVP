# Development Workflow

## Prerequisites

```bash
# Install Node.js 18+
node --version

# Install Expo CLI
npm install -g expo-cli

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

## Initial Setup

```bash
# Clone repository and install dependencies
git clone <repo-url>
cd messageai
npm install

# Install mobile dependencies
cd mobile && npm install && cd ..

# Install functions dependencies
cd functions && npm install && cd ..

# Configure Firebase
firebase init

# Start Firebase emulators (optional for local development)
firebase emulators:start
```

## Development Commands

```bash
# Start mobile app
npm run mobile
# or
cd mobile && expo start

# Start Cloud Functions emulator
npm run functions:serve
# or
cd functions && npm run serve

# Deploy Cloud Functions
npm run functions:deploy
# or
cd functions && npm run deploy

# Run tests
npm run test

# Run mobile tests
cd mobile && npm test

# Run functions tests
cd functions && npm test
```

## Environment Configuration

```bash
# Mobile app (.env - create in /mobile directory)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloud Functions (functions/.env)
# No additional env vars needed for MVP - Firebase Admin SDK uses default credentials
```
