# 🚀 Quick Start Guide (5 Minutes)

Get MessageAI running on your iOS simulator in 5 minutes!

## Prerequisites

✅ **Node.js 18+** installed  
✅ **Xcode** installed with iOS Simulator  
✅ **Firebase account** (free tier works great!)

## Step 1: Clone & Install (2 min)

```bash
git clone https://github.com/mefrem/MessageAI-MVP.git
cd MessageAI-MVP
npm install
```

## Step 2: Firebase Setup (2 min)

### Create Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "**Add project**" → Name it → Create project

### Enable Services
3. **Authentication**: Click "Get started" → Enable "Email/Password"
4. **Firestore**: Click "Create database" → Start in **production mode** → Choose location
5. **Storage**: Click "Get started" → Start in **production mode**

### Get Firebase Config
6. Project Settings ⚙️ → General → "Your apps" section
7. Click **Web icon** (</>) → Register app → Copy the config

### Configure App
8. Create environment file:
```bash
cp mobile/.env.example mobile/.env
```

9. Edit `mobile/.env` with your Firebase config values

## Step 3: Deploy Firebase Rules (1 min)

```bash
# Login to Firebase
firebase login

# Set your project ID
# Edit .firebaserc and replace "your-project-id" with your actual Firebase project ID

# Deploy security rules
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Step 4: Seed Test Users (30 sec)

```bash
# Get your Firebase service account key
# Firebase Console → Project Settings → Service Accounts → Generate new private key
# Save as serviceAccountKey.json in project root

# Update the storage bucket in scripts/seedUsers.js (line 12)
# Then run:
cd scripts && node seedUsers.js
```

## Step 5: Run the App! (30 sec)

```bash
cd mobile
npx expo start --ios
```

The iOS simulator will open automatically!

## 🎉 You're Done!

### Test Users (password: `password123` for all)
- alice@test.com
- bob@test.com  
- charlie@test.com

### Quick Test
1. Sign in as Alice on first simulator
2. Open another simulator: `open -a Simulator` → Choose different device
3. Sign in as Bob on second simulator
4. Start chatting!

## ⚡ Pro Tips

**Run on physical device:**
```bash
npx expo start
# Scan QR code with Camera app (iOS)
```

**Clear cache if needed:**
```bash
cd mobile
expo start --clear
```

**View logs:**
```bash
npx react-native log-ios
```

## 🐛 Troubleshooting

**"Permission denied" in Firestore:**
- Make sure you ran: `firebase deploy --only firestore:rules`

**App won't start:**
```bash
cd mobile
rm -rf node_modules
npm install
expo start --clear
```

**Can't connect to Firebase:**
- Double-check your `.env` file has correct values
- Make sure Firebase services are enabled in console

## 📚 Full Documentation

See [README.md](README.md) for complete documentation including:
- Detailed architecture
- All features and capabilities  
- Advanced configuration
- Testing strategies
- Deployment options

---

**Need help?** Check the [Troubleshooting section](README.md#-troubleshooting) in the main README.

