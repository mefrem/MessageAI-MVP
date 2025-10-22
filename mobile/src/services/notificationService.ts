import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { authService } from "./authService";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async registerForNotifications(): Promise<string | null> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push notification permissions");
        return null;
      }

      // Get FCM token
      const token = (await Notifications.getExpoPushTokenAsync()).data;

      // Save token to Firestore
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        await authService.saveFCMToken(currentUser.uid, token);
      }

      return token;
    } catch (error) {
      console.error("Error registering for notifications:", error);
      return null;
    }
  },

  setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationTapped: (response: Notifications.NotificationResponse) => void
  ) {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        onNotificationTapped
      );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  },

  async scheduleForegroundNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  },

  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  },
};

