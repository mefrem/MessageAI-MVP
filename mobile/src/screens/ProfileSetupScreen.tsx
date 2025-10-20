import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { mediaService } from "../services/mediaService";
import { getDisplayNameError } from "../utils/validators";
import { Avatar } from "../components/common/Avatar";

export const ProfileSetupScreen: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState<string | null>(
    user?.photoURL || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePickImage = async () => {
    try {
      const image = await mediaService.selectImage("gallery");
      if (image) {
        setLoading(true);
        const uploadedURL = await mediaService.uploadProfileImage(
          user!.id,
          image.uri
        );
        setPhotoURL(uploadedURL);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const nameError = getDisplayNameError(displayName);
    if (nameError) {
      setError(nameError);
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        displayName,
        photoURL,
      });
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Set up your profile
      </Text>

      <View style={styles.avatarContainer}>
        <Avatar uri={photoURL} name={displayName} size={120} />
        <Button
          mode="text"
          onPress={handlePickImage}
          style={styles.changePhotoButton}
        >
          Change Photo
        </Button>
      </View>

      <TextInput
        label="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Save Profile
      </Button>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={3000}
      >
        {error}
      </Snackbar>
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
  title: {
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});
