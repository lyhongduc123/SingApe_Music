import React, { useState } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AddToPlaylistModal } from "./AddToPlaylistModal";
import { TrackWithPlaylist } from "@/helpers/types";

type Props = {
  track: TrackWithPlaylist;
  iconColor?: string;
  iconSize?: number;
};

export const AddToPlaylistButton = ({
  track,
  iconColor = "white",
  iconSize = 30,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setIsModalOpen(true)}>
        <MaterialCommunityIcons
          name="music-note-plus"
          size={iconSize}
          color={iconColor}
        />
      </Pressable>
      <AddToPlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={track}
      />
    </>
  );
};
