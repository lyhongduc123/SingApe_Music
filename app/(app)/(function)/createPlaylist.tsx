import { Box, HStack, Input, VStack } from "@/components/ui";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { InputField } from "@/components/ui/input";
import { unknownTrackImageSource } from "@/constants/image";
import { useAuth } from "@/context/auth";
import {
  createPlaylist,
  createPlaylistWithTracks,
} from "@/services/cacheService";
import { MyTrack } from "@/types/zing.types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function createPlaylistScreen() {
  const [playlistName, setPlaylistName] = useState<string>("");
  const { user } = useAuth();
  const item = useLocalSearchParams<MyTrack>();

  const handleCreatePlaylist = async () => {
    try {
      if (!item.id) {
        const res = await createPlaylist (
          user?.user_metadata.display_name,
          playlistName,
          playlistName,
          "",
          "Danh sách phát của " + user?.user_metadata.display_name
        );
      } else {
      const res = await createPlaylistWithTracks(
        user?.user_metadata.display_name,
        playlistName,
        playlistName,
        "",
        "Danh sách phát của " + user?.user_metadata.display_name,
        [item]
      );
    }
    router.back();
    } catch (error) {
      console.log("Error creating playlist:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <VStack space="lg" className="flex-1 justify-center items-center px-6">
        <Heading className="text-2xl font-bold mb-4">
          Đặt tên cho danh sách phát
        </Heading>
        <Input variant="underlined" className="px-4">
          <InputField
            placeholder="Nhập tên danh sách phát"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            returnKeyType="done"
            onChangeText={(text) => setPlaylistName(text)}
          />
        </Input>
        <HStack space="lg" className="w-full items-center justify-center">
          <Button
            onPress={() => router.back()}
            variant="outline"
            className="w-24 h-14 rounded-full justify-center items-center mt-4"
          >
            <ButtonText>Hủy</ButtonText>
          </Button>
          <Button
            onPress={() => handleCreatePlaylist()}
            action="positive"
            className="w-24 h-14 rounded-full justify-center items-center mt-4"
          >
            <ButtonText>Tạo</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
