import { useAuth } from "@/context/auth";
import { router, Stack, Tabs } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Tabs.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(function)" options={{ headerShown: false }} />
        </Stack>
    );
}