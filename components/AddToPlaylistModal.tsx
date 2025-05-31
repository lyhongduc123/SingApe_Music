import React, { useState } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, Button, Modal, Checkbox } from "@/components/ui";
import { TrackWithPlaylist } from "@/helpers/types";
import { usePlaylists } from "@/store/library";
import { CheckboxIndicator } from "./ui/checkbox";
import { ButtonText } from "./ui/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type AddToPlaylistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  track: TrackWithPlaylist;
};

export const AddToPlaylistModal = ({
  isOpen,
  onClose,
  track,
}: AddToPlaylistModalProps) => {
  const { playlists, addToPlaylist, createPlaylist } = usePlaylists();
  const [selected, setSelected] = useState<string[]>(track.playlist ?? []);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const toggleSelection = (playlistName: string) => {
    setSelected((prev) =>
      prev.includes(playlistName)
        ? prev.filter((p) => p !== playlistName)
        : [...prev, playlistName]
    );
  };

  const handleConfirm = () => {
    console.log("Selected playlists:", selected);
    selected.forEach((playlistName) => {
      console.log(`Adding to ${playlistName}:`, track);
      addToPlaylist(track, playlistName);
    });
    onClose();
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setSelected((prev) => [...prev, newPlaylistName.trim()]);
      setNewPlaylistName("");
      setShowNewPlaylistInput(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <KeyboardAvoidingView
        behavior="padding"
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[90%] border-t border-gray-200 "
        style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <Text className="text-xl font-bold mb-4 text-center">
          Thêm vào Playlist
        </Text>

        <FlatList
          data={playlists}
          keyExtractor={(item) => item.name}
          className="mb-2"
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.name);
            return (
              <TouchableOpacity
                onPress={() => toggleSelection(item.name)}
                className={`flex-row items-center justify-between p-3 rounded-xl ${
                  isSelected ? "bg-violet-100" : "bg-gray-50"
                } mb-2`}
              >
                <Text className="font-medium text-base">{item.name}</Text>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#7C3AED"
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />

        {showNewPlaylistInput ? (
          <View className="flex-row items-center space-x-2 mb-4">
            <TextInput
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Nhập tên playlist mới"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            <Button onPress={handleCreatePlaylist}>
              <ButtonText>Tạo</ButtonText>
            </Button>
          </View>
        ) : (
          <Button
            variant="outline"
            onPress={() => setShowNewPlaylistInput(true)}
            className="mb-4"
          >
            <ButtonText>+ Tạo Playlist mới</ButtonText>
          </Button>
        )}

        <View className="flex-row justify-between py-4">
          <Button
            onPress={() => {
              onClose();
              setShowNewPlaylistInput(false);
            }}
            variant="outline"
            className="flex-1 mr-2"
          >
            <ButtonText>Hủy</ButtonText>
          </Button>
          <Button onPress={handleConfirm} className="flex-1 ml-2">
            <ButtonText>Xác nhận</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
