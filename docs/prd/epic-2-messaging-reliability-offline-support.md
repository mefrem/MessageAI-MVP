# Epic 2: Messaging Reliability & Offline Support

**Goal:** Transform the basic messenger into a production-quality app by implementing message persistence, optimistic UI updates, offline message queueing, delivery states, read receipts, typing indicators, and push notifications. By the end of this epic, the app handles all reliability testing scenarios including poor network conditions, app backgrounding, force-quit, and offline usage.

## Story 2.1: Local Message Persistence with AsyncStorage

As a user,
I want my chat history to persist locally,
so that I can view previous messages even when offline or after restarting the app.

### Acceptance Criteria

1. Message data persisted to AsyncStorage immediately after being fetched from Firestore or sent by user
2. Storage key structure: `messages_{conversationId}` containing array of message objects
3. On app launch, messages load from AsyncStorage first (instant display) while Firestore sync happens in background
4. Conversation list metadata (last message, timestamp) also persisted to AsyncStorage for offline access
5. Cache expiration strategy implemented: Keep messages from last 30 days in local storage, purge older data
6. App force-quit and reopened shows all recent messages without network connection
7. Local cache updates incrementally as new messages arrive (append-only strategy for performance)
8. User profile data also cached locally for offline display of names and avatars

## Story 2.2: Optimistic UI Updates for Message Sending

As a user,
I want my messages to appear instantly when I send them,
so that the app feels responsive even on slow connections.

### Acceptance Criteria

1. When user sends message, it immediately appears in chat UI with "sending" status indicator (e.g., clock icon)
2. Message assigned temporary local ID before Firestore write completes
3. After successful Firestore write, local message updated with server-generated ID and timestamp
4. "Sending" indicator changes to "sent" (single checkmark) after Firestore confirmation
5. If Firestore write fails, message shows "failed" indicator (red exclamation) with retry option
6. User can tap failed message to retry sending
7. Optimistic message includes all display data (text, timestamp, sender) so UI doesn't shift after server confirmation
8. Message order preserved correctly even when optimistic messages receive server timestamps
9. Context/reducer state manages optimistic messages separate from confirmed messages until sync completes

## Story 2.3: Offline Message Queueing

As a user,
I want messages I send while offline to queue and send automatically when I reconnect,
so that I don't lose messages due to poor connectivity.

### Acceptance Criteria

1. Offline queue implemented using AsyncStorage with key `message_queue`
2. When network unavailable, sent messages added to queue with status "queued"
3. Queued messages display in chat UI with "queued" indicator (e.g., outlined checkmark)
4. Network state monitoring detects when connectivity returns (NetInfo library or Firestore connection state)
5. On reconnection, queued messages sent to Firestore sequentially in FIFO order
6. Each queued message removed from queue after successful Firestore write
7. Queue processing includes retry logic with exponential backoff for failed sends
8. User can view queued messages count in UI ("3 messages waiting to send")
9. Queue persists across app restarts - messages still send after force-quit and reopening
10. Testing: App enters airplane mode, user sends 5 messages, exits airplane mode, all 5 messages send within 10 seconds

## Story 2.4: Message Delivery States (Sent, Delivered, Read)

As a user,
I want to see delivery states for my messages,
so that I know if the recipient received and read them.

### Acceptance Criteria

1. Message status field supports states: 'sending', 'sent', 'delivered', 'read'
2. **Sent state:** Message successfully written to Firestore (single gray checkmark)
3. **Delivered state:** Recipient's device fetched the message from Firestore (double gray checkmark)
4. **Read state:** Recipient opened the chat and viewed the message (double blue checkmark)
5. Delivery state updated in Firestore message document when recipient's app queries messages
6. Read state updated when recipient views chat screen containing the message
7. Visual indicators shown on each message bubble in chat view
8. Conversation list shows delivery state for last message sent by current user
9. Real-time updates: Delivery state changes propagate to sender's UI immediately via Firestore listener
10. Group chat considerations deferred to Epic 3 (only implement for one-on-one in this story)

## Story 2.5: Read Receipts

As a user,
I want to see when the other person has read my messages,
so that I know they've seen what I sent.

### Acceptance Criteria

1. Read receipt triggered when recipient views chat screen while message is visible on screen
2. All visible messages marked as read in Firestore batch update
3. Read status uses Firestore transaction to prevent race conditions
4. Sender sees messages change from "delivered" to "read" status in real-time
5. Read receipts only sent when app is in foreground and chat view is active
6. Messages that enter viewport through scrolling also trigger read receipts
7. "Last read" timestamp stored in conversation metadata to optimize read receipt processing
8. Read receipt respects privacy: No "typing seen at X time" exposed, only read state boolean
9. Edge case handled: If user force-quits app while viewing messages, read receipts still sent on next app open

