import React, { useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useConversations } from "../contexts/ConversationsContext";
import { useAuth } from "../contexts/AuthContext";
import { ConversationItem } from "../components/conversation/ConversationItem";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export const ConversationListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const {
    conversations,
    loading,
    refreshConversations,
    getParticipantName,
    getParticipantPhotoURL,
  } = useConversations();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshConversations();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate("Chat", { conversationId });
  };

  const handleNewConversation = () => {
    navigation.navigate("UserSelection");
  };

  if (loading && conversations.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge" style={styles.emptyTitle}>
            No conversations yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Start chatting by tapping the + button
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const otherUserId =
              item.type === "oneOnOne"
                ? item.participants.find((id) => id !== user?.id)
                : null;

            const displayName =
              item.type === "group"
                ? item.name
                : otherUserId
                ? getParticipantName(otherUserId)
                : null;

            const displayPhoto =
              item.type === "group"
                ? item.photoURL
                : otherUserId
                ? getParticipantPhotoURL(otherUserId)
                : null;

            return (
              <ConversationItem
                conversation={item}
                displayName={displayName || "Unknown"}
                displayPhoto={displayPhoto || undefined}
                currentUserId={user?.id || ""}
                onPress={() => handleConversationPress(item.id)}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      <FAB icon="plus" style={styles.fab} onPress={handleNewConversation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
