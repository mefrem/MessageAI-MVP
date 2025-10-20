# MessageAI Architecture Notes

## Key Design Decisions

### 1. Serverless Architecture with Firebase

**Decision:** Use Firebase services instead of custom backend servers.

**Rationale:**

- Eliminates server management and scaling concerns
- Built-in real-time sync via Firestore listeners
- Automatic authentication and authorization
- Global CDN for file storage
- Pay-per-use pricing model

**Trade-offs:**

- Vendor lock-in to Firebase/GCP
- Limited customization of backend logic
- Firestore query limitations vs SQL

### 2. Direct Client-to-Firebase Integration

**Decision:** Mobile app communicates directly with Firebase services, no API gateway.

**Rationale:**

- Reduces latency (fewer network hops)
- Leverages Firebase SDK's offline capabilities
- Simplifies architecture (no API layer to maintain)
- Firebase security rules provide granular access control

**Trade-offs:**

- Business logic distributed between client and Cloud Functions
- Harder to implement complex backend workflows
- Client bundle size includes Firebase SDK

### 3. Offline-First Mobile Pattern

**Decision:** Implement local-first architecture with AsyncStorage, optimistic UI, and message queue.

**Rationale:**

- Critical for messaging reliability (per PRD requirements)
- Enables instant UI updates
- Graceful degradation in poor network conditions
- Message persistence across app restarts

**Implementation:**

```
Message Send Flow:
1. Add message to local state (optimistic)
2. Save to AsyncStorage
3. Check network connectivity
   - Online: Send to Firestore
   - Offline: Add to queue
4. On network restore: Process queue with retry logic
```

### 4. React Context API for State Management

**Decision:** Use React Context instead of Redux or MobX.

**Rationale:**

- Sufficient for MVP scope
- No external dependencies
- Built into React
- Easy to test and reason about

**Contexts:**

- `AuthContext`: Current user, auth methods
- `ConversationsContext`: Conversation list, creation
- `MessagesContext`: Messages by conversation, sending
- `NetworkContext`: Online/offline state

### 5. Real-Time Sync with Firestore Listeners

**Decision:** Use Firestore `onSnapshot` for real-time updates.

**Rationale:**

- Native Firebase feature (no WebSockets to manage)
- Automatic reconnection handling
- Works seamlessly with offline mode
- Low latency message delivery

**Pattern:**

```typescript
onSnapshot(messagesRef, (snapshot) => {
  const messages = snapshot.docs.map((doc) => doc.data());
  updateState(messages);
});
```

### 6. Monorepo with Shared Types

**Decision:** Single repository with npm workspaces, shared TypeScript types.

**Rationale:**

- Type safety between mobile app and Cloud Functions
- Atomic commits for features spanning client/backend
- Simplified dependency management
- Single source of truth for data models

**Structure:**

```
/shared       - TypeScript types and constants
/mobile       - React Native app
/functions    - Cloud Functions
```

### 7. Message Queue with Exponential Backoff

**Decision:** Implement persistent queue with retry logic for failed sends.

**Rationale:**

- Ensures message delivery even after app restart
- Gracefully handles temporary network issues
- Prevents overwhelming server with retries

**Algorithm:**

```
Retry delays: 1s, 2s, 4s
Max retries: 3
Queue storage: AsyncStorage (survives app restart)
```

## Data Flow Diagrams

### Sending a Message

```
User Input
    ↓
ChatInput Component
    ↓
MessagesContext.sendTextMessage()
    ↓
messageService.sendTextMessage()
    ↓
├─→ Optimistic UI Update (immediate)
├─→ Check Network Status
│   ├─→ Online: Write to Firestore
│   └─→ Offline: Add to Queue (AsyncStorage)
└─→ Update Conversation lastMessage
```

### Receiving a Message

```
Firestore (new message written)
    ↓
onSnapshot listener fires
    ↓
MessagesContext updates state
    ↓
ChatScreen re-renders
    ↓
MessageBubble displays new message
    ↓
(if sender !== currentUser)
    └─→ Mark as read
        └─→ Update Firestore message status
```

