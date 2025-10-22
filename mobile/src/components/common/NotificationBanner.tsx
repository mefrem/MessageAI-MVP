import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigation } from "@react-navigation/native";

export const NotificationBanner: React.FC = () => {
  const { notification, dismissNotification } = useNotification();
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (notification) {
      // Slide in from top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [notification]);

  const handlePress = () => {
    if (notification) {
      dismissNotification();
      navigation.navigate("Chat", {
        conversationId: notification.conversationId,
        conversationName: notification.conversationName,
      });
    }
  };

  if (!notification) return null;

  const topOffset = Platform.OS === "ios" ? 50 : 10;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: topOffset,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.surface}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text variant="labelLarge" style={styles.title} numberOfLines={1}>
                {notification.senderName}
              </Text>
              <Text
                variant="bodySmall"
                style={styles.subtitle}
                numberOfLines={1}
              >
                {notification.conversationName}
              </Text>
              <Text
                variant="bodyMedium"
                style={styles.message}
                numberOfLines={2}
              >
                {notification.messageText}
              </Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                dismissNotification();
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  surface: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  subtitle: {
    color: "#666",
    marginBottom: 4,
  },
  message: {
    color: "#333",
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#666",
    fontSize: 16,
    lineHeight: 20,
  },
});
