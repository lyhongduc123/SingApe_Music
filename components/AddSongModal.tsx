import React, { useState, useMemo } from "react";
import { Modal, FlatList, TextInput, Text, Alert } from "react-native";
import { VStack, HStack, Image } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Track } from "react-native-track-player";
import { trackTitleFilter } from "@/helpers/filter";
import { ButtonText } from "@gluestack-ui/themed";
import { unknownTrackImageSource } from "@/constants/image";
import { usePlaylists } from "@/store/library";

type Props = {
  visible: boolean;
  onClose: () => void;
  allTracks: Track[];
  playlistName: string;
};

export const AddSongModal = ({
  visible,
  onClose,
  allTracks,
  playlistName,
}: Props) => {
  const [search, setSearch] = useState("");
  const { addToPlaylist } = usePlaylists();

  const filteredTracks = useMemo(() => {
    if (!search.trim()) return allTracks;
    return allTracks.filter(trackTitleFilter(search));
  }, [search, allTracks]);

  const handleAddTrack = (track: Track) => {
    addToPlaylist(track, playlistName);
    Alert.alert(
      "Đã thêm",
      `"${track.title}" đã được thêm vào playlist "${playlistName}"`
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <VStack className="flex-1 p-4 bg-background justify-between">
        <VStack>
          <Text className="text-xl font-bold mb-4">Thêm bài hát</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm bài hát..."
            className="mb-4 p-2 border border-gray-300 rounded-xl"
          />
        </VStack>

        {search.trim().length > 0 ? (
          <FlatList
            className="flex-1"
            data={filteredTracks}
            keyExtractor={(item) => item.id?.toString() ?? item.url}
            renderItem={({ item }) => (
              <HStack className="items-center justify-between mb-3">
                <HStack className="items-center">
                  <Image
                    source={
                      typeof item.artwork === "string" &&
                      item.artwork.startsWith("http")
                        ? { uri: item.artwork }
                        : unknownTrackImageSource
                    }
                    className="w-12 h-12 rounded mr-3"
                    alt="track artwork"
                  />
                  <VStack className="max-w-[65%]">
                    <Text numberOfLines={1} className="text-base font-semibold">
                      {item.title}
                    </Text>
                    {item.artist && (
                      <Text numberOfLines={1} className="text-muted text-sm">
                        {item.artist}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => handleAddTrack(item)}
                >
                  <ButtonText>Add</ButtonText>
                </Button>
              </HStack>
            )}
            ListEmptyComponent={
              <Text className="text-center text-muted mt-8">
                Không tìm thấy bài hát nào...
              </Text>
            }
          />
        ) : (
          <Text className="text-center text-muted mt-8">
            Nhập từ khóa để tìm bài hát...
          </Text>
        )}

        <Button variant="outline" className="mt-4" onPress={onClose}>
          <ButtonText>Đóng</ButtonText>
        </Button>
      </VStack>
    </Modal>
  );
};
