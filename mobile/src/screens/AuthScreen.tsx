import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  SegmentedButtons,
  Snackbar,
} from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import {
  getEmailError,
  getPasswordError,
  getDisplayNameError,
} from "../utils/validators";

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    // Validation
    const emailError = getEmailError(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (mode === "signup") {
      const nameError = getDisplayNameError(displayName);
      if (nameError) {
        setError(nameError);
        return;
      }
    }

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineLarge" style={styles.title}>
            MessageAI
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Messaging with intelligence
          </Text>

          <SegmentedButtons
            value={mode}
            onValueChange={(value) => setMode(value as "signin" | "signup")}
            buttons={[
              { value: "signin", label: "Sign In" },
              { value: "signup", label: "Sign Up" },
            ]}
            style={styles.segmented}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            mode="outlined"
            style={styles.input}
          />

          {mode === "signup" && (
            <TextInput
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              mode="outlined"
              style={styles.input}
            />
          )}

          <Button
            mode="contained"
            onPress={handleAuth}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={3000}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  segmented: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});
