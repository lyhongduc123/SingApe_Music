import { Slot, Stack } from 'expo-router'
import { View, Text } from 'react-native'
import { router } from 'expo-router'
export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }}/>
        </Stack>
    )
}