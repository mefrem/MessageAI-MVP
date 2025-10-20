# Technical Assumptions

## Repository Structure

**Monorepo** - A single repository containing both the React Native mobile app and Firebase Cloud Functions backend code. This simplifies version management, enables atomic commits across frontend/backend changes, and streamlines the development workflow for a small team or solo developer working on MVP.

## Service Architecture

**Serverless Monolith within Monorepo** - The backend uses Firebase services (Firestore, Cloud Functions, Auth, FCM) providing serverless infrastructure without managing servers. The mobile app is a monolithic React Native application. This architecture prioritizes rapid MVP development and leverages Firebase's built-in real-time sync, authentication, and push notification capabilities. Cloud Functions will be structured for future AI feature integration (post-MVP).

## Testing Requirements

**Unit + Integration Testing** - Implement unit tests for critical business logic (message queueing, offline sync, optimistic updates) and integration tests for Firebase interactions (Firestore queries, Auth flows, message delivery). Focus testing on the core reliability requirements from the Project Brief testing scenarios:
- Message persistence across app restarts
- Offline message queueing and sending
- Optimistic UI state management
- Real-time sync with Firestore
- Group chat message attribution

Manual testing remains critical for UI/UX validation and end-to-end messaging flows across multiple devices.

## Additional Technical Assumptions and Requests

- **React Native with Expo (Managed Workflow):** Use Expo's managed workflow to maximize development speed and simplify iOS deployment/testing. Expo provides out-of-the-box support for push notifications, image handling, and device testing.

- **Firebase SDK Integration:** Use Firebase JavaScript SDK v9+ (modular SDK) for optimized bundle size and tree-shaking support.

- **Local State Management:** Implement local message persistence using AsyncStorage or a lightweight SQLite solution (expo-sqlite) to support offline access and message history.

- **Real-time Listeners:** Use Firestore real-time listeners (onSnapshot) for live message updates, presence indicators, and typing status.

- **Optimistic UI Pattern:** Implement a message queueing system with local-first writes that immediately update UI, then sync to Firestore with retry logic for failed sends.

- **Image Storage:** Use Firebase Storage for image uploads with client-side compression before upload to optimize bandwidth.

- **TypeScript:** Use TypeScript for type safety across React Native components and Firebase Cloud Functions to reduce runtime errors and improve developer experience.

- **Development Environment:** Assumes developer has Node.js, npm/yarn, Expo CLI, and Xcode (for iOS simulator) installed and configured.

- **State Management:** Use React Context API with useReducer for global state management (current user, conversations, message queue, online/offline status). This avoids third-party state management libraries for MVP while providing sufficient structure for the application's state needs.

- **UI Component Library:** Use React Native Paper (Material Design components) to accelerate UI development with consistent, accessible, and well-tested components that work seamlessly with Expo.

- **Analytics:** Deferred to post-MVP. Focus on core messaging functionality and reliability rather than usage analytics.
