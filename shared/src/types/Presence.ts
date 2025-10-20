export type PresenceState = "online" | "offline";

export interface Presence {
  userId: string;
  state: PresenceState;
  lastSeen: Date;
  updatedAt: Date;
}

export interface PresenceDocument {
  userId: string;
  state: PresenceState;
  lastSeen: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
