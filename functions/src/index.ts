import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export Cloud Functions
export { onMessageCreated } from "./triggers/onMessageCreated";
