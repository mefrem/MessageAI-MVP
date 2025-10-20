import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Message } from "@messageai/shared";
import { messageService } from "../services/messageService";
import { mediaService } from "../services/mediaService";
import { offlineQueueService } from "../services/offlineQueueService";
import { storageService } from "../services/storageService";
import { useAuth } from "./AuthContext";

export interface MessagesContextValue {
  messages: Record<string, Message[]>;
  loading: Record<string, boolean>;
  typingUsers: Record<string, string[]>;
  startListening: (conversationId: string) => void;
  sendTextMessage: (conversationId: string, text: string) => Promise<void>;
  sendImageMessage: (conversationId: string) => Promise<void>;
  getMessages: (conversationId: string) => Message[];
  markMessagesAsRead: (
    conversationId: string,
    messageIds: string[]
  ) => Promise<void>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
}

const MessagesContext = createContext<MessagesContextValue | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [activeListeners, setActiveListeners] = useState<
    Record<string, () => void>
  >({});

  useEffect(() => {
    if (!user) return;

    // Set up offline queue processing
    offlineQueueService.startNetworkMonitoring(() => {
      offlineQueueService.processQueue(async (queuedMessage) => {
        await messageService.sendTextMessage(
          queuedMessage.conversationId,
          queuedMessage.text!,
          user.id
        );
      });
    });

    return () => {
      offlineQueueService.stopNetworkMonitoring();
      // Clean up all message listeners
      Object.values(activeListeners).forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  const loadMessagesForConversation = (conversationId: string) => {
    if (!user || activeListeners[conversationId]) return;

    // Load cached messages first
    storageService.getMessages(conversationId).then((cached) => {
      if (cached.length > 0) {
        setMessages((prev) => ({ ...prev, [conversationId]: cached }));
      }
    });

    setLoading((prev) => ({ ...prev, [conversationId]: true }));

    // Listen to real-time updates
    const messagesUnsubscribe = messageService.getMessages(
      conversationId,
      (updatedMessages) => {
        setMessages((prev) => ({ ...prev, [conversationId]: updatedMessages }));
        setLoading((prev) => ({ ...prev, [conversationId]: false }));
      }
    );

    // Listen to typing status
    const typingUnsubscribe = messageService.getTypingStatus(
      conversationId,
      (users) => {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: users.filter((id) => id !== user.id),
        }));
      }
    );

    const combinedUnsubscribe = () => {
      messagesUnsubscribe();
      typingUnsubscribe();
    };

    setActiveListeners((prev) => ({
      ...prev,
      [conversationId]: combinedUnsubscribe,
    }));
  };

  const sendTextMessage = async (conversationId: string, text: string) => {
    if (!user) throw new Error("User not authenticated");

    // Ensure messages are being tracked
    if (!activeListeners[conversationId]) {
      loadMessagesForConversation(conversationId);
    }

    const optimisticCallback = (message: Message) => {
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message],
      }));
    };

    try {
      await messageService.sendTextMessage(
        conversationId,
        text,
        user.id,
        optimisticCallback
      );
    } catch (error) {
      console.error("Error sending text message:", error);
      throw error;
    }
  };

  const sendImageMessage = async (conversationId: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const messageId = `temp_${Date.now()}_${Math.random()}`;
      const image = await mediaService.pickAndUploadMessageImage(
        conversationId,
        messageId
      );

      if (!image) return; // User canceled

      const optimisticCallback = (message: Message) => {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), message],
        }));
      };

      await messageService.sendImageMessage(
        conversationId,
        image.uri,
        image.width,
        image.height,
        user.id,
        optimisticCallback
      );
    } catch (error) {
      console.error("Error sending image message:", error);
      throw error;
    }
  };

  const startListening = (conversationId: string) => {
    if (!activeListeners[conversationId]) {
      loadMessagesForConversation(conversationId);
    }
  };

  const getMessages = (conversationId: string): Message[] => {
    return messages[conversationId] || [];
  };

  const markMessagesAsRead = async (
    conversationId: string,
    messageIds: string[]
  ) => {
    if (!user) return;

    try {
      await messageService.markMessagesAsRead(
        conversationId,
        messageIds,
        user.id
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const setTyping = (conversationId: string, isTyping: boolean) => {
    if (!user) return;

    messageService.updateTypingStatus(conversationId, user.id, isTyping);
  };

  const value: MessagesContextValue = {
    messages,
    loading,
    typingUsers,
    startListening,
    sendTextMessage,
    sendImageMessage,
    getMessages,
    markMessagesAsRead,
    setTyping,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
