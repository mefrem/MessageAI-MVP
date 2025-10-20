import React, { useState, useCallback } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ChatInputProps {
  onSendText: (text: string) => void;
  onSendImage: () => void;
  onTyping: (isTyping: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendText,
  onSendImage,
  onTyping,
}) => {
  const [text, setText] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleTextChange = (value: string) => {
    setText(value);

    // Send typing indicator
    onTyping(true);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing indicator
    const timeout = setTimeout(() => {
      onTyping(false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleSend = () => {
    if (text.trim()) {
      onSendText(text.trim());
      setText("");
      onTyping(false);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="image"
        size={24}
        onPress={onSendImage}
        style={styles.imageButton}
      />

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Type a message..."
        multiline
        maxLength={1000}
      />

      <IconButton
        icon="send"
        size={24}
        onPress={handleSend}
        disabled={!text.trim()}
        style={styles.sendButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  imageButton: {
    margin: 0,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 20,
  },
  sendButton: {
    margin: 0,
  },
});
