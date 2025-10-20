export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  fcmToken?: string;
}
