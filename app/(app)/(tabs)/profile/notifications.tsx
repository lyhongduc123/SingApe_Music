import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { Heading } from "@/components/ui/heading";
import { FlatList, Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Stack } from "expo-router";

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import Animated, { LinearTransition } from "react-native-reanimated";
import { MyTrack } from "@/types/zing.types";
import { unknownTrackImageSource } from "@/constants/image";
import { VStack } from "@gluestack-ui/themed";

interface Notification {
  id: string;
  title: string;
  message: string;
  artwork: string;
  timestamp?: string; // Optional timestamp for the notification
}

export default function Notifications() {
  const [data, setData] = useState<Notification[] | null>([]); // Replace with actual data fetching logic

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = [
        {
          id: "1",
          title: "New Message",
          message: "You have received a new message from John Doe.",
          artwork: unknownTrackImageSource,
          timestamp: "2023-10-01T12:00:00Z", // Example timestamp
        },
        {
          id: "2",
          title: "Update Available",
          message: "A new version of the app is available.",
          artwork: unknownTrackImageSource,
          timestamp: "2023-10-02T14:30:00Z", // Example timestamp
        },
      ];
      setData(notifications);
    };

    fetchNotifications();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CustomHeader title="Thông báo" showBack={true} headerClassName="px-2" />
      <Animated.FlatList
        data={data}
        itemLayoutAnimation={LinearTransition}
        ItemSeparatorComponent={() => (<View className="h-3" />)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              // Handle notification press
              console.log(`Notification pressed: ${item.title}`);
            }}
            className="data-[active=true]:bg-background-200"
          >
            <HStack space="md" className="px-2">
              <Image source={item.artwork} className="w-16 h-16" />
              <VStack>
                <Heading className="text-base font-semibold">
                  {item.title}
                </Heading>
                <Text className="text-sm text-gray-500">{item.message}</Text>
              </VStack>
            </HStack>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
