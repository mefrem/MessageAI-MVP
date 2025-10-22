import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Conversation } from "@messageai/shared";
import { Avatar } from "../common/Avatar";
import { formatConversationTime } from "../../utils/dateFormatter";

interface ConversationItemProps {
  conversation: Conversation;
  displayName: string;
  displayPhoto?: string;
  currentUserId: string;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  displayName,
  displayPhoto,
  currentUserId,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar uri={displayPhoto} name={displayName || undefined} size={50} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          {conversation.lastMessageAt && (
            <Text style={styles.time}>
              {formatConversationTime(conversation.lastMessageAt)}
            </Text>
          )}
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage || "No messages yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
});
