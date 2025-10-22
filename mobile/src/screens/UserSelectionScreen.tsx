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

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateOneOnOne = async () => {
    if (selectedUsers.length === 1) {
      try {
        setLoading(true);
        const conversation = await createOneOnOne(selectedUsers[0]);
        navigation.replace("Chat", { conversationId: conversation.id });
      } catch (error) {
        console.error("Error creating conversation:", error);
        setLoading(false);
      }
    }
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
      <View style={styles.headerContainer}>
        <Text variant="bodyMedium" style={styles.instructionText}>
          {selectedUsers.length === 0
            ? "Select users to start a chat or create a group"
            : `${selectedUsers.length} user${
                selectedUsers.length > 1 ? "s" : ""
              } selected`}
        </Text>
      </View>
      <Searchbar
        placeholder="Search users..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {selectedUsers.length > 0 && (
        <View style={styles.actionContainer}>
          {selectedUsers.length === 1 ? (
            <Button
              mode="contained"
              onPress={handleCreateOneOnOne}
              style={styles.createGroupButton}
              icon="message"
            >
              Start Chat with {selectedUsers.length} person
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleCreateGroup}
              style={styles.createGroupButton}
              icon="account-group"
            >
              Create Group ({selectedUsers.length} people)
            </Button>
          )}
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
            onPress={() => toggleUserSelection(item.id)}
          >
            <Avatar uri={item.photoURL} name={item.displayName} size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.displayName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            {selectedUsers.includes(item.id) && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
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
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  instructionText: {
    color: "#666",
    textAlign: "center",
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
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
