import Library from "../assets/data/library.json";
import React, { useEffect, useRef } from "react";
import { FlatList, FlatListProps, Text, View } from "react-native";
import { TracksListItem } from "./TrackListItem";
import TrackPlayer, { Track } from "react-native-track-player";
import { saveListeningHistory } from "@/services/cacheService";
import { useQueue } from "@/store/queue";
import { fetchSong } from "@/lib/spotify";
import { Box, Center, HStack } from "./ui";
import { Heading } from "./ui/heading";
import { MyTrack } from "@/types/zing.types";
import { playPlaylistFromTrack } from "@/services/playbackService";
import Animated, {
  FlatListPropsWithLayout,
  LinearTransition,
} from "react-native-reanimated";

export type TracksListProps = Partial<FlatListPropsWithLayout<MyTrack>> & {
  id: string;
  tracks: MyTrack[];
  trackClassName?: string;
  hideQueueControls?: boolean;
  showIndex?: boolean;
  variant?: "album" | "playlist";
  onTrackSelect?: (track: MyTrack) => void;
  onTrackOptionPress?: (track: MyTrack) => void;
  children?: React.ReactNode;
};

export const TracksList = ({
  id,
  tracks,
  hideQueueControls = false,
  trackClassName,
  onTrackSelect,
  onTrackOptionPress,
  children,
  variant = "playlist",
  showIndex = false,
  ...flatlistProps
}: TracksListProps) => {
  const queueOffset = useRef(0);
  const { activeQueueId, setActiveQueueId } = useQueue();

  const handleTrackSelect = async (selectedTrack: MyTrack) => {
    console.log("selectedTrack", selectedTrack);
    // const trackIndex = tracks.findIndex(
    //   (track) => track.url === selectedTrack.url
    // );

    // if (trackIndex === -1) return;

    // const isChangingQueue = id !== activeQueueId;

    // if (isChangingQueue) {
    //   const beforeTracks = tracks.slice(0, trackIndex);
    //   const afterTracks = tracks.slice(trackIndex + 1);

    //   await TrackPlayer.reset();

    //   // we construct the new queue
    //   await TrackPlayer.add(selectedTrack);
    //   await TrackPlayer.add(afterTracks);
    //   await TrackPlayer.add(beforeTracks);

    //   await TrackPlayer.play();
    //   saveListeningHistory(tracks[trackIndex]);

    //   queueOffset.current = trackIndex;
    //   setActiveQueueId(id);
    // } else {
    //   const nextTrackIndex =
    //     trackIndex - queueOffset.current < 0
    //       ? tracks.length + trackIndex - queueOffset.current
    //       : trackIndex - queueOffset.current;

    //   await TrackPlayer.skip(nextTrackIndex);
    //   TrackPlayer.play();
    // }
    // if (onTrackSelect) {
    //   onTrackSelect(selectedTrack);
    // } else {
    //   playPlaylistFromTrack(tracks, selectedTrack);
    // }
    playPlaylistFromTrack(tracks, selectedTrack);
  };

  return (
    <Animated.FlatList
      data={tracks || Library}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      itemLayoutAnimation={LinearTransition}
      renderItem={({ item: track, index: index }) => (
        <HStack>
          {showIndex && (
            <Center className="w-14 pr-2">
              <Text className="text-primary-500 text-lg font-medium mr-4">
                {index + 1}
              </Text>
            </Center>
          )}
          <Box className={`flex-1 ${trackClassName || ""}`}>
            <TracksListItem
              track={track}
              onTrackSelect={handleTrackSelect}
              onRightPress={onTrackOptionPress}
              children={children}
              variant={variant}
            />
          </Box>
        </HStack>
      )}
      ListEmptyComponent={() => (
        <Center className="flex-1">
          <Heading className="text-primary-500 text-center w-2/3"></Heading>
          {children}
        </Center>
      )}
      keyExtractor={(item) => item.id || item.url}
      {...flatlistProps}
    />
  );
};
