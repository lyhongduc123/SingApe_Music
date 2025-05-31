import { HStack, Button, Icon } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import TrackPlayer, { Track } from "react-native-track-player";
import { Alert, Pressable, ViewProps } from "react-native";
import { ButtonText } from "./ui/button";
import { Download, Plus } from "lucide-react-native";
import { downloadSong } from "./DowloadMusic";
import { AddSongModal } from "./AddSongModal";
import { useState } from "react";
import Library from "../assets/data/library.json";
import { usePlaylists } from "@/store/library";
type QueueControlsProps = {
  tracks: Track[];
  playlist: string;
} & ViewProps;

export const QueueControls = ({
  tracks,
  playlist,
  style,
  ...viewProps
}: QueueControlsProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleShufflePlay = async () => {
    const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
    await TrackPlayer.setQueue(shuffledTracks);
    await TrackPlayer.play();
  };

  const handleDownload = async () => {
    Alert.alert("Starting playlist download...");

    const results = await Promise.all(
      tracks.map(async (track) => {
        const title = `${track.title ?? "nhacuatoi"}.mp3`;
        return await downloadSong(track.url, title);
      })
    );
    console.log("ket qua :", results);
    const downloadedCount = results.filter(Boolean).length;

    Alert.alert(
      "Download Completed",
      `Đã tải ${downloadedCount}/${tracks.length} bài hát thành công.`
    );
  };
  const handleAddSong = async () => {
    setShowAddModal(true);
  };
  return (
    <HStack
      className="w-full items-center justify-center"
      style={style}
      {...viewProps}
    >
      <Pressable
        onPress={handleDownload}
        className="px-3 py-2 rounded-full bg-muted-foreground/10"
      >
        <Download size={24} color="#000" />
      </Pressable>
      <Button
        variant="outline"
        className="flex-1 items-center justify-center bg-muted-foreground/10 rounded-2xl "
        onPress={handleShufflePlay}
      >
        <ButtonText className="text-primary font-semibold text-xl">
          Shuffle
        </ButtonText>
      </Button>
      <Pressable
        onPress={handleAddSong}
        className="p-3 py-2 rounded-full bg-muted-foreground/10"
      >
        <Plus size={24} color="#000" />
      </Pressable>
      <AddSongModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        allTracks={Library}
        playlistName={playlist}
      />
    </HStack>
  );
};
