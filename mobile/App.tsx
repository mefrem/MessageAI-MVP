import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ConversationsProvider } from "./src/contexts/ConversationsContext";
import { NotificationProvider } from "./src/contexts/NotificationContext";
import { MessagesProvider } from "./src/contexts/MessagesContext";
import { NetworkProvider } from "./src/contexts/NetworkContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { notificationService } from "./src/services/notificationService";

export default function App() {
  useEffect(() => {
    // Register for push notifications
    notificationService.registerForNotifications();

    // Set up notification listeners
    const cleanup = notificationService.setupNotificationListeners(
      (notification) => {
        console.log("Notification received:", notification);
      },
      (response) => {
        console.log("Notification tapped:", response);
        // TODO: Navigate to conversation
      }
    );

    return cleanup;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <NetworkProvider>
          <AuthProvider>
            <ConversationsProvider>
              <NotificationProvider>
                <MessagesProvider>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </MessagesProvider>
              </NotificationProvider>
            </ConversationsProvider>
          </AuthProvider>
        </NetworkProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
