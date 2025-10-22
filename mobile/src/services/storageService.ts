import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message, Conversation, User } from "@messageai/shared";

const KEYS = {
  MESSAGES: (conversationId: string) => `messages_${conversationId}`,
  CONVERSATIONS: "conversations",
  USER_PROFILE: "user_profile",
  MESSAGE_QUEUE: "message_queue",
  USERS_CACHE: "users_cache",
};

export const storageService = {
  // Messages
  async saveMessages(
    conversationId: string,
    messages: Message[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        KEYS.MESSAGES(conversationId),
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MESSAGES(conversationId));
      if (!data) return [];

      const messages = JSON.parse(data);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  },

  async appendMessage(conversationId: string, message: Message): Promise<void> {
    try {
      const messages = await this.getMessages(conversationId);
      messages.push(message);
      await this.saveMessages(conversationId, messages);
    } catch (error) {
      console.error("Error appending message:", error);
    }
  },

  // Conversations
  async saveConversations(conversations: Conversation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        KEYS.CONVERSATIONS,
        JSON.stringify(conversations)
      );
    } catch (error) {
      console.error("Error saving conversations:", error);
    }
  },

  async getConversations(): Promise<Conversation[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
      if (!data) return [];

      const conversations = JSON.parse(data);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        lastMessageAt: conv.lastMessageAt ? new Date(conv.lastMessageAt) : null,
      }));
    } catch (error) {
      console.error("Error getting conversations:", error);
      return [];
    }
  },

  // User Profile
  async saveUserProfile(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  },

  async getUserProfile(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      if (!data) return null;

      const user = JSON.parse(data);
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  },

  // Message Queue
  async saveMessageQueue(queue: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MESSAGE_QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error("Error saving message queue:", error);
    }
  },

  async getMessageQueue(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MESSAGE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting message queue:", error);
      return [];
    }
  },

  // Users Cache
  async saveUsersCache(users: Record<string, User>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USERS_CACHE, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users cache:", error);
    }
  },

  async getUsersCache(): Promise<Record<string, User>> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USERS_CACHE);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error getting users cache:", error);
      return {};
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

