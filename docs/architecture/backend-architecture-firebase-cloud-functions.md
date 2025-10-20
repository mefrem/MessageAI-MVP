# Backend Architecture (Firebase Cloud Functions)

## Cloud Functions Structure

```
/functions/src/
├── index.ts                     # Function exports
├── triggers/
│   └── onMessageCreated.ts      # Push notification trigger
├── services/
│   └── notificationService.ts   # FCM notification logic
└── utils/
    └── logger.ts                # Logging utilities
```

## Push Notification Cloud Function

```typescript
// functions/src/triggers/onMessageCreated.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Message } from '@messageai/shared';

export const onMessageCreated = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data() as Message;
    const { conversationId } = context.params;

    // Get conversation to find recipients
    const conversationDoc = await admin.firestore()
      .collection('conversations')
      .doc(conversationId)
      .get();

    const conversation = conversationDoc.data();
    if (!conversation) return;

    // Get sender info
    const senderDoc = await admin.firestore()
      .collection('users')
      .doc(message.senderId)
      .get();

    const sender = senderDoc.data();
    if (!sender) return;

    // Find recipients (all participants except sender)
    const recipientIds = conversation.participants.filter(
      (id: string) => id !== message.senderId
    );

    // Get FCM tokens for recipients
    const recipientDocs = await admin.firestore()
      .collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', recipientIds)
      .get();

    const tokens: string[] = [];
    recipientDocs.forEach(doc => {
      const fcmToken = doc.data().fcmToken;
      if (fcmToken) tokens.push(fcmToken);
    });

    if (tokens.length === 0) return;

    // Send notifications
    const payload: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: sender.displayName,
        body: message.type === 'text' ? message.text! : '📷 Image',
      },
      data: {
        conversationId,
        messageId: message.id,
        type: 'new_message',
      },
    };

    await admin.messaging().sendMulticast(payload);
  });
```
