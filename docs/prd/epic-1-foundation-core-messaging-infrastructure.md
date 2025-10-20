# Epic 1: Foundation & Core Messaging Infrastructure

**Goal:** Establish the complete project foundation including monorepo setup, Firebase backend configuration, React Native mobile app with Expo, user authentication, and basic one-on-one messaging with real-time delivery. By the end of this epic, two users can create accounts, log in, and exchange text messages in real-time, proving the core infrastructure works end-to-end.

## Story 1.1: Project Setup & Monorepo Initialization

As a developer,
I want a properly configured monorepo with React Native app and Firebase Functions,
so that I have a solid foundation for building the messaging app.

### Acceptance Criteria

1. Monorepo created with folder structure: `/mobile` (React Native + Expo) and `/functions` (Firebase Cloud Functions)
2. TypeScript configured for both mobile and functions with shared tsconfig base
3. Package.json scripts set up for running mobile app (`npm run mobile`) and deploying functions (`npm run deploy:functions`)
4. Git repository initialized with appropriate .gitignore files for Node modules, Expo cache, and Firebase secrets
5. README.md created with setup instructions and architecture overview
6. All dependencies installed and verified working (Expo CLI, Firebase CLI, Node modules)
7. Project successfully builds and Expo development server starts without errors

## Story 1.2: Firebase Backend Configuration

As a developer,
I want Firebase project configured with Firestore, Auth, Storage, and Cloud Functions,
so that the backend services are ready for the mobile app to integrate.

### Acceptance Criteria

1. Firebase project created in Firebase Console with appropriate name and configuration
2. Firestore database initialized in production mode with initial security rules allowing authenticated access
3. Firebase Authentication enabled with Email/Password provider configured
4. Firebase Storage bucket created with security rules allowing authenticated users to upload images
5. Firebase Cloud Messaging (FCM) enabled for push notifications
6. Firebase configuration files (google-services.json, firebase-config.js) added to mobile app
7. Firebase Admin SDK initialized in Cloud Functions with proper service account credentials
8. `firebase.json` configured with Firestore rules, Storage rules, and Functions deployment settings
9. Test Cloud Function deployed successfully and callable from Firebase Console

## Story 1.3: React Native App Initialization with Expo

As a developer,
I want a React Native app created with Expo and essential dependencies,
so that I can start building the mobile UI.

### Acceptance Criteria

1. Expo managed workflow app created with TypeScript template in `/mobile` directory
2. React Native Paper installed and ThemeProvider configured in App.tsx
3. React Navigation installed with stack and bottom tab navigators configured
4. Firebase JavaScript SDK v9+ installed and initialized with project configuration
5. AsyncStorage installed for local data persistence
6. Expo image picker and Expo notifications libraries installed
7. App runs successfully on iOS simulator showing a placeholder home screen
8. TypeScript compilation passes with no errors
9. Development environment supports hot reload and fast refresh

## Story 1.4: User Authentication UI & Firebase Auth Integration

As a user,
I want to sign up and log in with email and password,
so that I can access the messaging app with my personal account.

### Acceptance Criteria

1. Authentication screen created with email and password input fields using React Native Paper components
2. "Sign Up" and "Log In" tabs or toggle implemented to switch between registration and login modes
3. Firebase Auth `createUserWithEmailAndPassword()` integrated for new user registration
4. Firebase Auth `signInWithEmailAndPassword()` integrated for existing user login
5. Auth state managed via React Context, persisting current user across app restarts
6. Email validation implemented (proper email format required)
7. Password validation implemented (minimum 6 characters)
8. Error handling displays user-friendly messages for auth failures (wrong password, email already in use, network errors)
9. Loading states shown during async auth operations
10. On successful auth, user navigates to Conversation List screen
11. "Log Out" functionality implemented accessible from Profile/Settings screen

## Story 1.5: User Profile Creation & Management

As a user,
I want to set my display name and profile picture,
so that other users can identify me in conversations.

### Acceptance Criteria

