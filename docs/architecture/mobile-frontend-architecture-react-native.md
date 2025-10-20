# Mobile Frontend Architecture (React Native)

## React Context State Management

**Context Providers:**

```typescript
// AuthContext.tsx
export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// ConversationsContext.tsx
export interface ConversationsContextValue {
  conversations: Conversation[];
  loading: boolean;
  createOneOnOne: (otherUserId: string) => Promise<Conversation>;
  createGroup: (name: string, participantIds: string[]) => Promise<Conversation>;
}

// MessagesContext.tsx
export interface MessagesContextValue {
  messages: Record<string, Message[]>;  // Keyed by conversationId
  loading: Record<string, boolean>;
  sendTextMessage: (conversationId: string, text: string) => Promise<void>;
  sendImageMessage: (conversationId: string, imageUri: string) => Promise<void>;
}

// NetworkContext.tsx
export interface NetworkContextValue {
  isOnline: boolean;
  connectionType: string | null;
}
```

## Component Organization

```
/mobile/src/
├── components/          # Reusable UI components
│   ├── common/          # Generic components
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   └── StatusIndicator.tsx
│   ├── chat/            # Chat-specific components
│   │   ├── MessageBubble.tsx
│   │   ├── MessageList.tsx
│   │   ├── ChatInput.tsx
│   │   └── TypingIndicator.tsx
│   └── conversation/    # Conversation list components
│       ├── ConversationItem.tsx
│       └── ConversationList.tsx
├── screens/             # Screen components
│   ├── AuthScreen.tsx
│   ├── ConversationListScreen.tsx
│   ├── ChatScreen.tsx
│   ├── GroupCreateScreen.tsx
│   └── ProfileScreen.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   ├── ConversationsContext.tsx
│   ├── MessagesContext.tsx
│   └── NetworkContext.tsx
├── services/            # Business logic services
│   ├── authService.ts
│   ├── conversationService.ts
│   ├── messageService.ts
│   ├── offlineQueueService.ts
│   ├── presenceService.ts
│   ├── mediaService.ts
│   └── notificationService.ts
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useConversations.ts
│   ├── useMessages.ts
│   └── useNetworkStatus.ts
├── navigation/          # React Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── utils/               # Utility functions
│   ├── dateFormatter.ts
│   ├── imageCompressor.ts
│   └── validators.ts
└── config/              # Configuration
    └── firebase.ts
```

## Component Template Example

```typescript
// MessageBubble.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Message } from '@messageai/shared';
import { Avatar } from '../common/Avatar';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
  senderPhotoURL?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  senderName,
  senderPhotoURL,
}) => {
  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessage]}>
      {!isOwnMessage && <Avatar uri={senderPhotoURL} size={32} />}
      <View style={[styles.bubble, isOwnMessage && styles.ownBubble]}>
        {!isOwnMessage && <Text style={styles.senderName}>{senderName}</Text>}
        {message.type === 'text' && <Text>{message.text}</Text>}
        {message.type === 'image' && (
          <Image source={{ uri: message.imageURL! }} style={styles.image} />
        )}
        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
        {isOwnMessage && <DeliveryStatus status={message.status} />}
      </View>
    </View>
  );
};
```
