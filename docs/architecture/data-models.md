# Data Models

## User

**Purpose:** Represents a registered user with authentication and profile information. Central entity for auth, presence, and message attribution.

**Key Attributes:**
- `id`: string - Firebase Auth UID (primary key)
- `email`: string - User's email address
- `displayName`: string - User's chosen display name (2-50 chars)
- `photoURL`: string | null - Firebase Storage URL for profile picture
- `createdAt`: Timestamp - Account creation timestamp
- `updatedAt`: Timestamp - Last profile update

### TypeScript Interface

```typescript
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Relationships

- One User has many Conversations (via participants array)
- One User has many Messages (as sender)
- One User has one Presence status

## Conversation

**Purpose:** Represents a chat conversation (one-on-one or group). Container for messages and participant metadata.

**Key Attributes:**
- `id`: string - Auto-generated Firestore document ID
- `type`: 'oneOnOne' | 'group' - Conversation type
- `participants`: string[] - Array of user IDs
- `name`: string | null - Group name (null for one-on-one)
- `photoURL`: string | null - Group photo URL (null for one-on-one)
- `createdBy`: string - User ID of creator
- `createdAt`: Timestamp - Conversation creation time
- `lastMessage`: string | null - Preview of last message text
- `lastMessageAt`: Timestamp | null - Timestamp of last message
- `lastMessageType`: 'text' | 'image' | null - Type of last message

### TypeScript Interface

```typescript
export type ConversationType = 'oneOnOne' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  name: string | null;
  photoURL: string | null;
  createdBy: string;
  createdAt: Date;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  lastMessageType: 'text' | 'image' | null;
}
```

### Relationships

- One Conversation has many Messages (subcollection)
- One Conversation has many TypingStatus entries (subcollection)
- One Conversation belongs to many Users (many-to-many via participants)

## Message

**Purpose:** Individual message within a conversation. Supports text and image messages with delivery tracking.

**Key Attributes:**
- `id`: string - Auto-generated Firestore document ID
- `conversationId`: string - Parent conversation ID
- `type`: 'text' | 'image' - Message content type
- `text`: string | null - Message text (null for image-only)
- `imageURL`: string | null - Firebase Storage URL for image
- `imageWidth`: number | null - Original image width in pixels
- `imageHeight`: number | null - Original image height in pixels
- `senderId`: string - User ID of sender
- `timestamp`: Timestamp - Server timestamp when message created
- `status`: 'sending' | 'sent' | 'delivered' | 'read' - Delivery status
- `readBy`: string[] - Array of user IDs who read the message (for groups)

### TypeScript Interface

```typescript
export type MessageType = 'text' | 'image';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  text: string | null;
  imageURL: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  senderId: string;
  timestamp: Date;
  status: MessageStatus;
  readBy: string[];
}
```

### Relationships

- One Message belongs to one Conversation
- One Message belongs to one User (sender)

## Presence

**Purpose:** Tracks user online/offline status and last seen timestamp for presence indicators.

**Key Attributes:**
- `userId`: string - User ID (document ID)
- `state`: 'online' | 'offline' - Current connection state
- `lastSeen`: Timestamp - Last time user was active
- `updatedAt`: Timestamp - Last status update time

### TypeScript Interface

```typescript
export type PresenceState = 'online' | 'offline';

export interface Presence {
  userId: string;
  state: PresenceState;
  lastSeen: Date;
  updatedAt: Date;
}
```

### Relationships

- One Presence belongs to one User (one-to-one)

## TypingStatus

**Purpose:** Ephemeral typing indicator status within a conversation. Auto-expires after 3 seconds.

**Key Attributes:**
- `userId`: string - User ID who is typing
- `conversationId`: string - Conversation ID
- `isTyping`: boolean - Whether user is currently typing
- `timestamp`: Timestamp - When typing status was last updated (for TTL)

### TypeScript Interface

```typescript
export interface TypingStatus {
  userId: string;
  conversationId: string;
  isTyping: boolean;
  timestamp: Date;
}
```

### Relationships

- One TypingStatus belongs to one Conversation
- One TypingStatus belongs to one User
