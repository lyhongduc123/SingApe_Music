import { Slot, SplashScreen, Stack, Tabs, useRouter } from "expo-router";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { AuthProvider } from "../context/auth";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { useLogTrackPlayerState } from "@/hooks/useLogTrackPlayerState";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { playbackService } from "@/services/playbackService";
import TrackPlayer from "react-native-track-player";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useDoubleBackExit } from "@/hooks/useDoubleBackExit";
import { useTrackHistoryLogger } from "@/hooks/useTrackHistoryLogger";
import { ThemeProvider, useTheme } from "@/components/ui/ThemeProvider";
import { ModalProvider } from "@/context/modal";
import { AlertProvider } from "@/context/alert";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { backgroundColor } from "@/constants/tokens";

SplashScreen.preventAutoHideAsync();
TrackPlayer.registerPlaybackService(() => playbackService);

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const handelTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({
    onLoad: handelTrackPlayerLoaded,
  });

  useTrackHistoryLogger();

  const navigation = useNavigation() as NavigationProp<any>;
  useDoubleBackExit(navigation);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      
      if (parsed.hostname === "notification.click") {
        router.replace("/player"); // or "/track/[id]" if needed
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Also check if the app was opened from a deep link (cold start)
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <GluestackWrapper>
          <ModalProvider>
            <AlertProvider>
              <SafeAreaProvider>
                <AuthProvider>
                  <BottomSheetModalProvider>
                    <RootNavigator />
                    <StatusBar style="auto" />
                  </BottomSheetModalProvider>
                </AuthProvider>
              </SafeAreaProvider>
            </AlertProvider>
          </ModalProvider>
        </GluestackWrapper>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function GluestackWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return <GluestackUIProvider mode={theme}>{children}</GluestackUIProvider>;
}

function RootNavigator() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(app)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="player"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="voice"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
