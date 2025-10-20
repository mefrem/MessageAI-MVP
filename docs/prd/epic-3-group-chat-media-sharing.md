# Epic 3: Group Chat & Media Sharing

**Goal:** Complete the MVP feature set by adding group conversation support for 3+ users with proper message attribution and image sharing capabilities using Firebase Storage. By the end of this epic, users can create group chats, send images in both one-on-one and group conversations, and all MVP hard-gate requirements are met.

## Story 3.1: Group Chat Creation

As a user,
I want to create group conversations with multiple people,
so that I can chat with 3+ people in one conversation.

### Acceptance Criteria

1. "New Group" option added to conversation creation flow (separate from one-on-one)
2. Group creation screen allows selecting multiple users from user list with checkboxes
3. Group name input field (required, 1-50 characters)
4. Optional group photo upload using Expo ImagePicker
5. Minimum 2 other participants required (3 total including creator)
6. Group conversation document created in Firestore `/conversations/{conversationId}` with fields: `type` ('group'), `name`, `participants` (array), `photoURL`, `createdBy`, `createdAt`
7. Group photo uploaded to Firebase Storage at `/groups/{conversationId}/photo.jpg`
8. Creator automatically added as first participant/admin
9. After creation, user navigates to group chat view
10. Group appears in conversation list for all participants

## Story 3.2: Group Chat View & Message Attribution

As a user,
I want to see who sent each message in a group chat,
so that I can follow multi-person conversations.

### Acceptance Criteria

1. Group chat view displays group name and photo in header
2. Each message bubble shows sender's display name and profile picture
3. Current user's messages still appear on right, others' messages on left
4. Messages from different senders visually distinguished (e.g., different avatar positions)
5. Message data includes `senderId` and sender profile fetched from `/users/{senderId}`
6. Sender names displayed above or below message bubbles
7. Group chat supports all message features from Epic 2 (persistence, optimistic UI, delivery states)
8. Typing indicator shows multiple users: "Alice, Bob are typing..."
9. Message timestamps work same as one-on-one chats
10. Read receipts show count of members who read message (e.g., "Read by 3")

## Story 3.3: Group Member Management

As a user,
I want to view group members and add new participants,
so that I can manage group membership.

### Acceptance Criteria

1. "Group Info" screen accessible from group chat header showing group name, photo, and member list
2. Member list displays all participants with display names and profile pictures
3. "Add Members" button allows adding new users to existing group
4. Adding members updates Firestore `participants` array and sends system message to chat
5. System message format: "{User} added {NewUser} to the group"
6. Removing members deferred to post-MVP (keep MVP simple)
7. Group creator/admin indication shown (optional nice-to-have)
8. Member count displayed in group header (e.g., "3 members")
9. All group members see member changes in real-time

## Story 3.4: Image Upload & Sending

As a user,
I want to send images in my conversations,
so that I can share photos with others.

### Acceptance Criteria

1. Image attachment button added to chat input area (camera/gallery icon)
2. Tapping attachment button opens Expo ImagePicker with camera and gallery options
3. User can select one image at a time
4. Image preview shown before sending with cancel option
5. Sending image: Upload to Firebase Storage at `/messages/{conversationId}/{messageId}.jpg`
6. Client-side image compression before upload (max 1920px width, JPEG quality 80%)
7. Upload progress indicator shown while image uploading
8. Message document created with type 'image', fields: `imageURL`, `imageWidth`, `imageHeight`, `senderId`, `timestamp`
9. Image messages support all delivery states (sending, sent, delivered, read)
10. Failed image uploads show retry option
11. Works in both one-on-one and group chats

## Story 3.5: Image Display & Viewing

As a user,
I want to view images sent in conversations,
so that I can see photos shared by others.

### Acceptance Criteria

1. Image messages display inline in chat view as image thumbnails
2. Images load from Firebase Storage URL with caching for performance
3. Loading placeholder shown while image downloads
4. Tapping image opens full-screen viewer with pinch-to-zoom
5. Full-screen viewer includes close button and swipe-to-dismiss gesture
6. Images display with aspect ratio preserved
7. Image timestamps and sender attribution shown same as text messages
8. Cached images persist locally for offline viewing (using AsyncStorage or device cache)
9. Failed image loads show placeholder with retry option
10. Images work in both one-on-one and group chats

## Story 3.6: Firebase Storage Security Rules & Optimization

As a developer,
I want proper Firebase Storage security and performance optimization,
so that image sharing is secure and efficient.

### Acceptance Criteria

1. Firebase Storage security rules allow authenticated users to upload images to their own paths
2. Security rules prevent users from deleting or overwriting others' images
3. Image file size validation: Maximum 10MB per image
4. File type validation: Only allow JPEG, PNG, WebP formats
5. Storage quota monitoring configured in Firebase Console
6. Image URLs use Firebase Storage signed URLs with appropriate expiration
7. Cleanup strategy for orphaned images documented (manual cleanup acceptable for MVP)
8. Storage rules tested: Unauthorized users cannot access or modify images
9. Image upload error handling includes quota exceeded and permission denied scenarios

## Story 3.7: MVP Completion Testing

As a developer,
I want to validate all MVP hard-gate requirements are met,
so that the project passes the 24-hour checkpoint.

### Acceptance Criteria

1. **One-on-one chat:** ✅ Users can send/receive text messages in real-time
2. **Real-time delivery:** ✅ Messages appear instantly between 2+ users
3. **Message persistence:** ✅ Chat history survives app restarts
4. **Optimistic UI:** ✅ Messages appear instantly before server confirmation
5. **Online/offline status:** ✅ Presence indicators working
6. **Message timestamps:** ✅ All messages show formatted timestamps
7. **User authentication:** ✅ Users have accounts with profiles
8. **Basic group chat:** ✅ 3+ users can chat in group conversations
9. **Message read receipts:** ✅ Read status tracking implemented
10. **Push notifications:** ✅ Foreground notifications working
11. **Deployment:** ✅ App running on iOS simulator with Firebase backend deployed
12. **All Epic 2 reliability tests:** ✅ All 7 testing scenarios pass
13. **Image sharing:** ✅ Users can send/receive images in both chat types
14. Final demo recorded showing all features working end-to-end
