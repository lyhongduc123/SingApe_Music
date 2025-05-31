import { PlaylistScreen } from "@/components/screens/PlaylistScreen";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Text,
  VStack,
} from "@/components/ui";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, FlatList, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors, { purple, transparent } from "tailwindcss/colors";
import { ButtonIcon } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  CirclePlus,
  Play,
  Shuffle,
} from "lucide-react-native";
import { AlbumScreen } from "@/components/screens/AlbumScreen";
import { MyTrack, Playlist } from "@/types/zing.types";
import { useEffect, useState } from "react";
import {
  checkPlaylistExists,
  createPlaylist,
  createPlaylistWithTracks,
} from "@/services/fileService";
import { fetchPlaylist } from "@/lib/spotify";
import { convertZingToTrack } from "@/helpers/convert";
import {
  generateTracksListId,
  playPlaylist,
  playTrack,
} from "@/services/playbackService";
import TrackPlayer, { Track, useIsPlaying } from "react-native-track-player";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/auth";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import { useQueueStore } from "@/store/queue";
import { fetchSong } from "@/lib/spotify";

export default function Album() {
  const item = useLocalSearchParams<MyTrack>();
  const [data, setData] = useState<MyTrack[]>([]);
  const [isInUserPlaylist, setIsInUserPlaylist] = useState(false);
  const { user } = useAuth();
  const { playing } = useIsPlaying();
  const activeQueueId = useQueueStore((state) => state.activeQueueId);
  const setActiveQueueId = useQueueStore((state) => state.setActiveQueueId);

  const fetchAlbum = async () => {
    // const response = await getAlbumById(item.id);
    const response: Playlist = await fetchPlaylist(item.id);
    setData(
      await Promise.all(
        response.song.items.map(async (track) => {
          return convertZingToTrack(track);
        })
      )
    );
    setIsInUserPlaylist(await checkPlaylistExists(item.id));
  };

  useEffect(() => {
    fetchAlbum();
  }, []);

  const title = "Album";

  const onPlayPress = async () => {
    const queueId = item.id;
    if (activeQueueId === queueId) {
      if (!playing) {
        TrackPlayer.play();
        return;
      }

      TrackPlayer.pause();
    }
    // } else {
    //   setActiveQueueId(queueId);
    //   playPlaylist(data);
    // }
  };

  const onShufflePress = () => {
    playPlaylist(data.sort(() => Math.random() - 0.5));
  };

  const onTrackPress = (track: Track) => {
    playTrack(track);
  };

  const onAddToPlaylistPress = async () => {
    await createPlaylistWithTracks(
      user?.user_metadata?.display_name ?? "Unknown User",
      item.id ?? "Unknown Album",
      item.title ?? "Danh sách phát " + item.id,
      item.artwork ?? "",
      "Danh sách phát của " + (item.artists[0]?.name ?? "Unknown Artist"),
      data
    );
  };

  const onOptionPress = () => {
    // Handle options action
  };

  return (
    <View className="flex-1 bg-background-0">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AlbumScreen
        id={item.id}
        imageUrl={item.artwork}
        title={item.title}
        artists={item.artists}
        tracks={data.slice(0, 10)}
        releaseDate={item.releaseDate}
        onPlayPress={onPlayPress}
        onShufflePress={onShufflePress}
        onAddToPlaylistPress={onAddToPlaylistPress}
        onOptionPress={onOptionPress}
        onTrackPress={onTrackPress}
        inUserPlaylist={isInUserPlaylist}
      />
      <MyBottomSheet></MyBottomSheet>
    </View>
  );
}
