import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useConversations } from "../contexts/ConversationsContext";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "../components/common/Avatar";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { User } from "@messageai/shared";

export const UserSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { getAllUsers, createOneOnOne } = useConversations();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      const otherUsers = allUsers.filter((u) => u.id !== user?.id);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUserPress = async (selectedUser: User) => {
    try {
      setLoading(true);
      const conversation = await createOneOnOne(selectedUser.id);
      navigation.replace("Chat", { conversationId: conversation.id });
    } catch (error) {
      console.error("Error creating conversation:", error);
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length >= 2) {
      navigation.navigate("GroupCreate", { selectedUserIds: selectedUsers });
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search users..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {selectedUsers.length >= 2 && (
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={handleCreateGroup}
            style={styles.createGroupButton}
          >
            Create Group ({selectedUsers.length} selected)
          </Button>
        </View>
      )}

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.userItem,
              selectedUsers.includes(item.id) && styles.selectedUserItem,
            ]}
            onPress={() => handleUserPress(item)}
            onLongPress={() => toggleUserSelection(item.id)}
          >
            <Avatar uri={item.photoURL} name={item.displayName} size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.displayName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No users found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  searchBar: {
    margin: 12,
  },
  actionContainer: {
    padding: 12,
    paddingTop: 0,
  },
  createGroupButton: {
    paddingVertical: 4,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  selectedUserItem: {
    backgroundColor: "#E3F2FD",
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
