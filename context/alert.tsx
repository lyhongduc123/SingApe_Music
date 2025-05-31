import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { InfoIcon } from "@/components/ui/icon";
import React, { createContext, useContext, useState } from "react";
import Animated, { FadeOut } from "react-native-reanimated";
import { Dimensions, StyleSheet } from "react-native";

interface AlertContextType {
  showAlert: (message: string) => void;
  hideAlert: () => void;
}

const { width, height } = Dimensions.get("window");

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showAlert = (message: string, duration = 3000) => {
    setMessage(message);
    setVisible(true);

    // Auto-hide after `duration` milliseconds
    setTimeout(() => {
      hideAlert();
    }, duration);
  };

  const hideAlert = () => setVisible(false);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {visible && (
        <Animated.View
          exiting={FadeOut}
          style={[
            styles.alertContainer,
            {
              top: (height * 3) / 4,
              width: width * 0.8,
              left: width * 0.125, // (1 - 0.75) / 2 = 0.125
            },
          ]}
        >
          <Alert action="muted" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText
                style={{ flexShrink: 1, flexWrap: "wrap" }}
            >{message}</AlertText>
          </Alert>
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    zIndex: 999,
  },
});
