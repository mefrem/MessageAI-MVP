import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar, Chip } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useConversations } from "../contexts/ConversationsContext";
import { useAuth } from "../contexts/AuthContext";
import { mediaService } from "../services/mediaService";
import { getGroupNameError } from "../utils/validators";
import { Avatar } from "../components/common/Avatar";
import { authService } from "../services/authService";
import { User } from "@messageai/shared";

export const GroupCreateScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { selectedUserIds } = route.params;
  const { createGroup } = useConversations();
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMembers();
  }, [selectedUserIds]);

  const loadMembers = async () => {
    const userProfiles: User[] = [];
    for (const userId of selectedUserIds) {
      const profile = await authService.getUserProfile(userId);
      if (profile) {
        userProfiles.push(profile);
      }
    }
    setMembers(userProfiles);
  };

  const handlePickImage = async () => {
    try {
      const image = await mediaService.selectImage("gallery");
      if (image) {
        setPhotoURL(image.uri);
      }
    } catch (err: any) {
      setError(err.message || "Failed to select image");
    }
  };

  const handleCreate = async () => {
    const nameError = getGroupNameError(groupName);
    if (nameError) {
      setError(nameError);
      return;
    }

    if (!user || !user.id) {
      setError("You must be signed in to create a group");
      return;
    }

    try {
      setLoading(true);

      let uploadedPhotoURL: string | undefined;
      if (photoURL) {
        const tempId = `group_${Date.now()}`;
        uploadedPhotoURL = await mediaService.uploadGroupImage(
          tempId,
          photoURL
        );
      }

      const conversation = await createGroup(
        groupName,
        selectedUserIds,
        uploadedPhotoURL || undefined
      );

      navigation.replace("Chat", { conversationId: conversation.id });
    } catch (err: any) {
      setError(err.message || "Failed to create group");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Create Group Chat
      </Text>

      <View style={styles.avatarContainer}>
        <Avatar uri={photoURL} name={groupName} size={100} />
        <Button
          mode="text"
          onPress={handlePickImage}
          style={styles.changePhotoButton}
        >
          Add Group Photo
        </Button>
      </View>

      <TextInput
        label="Group Name"
        value={groupName}
        onChangeText={setGroupName}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="titleSmall" style={styles.membersTitle}>
        Members ({members.length})
      </Text>

      <View style={styles.membersContainer}>
        {members.map((member) => (
          <Chip
            key={member.id}
            style={styles.memberChip}
            avatar={
              <Avatar
                uri={member.photoURL}
                name={member.displayName}
                size={24}
              />
            }
          >
            {member.displayName}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleCreate}
        loading={loading}
        disabled={loading || !groupName.trim()}
        style={styles.button}
      >
        Create Group
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
    marginBottom: 24,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 24,
  },
  membersTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  memberChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});