### Offline Queue Processing

```
Network connectivity restored
    ↓
NetInfo event fires
    ↓
offlineQueueService.processQueue()
    ↓
For each queued message:
    ├─→ Attempt send to Firestore
    ├─→ Success: Remove from queue
    └─→ Failure: Increment retry count
        ├─→ < 3 retries: Wait (exponential backoff)
        └─→ >= 3 retries: Mark as failed
```

## Security Model

### Firestore Rules

**Principle:** Users can only access data they're participants in.

Key rules:

- Users collection: Read all, write own profile only
- Conversations: Read/write only if in participants array
- Messages: Read/write only if in parent conversation's participants
- Presence: Read all, write own status only

### Storage Rules

**Principle:** Authenticated users can upload, with file size and type restrictions.

Key rules:

- Profile images: Public read, owner write
- Message images: Authenticated read/write
- Max file size: 10MB
- Allowed types: image/\*

## Performance Optimizations

### 1. Message List Virtualization

- FlatList with `windowSize` optimization
- Only renders visible messages
- Handles 1000+ messages efficiently

### 2. Image Compression

- Client-side compression before upload
- Max width: 1920px
- JPEG quality: 80%
- Reduces bandwidth and storage costs

### 3. Local Caching

- Messages cached in AsyncStorage
- User profiles cached after first fetch
- Instant load on app restart

### 4. Denormalized Data

- `lastMessage` stored in Conversation document
- Avoids querying messages subcollection for preview
- Trade-off: Write twice (message + conversation update)

### 5. Firestore Indexes

- Composite index on `participants + lastMessageAt`
- Enables efficient conversation list queries
- Auto-created by Firebase based on firestore.indexes.json

## Testing Strategy

### Unit Tests

- Services (messageService, authService, etc.)
- Utility functions (validators, formatters)
- Custom hooks

### Integration Tests

- Firebase interactions with emulators
- Message sending flow
- Offline queue processing
- Read receipts logic

### Manual Testing Scenarios (from PRD)

1. Real-time messaging between 2 devices
2. Offline message queueing and sending
3. App backgrounding and notifications
4. Force-quit persistence
5. Airplane mode testing
6. Rapid-fire messaging (20+ messages)
7. Poor network conditions (3G simulation)

## Scalability Considerations

### Current Architecture (MVP)

- Single Firestore database
- us-central1 Cloud Functions region
- No caching layer
- Direct client-to-Firestore reads

**Scales to:** ~10K concurrent users, millions of messages

### Future Enhancements for Scale

1. **Firestore Multi-Region:** Replicate data globally
2. **Cloud CDN:** Cache Storage files
3. **Message Pagination:** Limit messages loaded per conversation
4. **Cloud Functions Gen 2:** Better cold start performance
5. **Firebase Realtime Database:** For presence (better than Firestore for high-frequency writes)

## Known Limitations (MVP)

1. **Push Notifications:** Foreground only (iOS needs APNs certs for background)
2. **iOS Only:** Android requires additional setup
3. **No Message Search:** Would need Algolia or Cloud Functions
4. **No End-to-End Encryption:** Would require crypto library integration
5. **No Message Editing/Deletion:** Would need UI + Firestore updates
6. **Limited Group Management:** Can't remove members
7. **No Voice/Video:** Requires WebRTC integration

## Deployment Checklist

Before production deployment:

- [ ] Set up Firebase project with production settings
- [ ] Configure APNs certificates for iOS push notifications
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules
- [ ] Deploy Cloud Functions
- [ ] Create Firestore indexes
- [ ] Set up monitoring and alerts
- [ ] Configure Firebase App Check (bot protection)
- [ ] Test with real devices on cellular network
- [ ] Perform security audit
- [ ] Load test with multiple users
- [ ] Set up CI/CD pipeline
- [ ] Configure analytics (Firebase Analytics or custom)

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