## Story 2.6: Typing Indicators

As a user,
I want to see when the other person is typing,
so that I know they're actively engaged in the conversation.

### Acceptance Criteria

1. Typing indicator appears in chat header showing "{User Name} is typing..."
2. Typing status detected via text input onChange event
3. Typing status sent to Firestore `/conversations/{conversationId}/typing/{userId}` with TTL of 3 seconds
4. Use Firestore `serverTimestamp()` and client-side logic to auto-expire typing status after 3 seconds of inactivity
5. Debounce typing updates: Only send Firestore update if user typed within last 500ms
6. Typing indicator shown to recipient via real-time Firestore listener
7. Indicator hides when: user stops typing for 3 seconds, user sends message, or user closes chat
8. Multiple users typing in group chat shows "User1, User2 are typing..." (prepare for Epic 3)
9. Typing indicator does not trigger push notifications
10. Typing status cleared when user backgrounds app or navigates away from chat

## Story 2.7: Push Notifications (Foreground Only)

As a user,
I want to receive notifications for new messages when I'm using the app,
so that I'm alerted to messages in other conversations.

### Acceptance Criteria

1. Expo notifications library configured with FCM for iOS
2. FCM token generated on app launch and stored in Firestore `/users/{userId}/fcmToken`
3. Cloud Function triggers on new message creation: `onMessageCreated`
4. Cloud Function sends push notification to recipient's FCM token using Firebase Admin SDK
5. Notification payload includes: sender name, message preview (first 50 chars), conversation ID
6. Foreground notifications displayed using Expo local notification API with banner style
7. Tapping notification navigates user to the specific conversation
8. Notifications only sent if recipient is NOT currently viewing the conversation (prevent redundant alerts)
9. No notification sent if message sender is the current user (prevent self-notification)
10. Background/killed app notifications deferred to post-MVP (only foreground required for MVP gate)
11. Testing: User A sends message to User B while B has app open but viewing different conversation - B sees notification

## Story 2.8: Network Error Handling & Retry Logic

As a user,
I want the app to gracefully handle network errors and retry operations,
so that temporary connectivity issues don't break my messaging experience.

### Acceptance Criteria

1. All Firestore operations wrapped in try-catch with user-friendly error messages
2. Network errors show non-intrusive toast/snackbar notifications (not blocking modals)
3. Failed message sends automatically retry up to 3 times with exponential backoff (1s, 2s, 4s)
4. After 3 failed retries, message marked as "failed" with manual retry option
5. Firestore connection state monitored and displayed in UI (offline banner at top of screen)
6. Real-time listeners automatically reconnect when network returns
7. Image uploads with Firebase Storage include retry logic (3 attempts)
8. App handles Firestore permission errors gracefully with clear messaging
9. Poor network conditions (3G, packet loss) tested: Messages eventually send, UI remains responsive
10. Testing scenario: Enable airplane mode mid-send, disable airplane mode, verify message completes

## Story 2.9: Reliability Testing & Validation

As a developer,
I want to validate the app meets all reliability testing scenarios from the Project Brief,
so that the MVP passes the hard gate requirements.

### Acceptance Criteria

1. **Test 1 - Real-time chat:** Two devices exchanging 10+ messages show instant delivery with no lag
2. **Test 2 - Offline receiving:** Device A offline, Device B sends 5 messages, Device A comes online and receives all 5 messages within 5 seconds
3. **Test 3 - Backgrounded app:** Message sent while app backgrounded shows notification and appears in conversation when app reopened
4. **Test 4 - Force-quit persistence:** App force-quit mid-conversation, reopened, all messages still visible
5. **Test 5 - Airplane mode:** Device in airplane mode, user sends 3 messages (queued), exits airplane mode, all 3 send successfully
6. **Test 6 - Rapid-fire:** User sends 20+ messages quickly (< 10 seconds), all messages appear in correct order with proper timestamps
7. **Test 7 - Poor network:** Throttled connection (simulated 3G), messages send within 5 seconds, typing indicators still work
8. Integration test suite created covering message sending, offline queue, optimistic UI, and persistence
9. All 7 testing scenarios documented in README with steps to reproduce
10. Manual test checklist completed and results documented
