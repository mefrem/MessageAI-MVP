import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Message } from "@messageai/shared";
import { Avatar } from "../common/Avatar";
import { formatMessageTime } from "../../utils/dateFormatter";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
  senderPhotoURL?: string;
  onImagePress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  senderName,
  senderPhotoURL,
  onImagePress,
}) => {
  const renderStatusIcon = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case "sending":
        return <Icon name="clock-outline" size={14} color="#999" />;
      case "sent":
        return <Icon name="check" size={14} color="#999" />;
      case "delivered":
        return <Icon name="check-all" size={14} color="#999" />;
      case "read":
        return <Icon name="check-all" size={14} color="#2196F3" />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage
          ? styles.ownMessageContainer
          : styles.otherMessageContainer,
      ]}
    >
      {!isOwnMessage && (
        <Avatar uri={senderPhotoURL} name={senderName} size={32} />
      )}

      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {!isOwnMessage && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}

        {message.type === "text" && message.text && (
          <Text style={[styles.text, isOwnMessage && styles.ownText]}>
            {message.text}
          </Text>
        )}

        {message.type === "image" && message.imageURL && (
          <TouchableOpacity onPress={onImagePress} activeOpacity={0.8}>
            <Image
              source={{ uri: message.imageURL }}
              style={[
                styles.image,
                {
                  aspectRatio:
                    message.imageWidth && message.imageHeight
                      ? message.imageWidth / message.imageHeight
                      : 1,
                },
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
            {formatMessageTime(message.timestamp)}
          </Text>
          {renderStatusIcon()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 12,
    maxWidth: "80%",
  },
  ownMessageContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    padding: 10,
    maxWidth: "100%",
    marginHorizontal: 8,
  },
  ownBubble: {
    backgroundColor: "#2196F3",
  },
  otherBubble: {
    backgroundColor: "#E0E0E0",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  ownText: {
    color: "#FFF",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  image: {
    width: 200,
    maxWidth: "100%",
    borderRadius: 8,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "#666",
  },
  ownTimestamp: {
    color: "#E3F2FD",
  },
});

