import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import NetInfo from "@react-native-community/netinfo";

export interface NetworkContextValue {
  isOnline: boolean;
  connectionType: string | null;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(
  undefined
);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(
        state.isConnected === true && state.isInternetReachable !== false
      );
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value: NetworkContextValue = {
    isOnline,
    connectionType,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

