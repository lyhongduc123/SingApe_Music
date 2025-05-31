import { Slot, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function SongsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"  />
    </Stack>
  );
}
