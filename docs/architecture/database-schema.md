# Database Schema

## Firestore Collections Structure

```
/users/{userId}
  - id: string
  - email: string
  - displayName: string
  - photoURL: string | null
  - createdAt: timestamp
  - updatedAt: timestamp
  - fcmToken: string (for push notifications)

/conversations/{conversationId}
  - id: string
  - type: 'oneOnOne' | 'group'
  - participants: string[]  [INDEXED]
  - name: string | null
  - photoURL: string | null
  - createdBy: string
  - createdAt: timestamp
  - lastMessage: string | null
  - lastMessageAt: timestamp | null  [INDEXED for sorting]
  - lastMessageType: 'text' | 'image' | null

  /messages/{messageId}  [SUBCOLLECTION]
    - id: string
    - conversationId: string
    - type: 'text' | 'image'
    - text: string | null
    - imageURL: string | null
    - imageWidth: number | null
    - imageHeight: number | null
    - senderId: string
    - timestamp: timestamp  [INDEXED for ordering]
    - status: 'sending' | 'sent' | 'delivered' | 'read'
    - readBy: string[]

  /typing/{userId}  [SUBCOLLECTION - ephemeral, TTL 3 seconds]
    - userId: string
    - isTyping: boolean
    - timestamp: timestamp

/presence/{userId}
  - userId: string
  - state: 'online' | 'offline'
  - lastSeen: timestamp
  - updatedAt: timestamp
```

## Firestore Indexes

**Composite Indexes Required:**

1. **User Conversations Query**
   - Collection: `conversations`
   - Fields: `participants` (ARRAY_CONTAINS), `lastMessageAt` (DESCENDING)
   - Purpose: Get user's conversations sorted by recent activity

2. **Conversation Messages Query**
   - Collection: `conversations/{conversationId}/messages`
   - Fields: `timestamp` (ASCENDING)
   - Purpose: Get messages in chronological order
   - Note: Single-field index, auto-created by Firestore

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isParticipant(participants) {
      return request.auth.uid in participants;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if false;  // Prevent account deletion via client
    }

    // Conversations collection
    match /conversations/{conversationId} {
      allow read: if isAuthenticated() && isParticipant(resource.data.participants);
      allow create: if isAuthenticated() && isParticipant(request.resource.data.participants);
      allow update: if isAuthenticated() && isParticipant(resource.data.participants);
      allow delete: if false;  // Prevent conversation deletion via client

      // Messages subcollection
      match /messages/{messageId} {
        allow read: if isAuthenticated() && isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants);
        allow create: if isAuthenticated() &&
                         isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants) &&
                         request.resource.data.senderId == request.auth.uid;
        allow update: if isAuthenticated() && isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants);
        allow delete: if false;
      }

      // Typing status subcollection
      match /typing/{userId} {
        allow read: if isAuthenticated() && isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants);
        allow write: if isAuthenticated() && isOwner(userId) && isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants);
      }
    }

    // Presence collection
    match /presence/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

## Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Profile pictures
    match /profiles/{userId}/{fileName} {
      allow read: if true;  // Public read for profile pictures
      allow write: if request.auth != null && request.auth.uid == userId &&
                      request.resource.size < 10 * 1024 * 1024 &&  // Max 10MB
                      request.resource.contentType.matches('image/.*');  // Images only
    }

    // Group photos
    match /groups/{conversationId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.resource.size < 10 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }

    // Message images
    match /messages/{conversationId}/{messageId}.jpg {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.resource.size < 10 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```
