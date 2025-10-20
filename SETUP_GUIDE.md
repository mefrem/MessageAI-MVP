# MessageAI Setup Guide

Quick setup guide to get MessageAI running locally.

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase Project

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Email/Password auth, Firestore, Storage, and Cloud Messaging

### 3. Configure Environment

Copy the example file:

```bash
cp mobile/.env.example mobile/.env
```

Add your Firebase config to `mobile/.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Deploy Firebase Configuration

Create `.firebaserc`:

```bash
cp .firebaserc.example .firebaserc
```

Edit `.firebaserc` with your project ID.

Deploy rules:

```bash
firebase login
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Deploy Cloud Functions (Optional for testing)

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### 6. Run the App

```bash
npm run mobile
```

Press `i` for iOS simulator or `a` for Android emulator.

## Testing Checklist

After setup, test these core features:

- [ ] Sign up with email/password
- [ ] Create profile with name and photo
- [ ] Start a new one-on-one chat
- [ ] Send text messages
- [ ] Send image messages
- [ ] Create a group chat
- [ ] Test offline mode (airplane mode)
- [ ] Verify messages queue and send when back online

## Common Issues

### "Permission denied" errors

- Make sure you deployed Firestore rules: `firebase deploy --only firestore:rules`

### Push notifications not working

- FCM requires either:
  - APNs certificates for iOS (production)
  - Expo Go app (development)

### Metro bundler issues

```bash
cd mobile
rm -rf node_modules .expo
npm install
expo start --clear
```

## File Structure

```
MVP-2/
├── mobile/        # React Native app - run with "npm run mobile"
├── functions/     # Cloud Functions - deploy with "firebase deploy --only functions"
├── shared/        # Shared TypeScript types
├── firestore.rules      # Deploy with "firebase deploy --only firestore:rules"
├── storage.rules        # Deploy with "firebase deploy --only storage"
└── README.md            # Full documentation
```

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Review [docs/architecture.md](docs/architecture.md) for system design
3. Check [docs/prd.md](docs/prd.md) for feature requirements

## Support

For detailed instructions, see the main [README.md](README.md) file.
