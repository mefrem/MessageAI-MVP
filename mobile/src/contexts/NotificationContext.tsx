import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { Message, Conversation } from "@messageai/shared";

export interface InAppNotification {
  id: string;
  conversationId: string;
  conversationName: string;
  senderName: string;
  messageText: string;
  timestamp: Date;
}

export interface NotificationContextValue {
  notification: InAppNotification | null;
  showNotification: (
    message: Message,
    conversation: Conversation,
    senderName: string
  ) => void;
  dismissNotification: () => void;
  currentConversationId: string | null;
  setCurrentConversation: (conversationId: string | null) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<InAppNotification | null>(
    null
  );
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (
    message: Message,
    conversation: Conversation,
    senderName: string
  ) => {
    // Don't show notification if user is in the same conversation
    if (currentConversationId === message.conversationId) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const messageText =
      message.type === "text"
        ? message.text || ""
        : message.type === "image"
        ? "📷 Image"
        : "Message";

    const newNotification: InAppNotification = {
      id: message.id,
      conversationId: message.conversationId,
      conversationName: conversation.name || "Chat",
      senderName,
      messageText,
      timestamp: message.timestamp,
    };

    setNotification(newNotification);

    // Auto-dismiss after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const dismissNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(null);
  };

  const setCurrentConversation = (conversationId: string | null) => {
    setCurrentConversationId(conversationId);
    // Dismiss notification when entering a conversation
    if (conversationId && notification?.conversationId === conversationId) {
      dismissNotification();
    }
  };

  const value: NotificationContextValue = {
    notification,
    showNotification,
    dismissNotification,
    currentConversationId,
    setCurrentConversation,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
