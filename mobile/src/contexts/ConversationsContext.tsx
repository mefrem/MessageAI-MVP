import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Conversation, User } from "@messageai/shared";
import { conversationService } from "../services/conversationService";
import { storageService } from "../services/storageService";
import { useAuth } from "./AuthContext";

export interface ConversationsContextValue {
  conversations: Conversation[];
  loading: boolean;
  createOneOnOne: (otherUserId: string) => Promise<Conversation>;
  createGroup: (
    name: string,
    participantIds: string[],
    photoURL?: string
  ) => Promise<Conversation>;
  getConversation: (conversationId: string) => Promise<Conversation | null>;
  getAllUsers: () => Promise<User[]>;
  addGroupMembers: (
    conversationId: string,
    memberIds: string[]
  ) => Promise<void>;
  refreshConversations: () => void;
}

const ConversationsContext = createContext<
  ConversationsContextValue | undefined
>(undefined);

export const ConversationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Load cached conversations
    storageService.getConversations().then((cached) => {
      if (cached.length > 0) {
        setConversations(cached);
      }
      setLoading(false);
    });

    // Listen to real-time updates
    const unsubscribe = conversationService.getUserConversations(
      user.id,
      (updatedConversations) => {
        setConversations(updatedConversations);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const createOneOnOne = async (otherUserId: string): Promise<Conversation> => {
    if (!user) throw new Error("User not authenticated");

    const conversation = await conversationService.createOneOnOneConversation(
      user.id,
      otherUserId
    );
    return conversation;
  };

  const createGroup = async (
    name: string,
    participantIds: string[],
    photoURL?: string
  ): Promise<Conversation> => {
    if (!user) throw new Error("User not authenticated");

    const conversation = await conversationService.createGroupConversation(
      user.id,
      name,
      participantIds,
      photoURL
    );
    return conversation;
  };

  const getConversation = async (
    conversationId: string
  ): Promise<Conversation | null> => {
    return await conversationService.getConversation(conversationId);
  };

  const getAllUsers = async (): Promise<User[]> => {
    return await conversationService.getAllUsers();
  };

  const addGroupMembers = async (
    conversationId: string,
    memberIds: string[]
  ): Promise<void> => {
    await conversationService.addGroupMembers(conversationId, memberIds);
  };

  const refreshConversations = () => {
    if (user) {
      setLoading(true);
      // The listener will automatically update the conversations
    }
  };

  const value: ConversationsContextValue = {
    conversations,
    loading,
    createOneOnOne,
    createGroup,
    getConversation,
    getAllUsers,
    addGroupMembers,
    refreshConversations,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error(
      "useConversations must be used within a ConversationsProvider"
    );
  }
  return context;
};
