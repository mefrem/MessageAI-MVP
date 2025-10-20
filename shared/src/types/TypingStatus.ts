export interface TypingStatus {
  userId: string;
  conversationId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface TypingStatusDocument {
  userId: string;
  conversationId: string;
  isTyping: boolean;
  timestamp: any; // Firestore Timestamp
}
