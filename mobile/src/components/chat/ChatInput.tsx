import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSendText(trimmedText);
      setText("");
      onTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);

    // Send typing indicator
    if (value.trim()) {
      onTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
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
        ref={inputRef}
        style={styles.input}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Type a message..."
        multiline={false}
        maxLength={1000}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        enablesReturnKeyAutomatically
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
