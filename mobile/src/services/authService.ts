import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { User, UserDocument } from "@messageai/shared";
import { handleFirebaseError } from "../utils/errorHandler";
import { storageService } from "./storageService";

export const authService = {
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userData: UserDocument = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        photoURL: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", firebaseUser.uid), userData);

      const user: User = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await storageService.saveUserProfile(user);

      return user;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data() as UserDocument;
      const user: User = {
        ...userData,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };

      await storageService.saveUserProfile(user);

      return user;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      await storageService.clearAll();
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(firestore, "users", userId));

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserDocument;
      return {
        ...userData,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  },

  async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", userId), updateData, {
        merge: true,
      });

      if (updates.displayName || updates.photoURL) {
        const currentProfile = await storageService.getUserProfile();
        if (currentProfile) {
          await storageService.saveUserProfile({
            ...currentProfile,
            ...updates,
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async saveFCMToken(userId: string, token: string): Promise<void> {
    try {
      await setDoc(
        doc(firestore, "users", userId),
        { fcmToken: token },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  },
};
