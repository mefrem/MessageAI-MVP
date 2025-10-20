import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import {
  Conversation,
  ConversationDocument,
  User,
  UserDocument,
} from "@messageai/shared";
import { handleFirebaseError } from "../utils/errorHandler";
import { storageService } from "./storageService";

export const conversationService = {
  async createOneOnOneConversation(
    currentUserId: string,
    otherUserId: string
  ): Promise<Conversation> {
    try {
      // Check if conversation already exists
      const existingConversation = await this.findOneOnOneConversation(
        currentUserId,
        otherUserId
      );
      if (existingConversation) {
        return existingConversation;
      }

      const conversationData: Partial<ConversationDocument> = {
        type: "oneOnOne",
        participants: [currentUserId, otherUserId],
        name: null,
        photoURL: null,
        createdBy: currentUserId,
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageAt: null,
        lastMessageType: null,
      };

      const docRef = await addDoc(
        collection(firestore, "conversations"),
        conversationData
      );

      const conversation: Conversation = {
        id: docRef.id,
        type: "oneOnOne",
        participants: [currentUserId, otherUserId],
        name: null,
        photoURL: null,
        createdBy: currentUserId,
        createdAt: new Date(),
        lastMessage: null,
        lastMessageAt: null,
        lastMessageType: null,
      };

      return conversation;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async createGroupConversation(
    currentUserId: string,
    name: string,
    participantIds: string[],
    photoURL?: string
  ): Promise<Conversation> {
    try {
      const allParticipants = [currentUserId, ...participantIds];

      const conversationData: Partial<ConversationDocument> = {
        type: "group",
        participants: allParticipants,
        name,
        photoURL: photoURL || null,
        createdBy: currentUserId,
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageAt: null,
        lastMessageType: null,
      };

      const docRef = await addDoc(
        collection(firestore, "conversations"),
        conversationData
      );

      const conversation: Conversation = {
        id: docRef.id,
        type: "group",
        participants: allParticipants,
        name,
        photoURL: photoURL || null,
        createdBy: currentUserId,
        createdAt: new Date(),
        lastMessage: null,
        lastMessageAt: null,
        lastMessageType: null,
      };

      return conversation;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async findOneOnOneConversation(
    userId1: string,
    userId2: string
  ): Promise<Conversation | null> {
    try {
      const conversationsRef = collection(firestore, "conversations");
      const q = query(
        conversationsRef,
        where("type", "==", "oneOnOne"),
        where("participants", "array-contains", userId1)
      );

      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        const data = doc.data() as ConversationDocument;
        if (data.participants.includes(userId2)) {
          return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
            lastMessageAt: (data.lastMessageAt as Timestamp)?.toDate() || null,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error finding conversation:", error);
      return null;
    }
  },

  getUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ) {
    const conversationsRef = collection(firestore, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const conversations: Conversation[] = snapshot.docs.map((doc) => {
          const data = doc.data() as ConversationDocument;
          return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
            lastMessageAt: (data.lastMessageAt as Timestamp)?.toDate() || null,
          };
        });

        // Cache conversations
        storageService.saveConversations(conversations);

        callback(conversations);
      },
      (error) => {
        console.error("Error listening to conversations:", error);
      }
    );

    return unsubscribe;
  },

  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const docRef = doc(firestore, "conversations", conversationId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data() as ConversationDocument;
      return {
        id: snapshot.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        lastMessageAt: (data.lastMessageAt as Timestamp)?.toDate() || null,
      };
    } catch (error) {
      console.error("Error getting conversation:", error);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, orderBy("displayName"));
      const snapshot = await getDocs(q);

      const users: User[] = snapshot.docs.map((doc) => {
        const data = doc.data() as UserDocument;
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        };
      });

      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  },

  async addGroupMembers(
    conversationId: string,
    newMemberIds: string[]
  ): Promise<void> {
    try {
      const conversationRef = doc(firestore, "conversations", conversationId);
      const snapshot = await getDoc(conversationRef);

      if (!snapshot.exists()) {
        throw new Error("Conversation not found");
      }

      const data = snapshot.data() as ConversationDocument;
      const updatedParticipants = [
        ...new Set([...data.participants, ...newMemberIds]),
      ];

      await updateDoc(conversationRef, {
        participants: updatedParticipants,
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async updateGroupInfo(
    conversationId: string,
    updates: { name?: string; photoURL?: string }
  ): Promise<void> {
    try {
      const conversationRef = doc(firestore, "conversations", conversationId);
      await updateDoc(conversationRef, updates);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },
};
