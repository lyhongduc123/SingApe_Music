import { useAuth } from "@/context/auth";
import { router, Stack } from "expo-router";

export default function AuthLayout() {
  const { session } = useAuth();
  if (session) {
    console.log("AuthLayout: User is authenticated, redirecting to app");
    return router.replace("/(app)/(tabs)/(songs)");
  }
  return (
    <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000000" },
            animation: "fade_from_bottom",
            animationDuration: 1000,
            gestureEnabled: true,
        }}
    >
        <Stack.Screen name="index" />
        <Stack.Screen name="register"  />
        <Stack.Screen name="login" />
    </Stack>
  );
}