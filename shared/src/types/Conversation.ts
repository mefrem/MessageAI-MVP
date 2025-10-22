export type ConversationType = "oneOnOne" | "group";

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
  lastMessageType: "text" | "image" | null;
}

export interface ConversationDocument {
  id: string;
  type: ConversationType;
  participants: string[];
  name: string | null;
  photoURL: string | null;
  createdBy: string;
  createdAt: any; // Firestore Timestamp
  lastMessage: string | null;
  lastMessageAt: any | null; // Firestore Timestamp
  lastMessageType: "text" | "image" | null;
}

