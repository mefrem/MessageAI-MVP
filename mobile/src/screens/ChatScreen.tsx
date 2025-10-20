import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useMessages } from "../contexts/MessagesContext";
import { useAuth } from "../contexts/AuthContext";
import { useConversations } from "../contexts/ConversationsContext";
import { MessageBubble } from "../components/chat/MessageBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { User, Conversation } from "@messageai/shared";
import { authService } from "../services/authService";
import { Avatar } from "../components/common/Avatar";

export const ChatScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { conversationId } = route.params;
  const { user } = useAuth();
  const {
    startListening,
    getMessages,
    sendTextMessage,
    sendImageMessage,
    markMessagesAsRead,
    setTyping,
    typingUsers,
  } = useMessages();
  const { getConversation } = useConversations();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUsers, setOtherUsers] = useState<Record<string, User>>({});
  const flatListRef = useRef<FlatList>(null);

  const messages = getMessages(conversationId);
  const typingUserNames =
    typingUsers[conversationId]
      ?.map((id) => otherUsers[id]?.displayName)
      .filter(Boolean) || [];

  // Start listening to messages when component mounts
  useEffect(() => {
    startListening(conversationId);
  }, [conversationId]);

  useEffect(() => {
    // Load conversation details
    const loadConversation = async () => {
      const conv = await getConversation(conversationId);
      if (conv) {
        setConversation(conv);

        // Load other users' profiles
        const userProfiles: Record<string, User> = {};
        for (const userId of conv.participants) {
          if (userId !== user?.id) {
            const profile = await authService.getUserProfile(userId);
            if (profile) {
              userProfiles[userId] = profile;
            }
          }
        }
        setOtherUsers(userProfiles);

        // Update navigation header
        if (conv.type === "oneOnOne") {
          const otherUser = Object.values(userProfiles)[0];
          navigation.setOptions({
            headerTitle: () => (
              <View style={styles.headerTitle}>
                <Avatar
                  uri={otherUser?.photoURL}
                  name={otherUser?.displayName}
                  size={32}
                />
                <Text style={styles.headerText}>
                  {otherUser?.displayName || "Chat"}
                </Text>
              </View>
            ),
          });
        } else {
          navigation.setOptions({
            headerTitle: () => (
              <View style={styles.headerTitle}>
                <Avatar
                  uri={conv.photoURL}
                  name={conv.name || undefined}
                  size={32}
                />
                <Text style={styles.headerText}>
                  {conv.name || "Group Chat"}
                </Text>
              </View>
            ),
          });
        }
      }
    };

    loadConversation();
  }, [conversationId, user?.id]);

  useEffect(() => {
    // Mark messages as read when viewing
    if (messages.length > 0 && user) {
      const unreadMessages = messages.filter(
        (msg) => msg.senderId !== user.id && msg.status !== "read"
      );
      if (unreadMessages.length > 0) {
        markMessagesAsRead(
          conversationId,
          unreadMessages.map((msg) => msg.id)
        );
      }
    }
  }, [messages, user, conversationId]);

  const handleSendText = async (text: string) => {
    try {
      await sendTextMessage(conversationId, text);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendImage = async () => {
    try {
      await sendImageMessage(conversationId);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    setTyping(conversationId, isTyping);
  };

  if (!conversation) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isOwnMessage = item.senderId === user?.id;
          const sender = isOwnMessage ? user : otherUsers[item.senderId];

          return (
            <MessageBubble
              message={item}
              isOwnMessage={isOwnMessage}
              senderName={sender?.displayName}
              senderPhotoURL={sender?.photoURL || undefined}
            />
          );
        }}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {typingUserNames.length > 0 && (
        <TypingIndicator userNames={typingUserNames} />
      )}

      <ChatInput
        onSendText={handleSendText}
        onSendImage={handleSendImage}
        onTyping={handleTyping}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  messageList: {
    paddingVertical: 8,
  },
});
