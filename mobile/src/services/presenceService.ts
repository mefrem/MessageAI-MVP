import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { Presence, PresenceDocument } from "@messageai/shared";
import { AppState, AppStateStatus } from "react-native";

export const presenceService = {
  unsubscribe: null as (() => void) | null,
  appStateSubscription: null as any,

  async setUserOnline(userId: string): Promise<void> {
    try {
      const presenceData: Partial<PresenceDocument> = {
        userId,
        state: "online",
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "presence", userId), presenceData, {
        merge: true,
      });
    } catch (error) {
      console.error("Error setting user online:", error);
    }
  },

  async setUserOffline(userId: string): Promise<void> {
    try {
      const presenceData: Partial<PresenceDocument> = {
        userId,
        state: "offline",
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "presence", userId), presenceData, {
        merge: true,
      });
    } catch (error) {
      console.error("Error setting user offline:", error);
    }
  },

  getUserPresence(
    userId: string,
    callback: (presence: Presence | null) => void
  ) {
    const unsubscribe = onSnapshot(
      doc(firestore, "presence", userId),
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(null);
          return;
        }

        const data = snapshot.data() as PresenceDocument;
        callback({
          ...data,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      },
      (error) => {
        console.error("Error listening to presence:", error);
        callback(null);
      }
    );

    return unsubscribe;
  },

  setupPresenceListeners(userId: string): void {
    // Set user online immediately
    this.setUserOnline(userId);

    // Listen to app state changes
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          this.setUserOnline(userId);
        } else if (
          nextAppState === "background" ||
          nextAppState === "inactive"
        ) {
          this.setUserOffline(userId);
        }
      }
    );

    // Set user offline when app is closed (best effort)
    // Note: This doesn't always work reliably on mobile
    // In production, consider using Firebase Realtime Database's onDisconnect()
  },

  cleanupPresenceListeners(userId: string): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    // Set user offline
    this.setUserOffline(userId);
  },
};
