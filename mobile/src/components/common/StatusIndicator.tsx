import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { PresenceState } from "@messageai/shared";
import { formatLastSeen } from "../../utils/dateFormatter";

interface StatusIndicatorProps {
  state: PresenceState;
  lastSeen?: Date;
  size?: "small" | "medium";
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  state,
  lastSeen,
  size = "small",
}) => {
  const dotSize = size === "small" ? 8 : 12;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          { width: dotSize, height: dotSize },
          state === "online" ? styles.online : styles.offline,
        ]}
      />
      {size === "medium" && lastSeen && state === "offline" && (
        <Text style={styles.text}>Last seen {formatLastSeen(lastSeen)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    borderRadius: 100,
    marginRight: 4,
  },
  online: {
    backgroundColor: "#4CAF50",
  },
  offline: {
    backgroundColor: "#9E9E9E",
  },
  text: {
    fontSize: 12,
    color: "#666",
  },
});
