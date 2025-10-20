import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface LoadingSpinnerProps {
  size?: "small" | "large";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
