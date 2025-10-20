# Requirements

## Functional

- **FR1:** Users can create accounts and authenticate using Firebase Auth with profile pictures and display names
- **FR2:** Users can initiate and participate in one-on-one chat conversations with real-time message delivery
- **FR3:** Users can send and receive text messages with timestamps visible for each message
- **FR4:** Users can send and receive images within chat conversations (basic media support)
- **FR5:** Users can create and participate in group chat conversations supporting 3+ users
- **FR6:** Messages display delivery states indicating sending, sent, delivered, and read status
- **FR7:** Users can see read receipts showing when their messages have been read by recipients
- **FR8:** Users can see online/offline presence indicators for their contacts
- **FR9:** Users can see typing indicators when other users are composing messages
- **FR10:** Messages persist locally and survive app restarts, allowing offline access to chat history
- **FR11:** Users receive push notifications for new messages (foreground notifications required for MVP)
- **FR12:** Messages sent while offline queue and automatically send when connectivity returns
- **FR13:** The app implements optimistic UI updates showing messages immediately before server confirmation
- **FR14:** Messages never get lost - if the app crashes mid-send, messages still deliver after restart

## Non Functional

- **NFR1:** Messages appear instantly for online recipients with real-time synchronization
- **NFR2:** The app gracefully handles poor network conditions including 3G, packet loss, and intermittent connectivity
- **NFR3:** The app supports rapid-fire messaging scenarios with 20+ messages sent quickly without degradation
- **NFR4:** Message delivery remains reliable during app backgrounding and force-quit scenarios
- **NFR5:** The backend uses Firebase Firestore for real-time database operations
- **NFR6:** The backend uses Firebase Cloud Functions for serverless AI integration capabilities (post-MVP)
- **NFR7:** Push notifications use Firebase Cloud Messaging (FCM)
- **NFR8:** The mobile app is built using React Native with Expo for iOS platform
- **NFR9:** The MVP deploys with backend running and app functional on local emulator/simulator (TestFlight/Expo Go optional)
