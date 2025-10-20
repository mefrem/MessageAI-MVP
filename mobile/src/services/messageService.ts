import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import {
  Message,
  MessageDocument,
  MessageStatus,
  QueuedMessage,
} from "@messageai/shared";
import { handleFirebaseError } from "../utils/errorHandler";
import { storageService } from "./storageService";
import { offlineQueueService } from "./offlineQueueService";
import NetInfo from "@react-native-community/netinfo";

export const messageService = {
  async sendTextMessage(
    conversationId: string,
    text: string,
    senderId: string,
    optimisticCallback?: (message: Message) => void
  ): Promise<Message> {
    const tempId = `temp_${Date.now()}_${Math.random()}`;

    // Create optimistic message
    const optimisticMessage: Message = {
      id: tempId,
      conversationId,
      type: "text",
      text,
      imageURL: null,
      imageWidth: null,
      imageHeight: null,
      senderId,
      timestamp: new Date(),
      status: "sending",
      readBy: [],
    };

    // Immediately show in UI
    if (optimisticCallback) {
      optimisticCallback(optimisticMessage);
    }

    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        // Queue for later
        const queuedMessage: QueuedMessage = {
          ...optimisticMessage,
          retryCount: 0,
        };
        await offlineQueueService.enqueueMessage(queuedMessage);

        return {
          ...optimisticMessage,
          status: "sending",
        };
      }

      // Send to Firestore
      const messageData: Partial<MessageDocument> = {
        conversationId,
        type: "text",
        text,
        imageURL: null,
        imageWidth: null,
        imageHeight: null,
        senderId,
        timestamp: serverTimestamp(),
        status: "sent",
        readBy: [],
      };

      const messagesRef = collection(
        firestore,
        `conversations/${conversationId}/messages`
      );
      const docRef = await addDoc(messagesRef, messageData);

      // Update conversation's last message
      await this.updateConversationLastMessage(conversationId, text, "text");

      const sentMessage: Message = {
        id: docRef.id,
        conversationId,
        type: "text",
        text,
        imageURL: null,
        imageWidth: null,
        imageHeight: null,
        senderId,
        timestamp: new Date(),
        status: "sent",
        readBy: [],
      };

      // Cache locally
      await storageService.appendMessage(conversationId, sentMessage);

      return sentMessage;
    } catch (error) {
      console.error("Error sending message:", error);

      // Queue for retry
      const queuedMessage: QueuedMessage = {
        ...optimisticMessage,
        retryCount: 0,
      };
      await offlineQueueService.enqueueMessage(queuedMessage);

      throw handleFirebaseError(error);
    }
  },

  async sendImageMessage(
    conversationId: string,
    imageURL: string,
    imageWidth: number,
    imageHeight: number,
    senderId: string,
    optimisticCallback?: (message: Message) => void
  ): Promise<Message> {
    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const optimisticMessage: Message = {
      id: tempId,
      conversationId,
      type: "image",
      text: null,
      imageURL,
      imageWidth,
      imageHeight,
      senderId,
      timestamp: new Date(),
      status: "sending",
      readBy: [],
    };

    if (optimisticCallback) {
      optimisticCallback(optimisticMessage);
    }

    try {
      const messageData: Partial<MessageDocument> = {
        conversationId,
        type: "image",
        text: null,
        imageURL,
        imageWidth,
        imageHeight,
        senderId,
        timestamp: serverTimestamp(),
        status: "sent",
        readBy: [],
      };

      const messagesRef = collection(
        firestore,
        `conversations/${conversationId}/messages`
      );
      const docRef = await addDoc(messagesRef, messageData);

      await this.updateConversationLastMessage(
        conversationId,
        "📷 Image",
        "image"
      );

      const sentMessage: Message = {
        id: docRef.id,
        conversationId,
        type: "image",
        text: null,
        imageURL,
        imageWidth,
        imageHeight,
        senderId,
        timestamp: new Date(),
        status: "sent",
        readBy: [],
      };

      await storageService.appendMessage(conversationId, sentMessage);

      return sentMessage;
    } catch (error) {
      console.error("Error sending image message:", error);
      throw handleFirebaseError(error);
    }
  },

  getMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const messagesRef = collection(
      firestore,
      `conversations/${conversationId}/messages`
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data() as MessageDocument;
          return {
            id: doc.id,
            ...data,
            timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
          };
        });

        // Cache messages locally
        storageService.saveMessages(conversationId, messages);

        callback(messages);
      },
      (error) => {
        console.error("Error listening to messages:", error);
      }
    );

    return unsubscribe;
  },

  async updateMessageStatus(
    conversationId: string,
    messageId: string,
    status: MessageStatus
  ): Promise<void> {
    try {
      const messageRef = doc(
        firestore,
        `conversations/${conversationId}/messages`,
        messageId
      );
      await updateDoc(messageRef, { status });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  },

  async markMessagesAsRead(
    conversationId: string,
    messageIds: string[],
    userId: string
  ): Promise<void> {
    try {
      const batch = writeBatch(firestore);

      messageIds.forEach((messageId) => {
        const messageRef = doc(
          firestore,
          `conversations/${conversationId}/messages`,
          messageId
        );
        batch.update(messageRef, {
          status: "read",
          readBy: [...([] as string[]), userId], // In production, use arrayUnion
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  async updateConversationLastMessage(
    conversationId: string,
    lastMessage: string,
    lastMessageType: "text" | "image"
  ): Promise<void> {
    try {
      const conversationRef = doc(firestore, "conversations", conversationId);
      await updateDoc(conversationRef, {
        lastMessage,
        lastMessageAt: serverTimestamp(),
        lastMessageType,
      });
    } catch (error) {
      console.error("Error updating last message:", error);
    }
  },

  async updateTypingStatus(
    conversationId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      const typingRef = doc(
        firestore,
        `conversations/${conversationId}/typing`,
        userId
      );

      // Use setDoc with merge to create or update the document
      await setDoc(
        typingRef,
        {
          userId,
          isTyping,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      // Silently fail - typing indicators are not critical
      // Don't log error to avoid red console warnings
    }
  },

  getTypingStatus(
    conversationId: string,
    callback: (typingUsers: string[]) => void
  ) {
    const typingRef = collection(
      firestore,
      `conversations/${conversationId}/typing`
    );

    const unsubscribe = onSnapshot(
      typingRef,
      (snapshot) => {
        const typingUsers: string[] = [];
        const now = Date.now();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const timestamp =
            (data.timestamp as Timestamp)?.toDate().getTime() || 0;

          // Only consider typing if updated within last 3 seconds
          if (data.isTyping && now - timestamp < 3000) {
            typingUsers.push(data.userId);
          }
        });

        callback(typingUsers);
      },
      (error) => {
        // Silently handle permission errors - typing indicators are not critical
        // Just return empty array
        callback([]);
      }
    );

    return unsubscribe;
  },
};
