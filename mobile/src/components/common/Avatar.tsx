import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Avatar as PaperAvatar } from "react-native-paper";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 40 }) => {
  if (uri) {
    return <PaperAvatar.Image size={size} source={{ uri }} />;
  }

  if (name) {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return <PaperAvatar.Text size={size} label={initials} />;
  }

  return <PaperAvatar.Icon size={size} icon="account" />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
