import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "../components/common/Avatar";

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const handleEditProfile = () => {
    navigation.navigate("ProfileSetup");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <Avatar uri={user.photoURL} name={user.displayName} size={120} />
        <Text variant="headlineMedium" style={styles.displayName}>
          {user.displayName}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          {user.email}
        </Text>
      </View>

      <Button mode="outlined" onPress={handleEditProfile} style={styles.button}>
        Edit Profile
      </Button>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Account
        </Text>
        <Text variant="bodyMedium" style={styles.sectionText}>
          Account created: {user.createdAt.toLocaleDateString()}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleSignOut}
        style={styles.signOutButton}
        buttonColor="#F44336"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    padding: 24,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  displayName: {
    marginTop: 16,
    fontWeight: "600",
  },
  email: {
    marginTop: 4,
    color: "#666",
  },
  button: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  sectionText: {
    color: "#666",
  },
  signOutButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
});

