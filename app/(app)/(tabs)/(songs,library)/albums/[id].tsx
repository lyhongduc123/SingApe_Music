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
import { Artist, MyTrack, Playlist } from "@/types/zing.types";
import { useEffect, useState } from "react";
import {
  checkPlaylistExists,
  createPlaylist,
  createPlaylistWithTracks,
  deletePlaylist,
} from "@/services/cacheService";
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
import { useLibraryStore } from "@/store/mylib";

export default function Album() {
  const item = useLocalSearchParams<MyTrack>();
  const [data, setData] = useState<MyTrack[]>([]);
  const [isInUserPlaylist, setIsInUserPlaylist] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [userName, setUserName] = useState<string>("");
  const { user } = useAuth();
  const { playing } = useIsPlaying();
  const activeQueueId = useQueueStore((state) => state.activeQueueId);
  const setActiveQueueId = useQueueStore((state) => state.setActiveQueueId);
  const queueId = generateTracksListId(item.title || "Unknown", item.id);
  const libraryStore = useLibraryStore();

  const fetchAlbum = async () => {
    // const response = await getAlbumById(item.id);
    const response: Playlist = await fetchPlaylist(item.id);
    setArtists(response.artists.map((artist) => artist));
    setUserName(response.userName);
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
    if (activeQueueId === queueId) {
      if (!playing) {
        TrackPlayer.play();
        return;
      }

      TrackPlayer.pause();
    } else {
      setActiveQueueId(queueId);
      await playPlaylist(data);
    }
  };

  const onShufflePress = async () => {
    if (activeQueueId === queueId) {
      if (!playing) {
        await TrackPlayer.play();
        return;
      }

      await TrackPlayer.pause();
    } else {
      setActiveQueueId(queueId);
      const shuffledTracks = data;
      playPlaylist(shuffledTracks.sort(() => Math.random() - 0.5));
    }
  };

  const onTrackPress = (track: Track) => {
    playTrack(track);
  };

  const onAddToPlaylistPress = async () => {
    if (isInUserPlaylist) {
      await deletePlaylist(item.id);
      libraryStore.deletePlaylist(item.id);
      setIsInUserPlaylist(false);
      return;
    }
    const newPlaylist = await createPlaylistWithTracks(
      user?.user_metadata?.display_name ?? "Unknown User",
      item.id ?? "Unknown Album",
      item.title ?? "Danh sách phát " + item.id,
      item.artwork ?? "",
      "Danh sách phát của " + (item.artists[0]?.name ?? "Unknown Artist"),
      data
    );
    const playlistWithUrl = {
      ...newPlaylist,
      url: item.artwork ?? "", // Add the 'url' property
    };
    libraryStore.setPlaylist(playlistWithUrl);
    setIsInUserPlaylist(true);
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
        id={queueId}
        imageUrl={item.artwork}
        title={item.title}
        artists={artists}
        userName={userName}
        tracks={data}
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
