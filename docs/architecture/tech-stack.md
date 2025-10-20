# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Mobile Language** | TypeScript | 5.3+ | Type-safe mobile app development | Catches errors at compile time, excellent IDE support, required for shared types |
| **Mobile Framework** | React Native | 0.73.6 | Cross-platform mobile UI framework | iOS + Android from single codebase, large ecosystem, mature Firebase integration |
| **Mobile Runtime** | Expo SDK | 50 | Managed React Native workflow | Simplifies development, OTA updates, easy native module integration, faster iteration |
| **UI Component Library** | React Native Paper | 5.x | Material Design components | Per PRD requirement, WCAG AA support, well-maintained, works seamlessly with Expo |
| **State Management** | React Context API | Built-in | Global state (auth, messages, network) | Per PRD requirement, no external deps, sufficient for MVP scope, easy to test |
| **Navigation** | React Navigation | 6.x | Screen navigation and routing | Industry standard for RN, TypeScript support, deep linking ready |
| **Backend Language** | TypeScript | 5.3+ | Cloud Functions development | Type safety, shared types with mobile app, excellent Firebase SDK support |
| **Backend Framework** | Firebase Cloud Functions | Gen 2 | Serverless functions (push notifications) | Event-driven, auto-scaling, integrated with Firebase ecosystem |
| **API Style** | Direct Firebase SDK | N/A | No REST/GraphQL layer | Firebase SDK provides optimized real-time queries, eliminates custom API server |
| **Database** | Cloud Firestore | Latest | Real-time NoSQL document database | Built-in offline support, real-time listeners, automatic scaling, optimistic locking |
| **Cache** | AsyncStorage | @react-native-async-storage/async-storage 1.x | Local message persistence | Simple key-value store, sufficient for message cache and offline queue |
| **File Storage** | Firebase Storage | Latest | Image upload and hosting | Integrated with Firebase Auth, CDN-backed, client-side upload support |
| **Authentication** | Firebase Authentication | Latest | User auth (email/password) | Per PRD requirement, built-in security, session management, easy integration |
| **Mobile Testing** | Jest + React Native Testing Library | Jest 29.x, RNTL 12.x | Unit and integration tests | Standard React Native testing stack, component testing, mocking support |
| **Backend Testing** | Jest + Firebase Emulator | Jest 29.x | Cloud Functions unit tests | Local testing without Firebase calls, fast test execution |
| **E2E Testing** | Detox | 20.x | End-to-end mobile testing | Deferred to post-MVP per PRD, noted for future |
| **Build Tool** | Expo CLI | 0.17+ | Mobile app build and deployment | Manages native builds, OTA updates, EAS Build integration |
| **Bundler** | Metro | Built-in with RN | JavaScript bundling for React Native | Default RN bundler, optimized for mobile |
| **IaC Tool** | Firebase CLI | 13.x | Infrastructure deployment | Deploys Functions, Firestore rules, Storage rules via command line |
| **CI/CD** | GitHub Actions | N/A | Deferred to post-MVP | Manual deployment acceptable for MVP timeline |
| **Monitoring** | Firebase Crashlytics | Latest | Deferred to post-MVP | Per PRD analytics decision, crash reporting added later |
| **Logging** | console + Firebase Functions Logs | Built-in | Basic logging via console, Functions logs in GCP | Sufficient for MVP, structured logging deferred |
| **Image Handling** | expo-image-picker | ~14.x | Camera/gallery access | Per PRD image upload requirement, built-in compression |
| **Push Notifications** | expo-notifications + FCM | ~0.27.x | Foreground notifications | Per PRD FR11, Expo wrapper around native APIs |
| **Network State** | @react-native-community/netinfo | 11.x | Detect online/offline status | Required for offline queue (Story 2.3), reliable connection detection |
| **Form Validation** | React Hook Form | 7.x | Input validation (auth, profile) | Lightweight, TypeScript support, integrates with React Native Paper |
