import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User } from "@messageai/shared";
import { authService } from "../services/authService";
import { presenceService } from "../services/presenceService";
import { storageService } from "../services/storageService";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cached user profile
    storageService.getUserProfile().then((cachedUser) => {
      if (cachedUser) {
        setUser(cachedUser);
      }
      setLoading(false);
    });

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await authService.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
          // Set up presence tracking
          presenceService.setupPresenceListeners(firebaseUser.uid);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (user) {
        presenceService.cleanupPresenceListeners(user.id);
      }
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    try {
      const newUser = await authService.signUp(email, password, displayName);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.signIn(email, password);
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (user) {
        presenceService.cleanupPresenceListeners(user.id);
      }
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      await authService.updateUserProfile(user.id, updates);
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
