import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  MessageDocument,
  UserDocument,
  ConversationDocument,
} from "@messageai/shared";

export const onMessageCreated = functions.firestore
  .document("conversations/{conversationId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data() as MessageDocument;
    const { conversationId } = context.params;

    try {
      // Get conversation to find recipients
      const conversationDoc = await admin
        .firestore()
        .collection("conversations")
        .doc(conversationId)
        .get();

      if (!conversationDoc.exists) {
        console.log("Conversation not found:", conversationId);
        return;
      }

      const conversation = conversationDoc.data() as ConversationDocument;

      // Get sender info
      const senderDoc = await admin
        .firestore()
        .collection("users")
        .doc(message.senderId)
        .get();

      if (!senderDoc.exists) {
        console.log("Sender not found:", message.senderId);
        return;
      }

      const sender = senderDoc.data() as UserDocument;

      // Find recipients (all participants except sender)
      const recipientIds = conversation.participants.filter(
        (id: string) => id !== message.senderId
      );

      if (recipientIds.length === 0) {
        console.log("No recipients found");
        return;
      }

      // Get FCM tokens for recipients
      const recipientDocs = await admin
        .firestore()
        .collection("users")
        .where(admin.firestore.FieldPath.documentId(), "in", recipientIds)
        .get();

      const tokens: string[] = [];
      recipientDocs.forEach((doc) => {
        const userData = doc.data() as UserDocument;
        if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });

      if (tokens.length === 0) {
        console.log("No FCM tokens found for recipients");
        return;
      }

      // Prepare notification title
      const title =
        conversation.type === "group" && conversation.name
          ? `${sender.displayName} in ${conversation.name}`
          : sender.displayName;

      // Prepare notification body
      const body =
        message.type === "text" && message.text
          ? message.text.length > 50
            ? message.text.substring(0, 50) + "..."
            : message.text
          : "📷 Image";

      // Send notifications
      const payload: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title,
          body,
        },
        data: {
          conversationId,
          messageId: message.id,
          type: "new_message",
          senderId: message.senderId,
        },
        apns: {
          payload: {
            aps: {
              badge: 1,
              sound: "default",
            },
          },
        },
      };

      const response = await admin.messaging().sendMulticast(payload);
      console.log(`Successfully sent ${response.successCount} notifications`);

      if (response.failureCount > 0) {
        console.log(`Failed to send ${response.failureCount} notifications`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(`Error sending to token ${tokens[idx]}:`, resp.error);
          }
        });
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  });
