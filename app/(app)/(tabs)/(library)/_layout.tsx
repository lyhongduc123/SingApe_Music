import { Stack } from "expo-router";

export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="favorite" options={{ headerShown: false }} />
      <Stack.Screen name="download" options={{ headerShown: false }} />
      <Stack.Screen name="follow" options={{ headerShown: false }} />
    </Stack>
  );
}
