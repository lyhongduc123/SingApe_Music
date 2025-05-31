import React, { useRef } from "react";
import { FlatList, FlatListProps, TouchableOpacity } from "react-native";
import { VStack, Text } from "@/components/ui";
import { TracksListItem } from "../TrackListItem";
import TrackPlayer, { Track } from "react-native-track-player";
import { useQueue } from "@/store/queue";
import { TracksListItem1 } from "../TracksListItem1";

const top100Songs = [
  {
    url: "https://audio.jukehost.co.uk/priWy2vYsWODmQiM6KevNYVLpPJGPZGd",
    title: "Memories",
    playlist: ["Instrumental 🎵"],
  },
  {
    url: "https://audio.jukehost.co.uk/rSmGXxf0OJLipPwFRyvoFKodDOj5VuWf",
    title: "Anxiety",
    artist: "NEFFEX",
    artwork:
      "https://i1.sndcdn.com/artworks-iCqupgQNLXSjKspS-0CGreg-t500x500.jpg",
    playlist: ["Chill 🌱", "Instrumental 🎵", "Rap 🎤"],
  },
  {
    url: "https://audio.jukehost.co.uk/ZLdoXNocDAcsgeq6QKtPRHyvlqslNbke",
    title: "As You Fade Away",
    artist: "NEFFEX",
    artwork: "https://i.ytimg.com/vi/JhUFfaArYk8/maxresdefault.jpg",
    rating: 1,
    playlist: ["Rap 🎤"],
  },
  {
    url: "https://audio.jukehost.co.uk/rZ9sshicVlki8Dnm95ps1eWhK95dYgKF",
    title: "Cattle",
    artist: "Telecasted",
    artwork: "https://i.ytimg.com/vi/rxmWdkluHJ0/maxresdefault.jpg",
    playlist: ["Chill 🌱"],
  },
  {
    url: "https://audio.jukehost.co.uk/ZufGK11EtwQWXge8xYo5EQ02RuJqtr4s",
    title: "Desert Brawl",
    artist: "Vans in Japan",
    artwork: "https://i.ytimg.com/vi/Kk0xLSNMPeQ/maxresdefault.jpg",
  },
  {
    url: "https://audio.jukehost.co.uk/Ge9fdTsk6Y9SWoOnC7QJH0n8pprU7rev",
    title: "mellow-future-bass-bounce-on-it",
    playlist: ["Chill 🌱", "Instrumental 🎵"],
  },
];

export type TracksListProps = Partial<FlatListProps<Track[]>> & {
  id: string;
  hideQueueControls?: boolean;
};
const groupTracks = (tracks: Track[], size: number) => {
  const grouped = [];
  for (let i = 0; i < tracks.length; i += size) {
    grouped.push(tracks.slice(i, i + size));
  }
  return grouped;
};
export const Top100 = ({
  id,
  hideQueueControls = false,
  ...flatlistProps
}: TracksListProps) => {
  const queueOffset = useRef(0);
  const { activeQueueId, setActiveQueueId } = useQueue();
  const number = 2;
  const groupedTracks = groupTracks(top100Songs, number);
  const handleTrackSelect = async (selectedTrack: Track) => {
    const trackIndex = top100Songs.findIndex(
      (track) => track.url === selectedTrack.url
    );

    if (trackIndex === -1) return;

    const isChangingQueue = id !== activeQueueId;

    if (isChangingQueue) {
      const beforeTracks = top100Songs.slice(0, trackIndex);
      const afterTracks = top100Songs.slice(trackIndex + 1);

      await TrackPlayer.reset();

      await TrackPlayer.add(selectedTrack);
      await TrackPlayer.add(afterTracks);
      await TrackPlayer.add(beforeTracks);

      await TrackPlayer.play();

      queueOffset.current = trackIndex;
      setActiveQueueId(id);
    } else {
      const nextTrackIndex =
        trackIndex - queueOffset.current < 0
          ? top100Songs.length + trackIndex - queueOffset.current
          : trackIndex - queueOffset.current;

      await TrackPlayer.skip(nextTrackIndex);
      TrackPlayer.play();
    }
  };

  if (!top100Songs || top100Songs.length === 0) {
    return <Text>No tracks available</Text>;
  }

  return (
    <VStack className="p-4">
      <Text className="text-2xl font-bold mb-2">Top100</Text>
      <FlatList
        data={groupedTracks}
        renderItem={({ item }) => (
          <VStack space="md" className="mr-4" style={{ width: 200 }}>
            {item.map((track) => (
              <TracksListItem
                key={track.url}
                track={track}
                onTrackSelect={handleTrackSelect}
              />
            ))}
          </VStack>
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={true}
        {...flatlistProps}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </VStack>
  );
};
