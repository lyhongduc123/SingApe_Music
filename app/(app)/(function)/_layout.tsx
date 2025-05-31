import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      <Stack.Screen
        name="createPlaylist"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="addToPlaylist" options={{ headerShown: false }} />
      
      <Stack.Screen
        name="editPlaylist"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="search"
       options={{ headerShown: false,
        presentation: "modal",
        }} />
      <Stack.Screen name="searchSong" options={{ headerShown: false }} />
    </Stack>
  );
}
