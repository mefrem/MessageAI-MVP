export type MessageType = "text" | "image";
export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  text: string | null;
  imageURL: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  senderId: string;
  timestamp: Date;
  status: MessageStatus;
  readBy: string[];
}

export interface MessageDocument {
  id: string;
  conversationId: string;
  type: MessageType;
  text: string | null;
  imageURL: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  senderId: string;
  timestamp: any; // Firestore Timestamp
  status: MessageStatus;
  readBy: string[];
}

export interface QueuedMessage {
  id: string;
  conversationId: string;
  type: MessageType;
  text: string | null;
  imageURL: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  senderId: string;
  timestamp: Date;
  retryCount: number;
}