1. Profile setup screen shown immediately after first-time registration prompting for display name and profile picture
2. Display name input field with validation (2-50 characters, required)
3. Profile picture selection using Expo ImagePicker with camera and gallery options
4. Default avatar/placeholder image provided if user skips profile picture selection
5. Profile data stored in Firestore `/users/{userId}` document with fields: `displayName`, `photoURL`, `email`, `createdAt`
6. Profile picture uploaded to Firebase Storage at path `/profiles/{userId}/avatar.jpg` with client-side compression
7. Profile/Settings screen accessible from main navigation allowing users to update display name and profile picture
8. Profile updates sync to Firestore and reflect immediately in the UI
9. User profile data loads from Firestore on app launch and populates Context state

## Story 1.6: Conversation List Screen

As a user,
I want to see a list of my conversations,
so that I can access my chats and start new conversations.

### Acceptance Criteria

1. Conversation List screen created as the main home screen after authentication
2. Screen displays list of user's conversations with most recent at the top
3. Each conversation list item shows: other participant's display name, profile picture, last message preview (truncated to 1 line), and timestamp of last message
4. Empty state displayed when user has no conversations with helpful message ("No conversations yet. Start chatting!")
5. "New Conversation" button (FAB or header button) navigates to user selection screen
6. Conversations fetched from Firestore using real-time listener on `/conversations` collection filtered by current user ID
7. Conversation list updates in real-time when new messages arrive in any conversation
8. Pull-to-refresh gesture implemented to manually refresh conversation list
9. Loading state shown while initial conversations are fetching

## Story 1.7: User Discovery & Starting New Conversations

As a user,
I want to browse available users and start a new conversation,
so that I can message other people in the app.

### Acceptance Criteria

1. User selection screen displays list of all registered users (excluding current user)
2. Each user list item shows display name and profile picture
3. Search/filter functionality allows finding users by display name
4. Tapping a user creates a new one-on-one conversation or navigates to existing conversation if one already exists
5. Conversation document created in Firestore `/conversations/{conversationId}` with fields: `participants` (array of user IDs), `type` ('oneOnOne'), `createdAt`, `lastMessageAt`, `lastMessage`
6. Duplicate conversation prevention: Check if conversation between two users already exists before creating new one
7. After creating/selecting conversation, user navigates to Chat View screen
8. User list fetched from Firestore `/users` collection ordered by display name

## Story 1.8: One-on-One Chat View with Real-Time Messages

As a user,
I want to send and receive text messages in real-time with another user,
so that I can have a conversation.

### Acceptance Criteria

1. Chat View screen displays conversation header with other participant's name and profile picture
2. Message list displays all messages in chronological order (oldest at top, newest at bottom) with auto-scroll to newest message
3. Each message bubble shows message text and timestamp
4. Current user's messages appear on right side with distinct styling; other participant's messages on left
5. Text input field at bottom of screen with "Send" button
6. Sending a message: On button press, message text saved to Firestore `/conversations/{conversationId}/messages/{messageId}` with fields: `text`, `senderId`, `timestamp`, `status` ('sent')
7. Messages fetched using Firestore real-time listener (onSnapshot) on messages subcollection, ordered by timestamp
8. New messages appear instantly for both sender and recipient when online
9. Message input clears after successful send
10. Keyboard handling: Chat view adjusts when keyboard appears, keeping input field visible
11. Empty state shown when conversation has no messages
12. Each message displays formatted timestamp (e.g., "2:30 PM" for today, "Yesterday" for yesterday, "MM/DD/YY" for older)

## Story 1.9: Online/Offline Presence Indicators

As a user,
I want to see when other users are online or offline,
so that I know if they're available to chat.

### Acceptance Criteria

1. User's online status tracked in Firestore `/users/{userId}/status` with fields: `state` ('online'/'offline'), `lastSeen` (timestamp)
2. User marked "online" when app is in foreground and Firebase connection is active
3. User marked "offline" when app is backgrounded or closed, using Firestore `onDisconnect()` trigger
4. Presence indicator shown in conversation header (green dot for online, gray dot for offline, or "Last seen X minutes ago")
5. Presence indicator shown in Conversation List next to each participant
6. Presence status updates in real-time via Firestore listeners
7. "Online" status appears within 2-3 seconds of user opening the app
8. "Last seen" timestamp formatted as relative time ("2 minutes ago", "1 hour ago", "Yesterday")
