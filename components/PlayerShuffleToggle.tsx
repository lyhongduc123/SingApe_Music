import { colors } from "@/constants/tokens";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps, useState } from "react";
import { Pressable } from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";

export const PlayerShuffleToggle = ({
  ...iconProps
}: Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);

  const handleShuffle = async () => {
    const currentQueue = await TrackPlayer.getQueue();
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    if (currentTrackIndex === null) {
      console.log("No current track index found");
      return;
    }
    const currentTrack = currentQueue[currentTrackIndex];

    if (isShuffled) {
      await TrackPlayer.setQueue(originalQueue);
      const originalIndex = originalQueue.findIndex(
        (track) => track.id === currentTrack.id
      );
      await TrackPlayer.skip(originalIndex);
      console.log("Shuffle off");
      setIsShuffled(false);
    } else {
      setOriginalQueue(currentQueue);

      const shuffledTracks = [...currentQueue];
      for (let i = shuffledTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTracks[i], shuffledTracks[j]] = [
          shuffledTracks[j],
          shuffledTracks[i],
        ];
      }
      await TrackPlayer.setQueue(shuffledTracks);
      const newIndex = shuffledTracks.findIndex(
        (track) => track.id === currentTrack.id
      );
      await TrackPlayer.skip(newIndex);
      console.log("Shuffle on");
      setIsShuffled(true);
    }
  };

  return (
    <Pressable onPress={handleShuffle}>
      <MaterialCommunityIcons
        name="shuffle"
        color={isShuffled ? colors.primary : colors.icon}
        {...iconProps}
      />
    </Pressable>
  );
};
