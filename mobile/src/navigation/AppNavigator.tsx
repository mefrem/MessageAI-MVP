import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import { AuthScreen } from "../screens/AuthScreen";
import { ProfileSetupScreen } from "../screens/ProfileSetupScreen";
import { ConversationListScreen } from "../screens/ConversationListScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { UserSelectionScreen } from "../screens/UserSelectionScreen";
import { GroupCreateScreen } from "../screens/GroupCreateScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { NotificationBanner } from "../components/common/NotificationBanner";
import { IconButton } from "react-native-paper";

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {!user ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#2196F3",
              },
              headerTintColor: "#FFF",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          >
            <Stack.Screen
              name="ConversationList"
              component={ConversationListScreen}
              options={({ navigation }) => ({
                title: "Chats",
                headerRight: () => (
                  <IconButton
                    icon="account-circle"
                    iconColor="#FFF"
                    onPress={() => navigation.navigate("Profile")}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="UserSelection"
              component={UserSelectionScreen}
              options={{
                title: "New Chat",
              }}
            />
            <Stack.Screen
              name="GroupCreate"
              component={GroupCreateScreen}
              options={{
                title: "New Group",
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Profile",
              }}
            />
            <Stack.Screen
              name="ProfileSetup"
              component={ProfileSetupScreen}
              options={{
                title: "Edit Profile",
              }}
            />
          </Stack.Navigator>
        )}
        <NotificationBanner />
      </View>
    </NavigationContainer>
  );
};
