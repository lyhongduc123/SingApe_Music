import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import { SearchBar } from "@/components/home/SearchBar";
import { router, Stack } from "expo-router";
import CustomHeader from "@/components/CustomHeader";
import { ArrowLeft, Box, Search, UserRound, X } from "lucide-react-native";
import { backgroundColor, fontSize } from "@/constants/tokens";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  Button,
  HStack,
  Icon,
  Input,
  VStack,
  Image,
  Center,
} from "@/components/ui";
import Library from "@/assets/data/library.json";
import TrackPlayer from "react-native-track-player";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { playTrack } from "@/services/playbackService";
import {
  Artist,
  ExtendedTrack,
  MyTrack,
  SearchResult,
} from "@/types/zing.types";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchSearch } from "@/lib/spotify";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { TracksListItem } from "@/components/TrackListItem";
import { Avatar } from "@/components/ui/avatar";
import { star } from "@/constants/text";
import { PlaylistCard } from "@/components/PlaylistCard";
import { convertZingToTrack } from "@/helpers/convert";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { set } from "ts-pattern/dist/patterns";
import { Heading } from "@/components/ui/heading";
import { getRecentSearch, saveRecentSearch } from "@/services/cacheService";
import e from "express";
import { SearchList } from "@/components/searchs/SearchList";
import { RecentList } from "@/components/searchs/RecentList";

type MixedSearchItem = any & {
  type: "song" | "artist" | "playlist" | "album";
};

export default function SearchScreen() {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchFocus, setSearchFocus] = useState(true);
  const [data, setData] = useState<MixedSearchItem[]>();
  const [dataSlice, setDataSlice] = useState<MixedSearchItem[]>();
  const [recentData, setRecentData] = useState<MixedSearchItem[]>();
  const debounceQuery = useDebounce(query, 0);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 0) {
        setIsLoading(true);

        const response: SearchResult = await fetchSearch(query);
        const convertedTracks = await Promise.all(
          response.songs.map(async (item: any) => {
            const track = await convertZingToTrack(item);
            return {
              ...track,
              type: "song",
            };
          })
        );
        const convertedArtists = response.artists.map((item: any) => ({
          ...item,
          id: item.encodeId,
          type: "artist",
        }));
        const convertedPlaylists = response.playlists.map((item: any) => ({
          ...item,
          id: item.encodeId,
          type: "playlist",
        }));
        const mixedItems: MixedSearchItem[] = [
          ...convertedArtists,
          ...convertedTracks,
          ...convertedPlaylists,
        ];

        setData(mixedItems);
        setDataSlice([
          ...convertedArtists.slice(0, 3),
          ...convertedTracks.slice(0, 3),
          ...convertedPlaylists.slice(0, 3),
        ]);

        setIsLoading(false);
      } else {
        setData(undefined);
      }
    };

    fetchData();
  }, [debounceQuery]);

  useEffect(() => {
    if (query.length > 0) {
      setData([]);
      setDataSlice([]);
    }
  }, [query]);

  useEffect(() => {
    const fetchRecentData = async () => {
      const recent = await getRecentSearch();
      setRecentData(recent);
    };
    fetchRecentData();
  }, []);

  const handleSelectSong = (song: MyTrack) => {
    console.log("Selected song:", song);
    addRecentSearchEntry(song);
    playTrack(song);
  };

  const handleSelectArtist = async (artist: Artist) => {
    console.log("Selected artist:", artist);
    addRecentSearchEntry(artist);
    router.push({
      pathname: "/artists/[id]",
      params: { id: artist.alias },
    });
  };

  const handleSelectPlaylist = async (playlist: MyTrack) => {
    console.log("Selected playlist:", playlist);
    addRecentSearchEntry(playlist);
    router.push({
      pathname: "/playlists/[id]",
      params: {
        id: playlist.id,
        title: playlist.title,
        artwork: playlist.thumbnail,
        createdBy: playlist.createdBy ?? "Singape",
      },
    });
  };

  const addRecentSearchEntry = async (entry: any) => {
    const existingEntry = recentData?.find((i) => i.id === entry.id);
    if (!existingEntry) {
      setRecentData((prev) => [entry, ...(prev || [])]);
    } else {
      const updatedRecentData = recentData?.filter((i) => i.id !== entry.id);
      setRecentData([entry, ...(updatedRecentData || [])]);
    }
    saveRecentSearch(entry);
  };

  const removeRecentSearchEntry = async (entry: any) => {
    const updatedRecentData = recentData?.filter((i) => i.id !== entry.id);
    setRecentData(updatedRecentData);
    saveRecentSearch(updatedRecentData || []);
  };

  const removeAllSearchEntries = async () => {
    setRecentData([]);
    saveRecentSearch([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
      <VStack space="md" className="px-2">
        <HStack space="md" className="items-center drop-shadow-sm">
          <Button
            onPress={() => {
              router.back();
            }}
            className="bg-transparent border-none rounded-full data-[active=true]:bg-background-200 w-12 h-12"
          >
            <ButtonIcon
              as={ArrowLeft}
              size="xxl"
              className="text-primary-500"
            />
          </Button>
          <HStack className="flex-1 items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 h-12 mr-4">
            <Icon as={Search} className="text-gray-500" size="xl" />
            <Input
              className=" border-0 flex-1 text-base text-black dark:text-white"
              size="lg"
            >
              <InputField
                placeholder={"Tìm bài hát, ca sĩ, album..."}
                value={query}
                onChangeText={(text) => setQuery(text)}
                onFocus={() => setSearchFocus(true)}
                onSubmitEditing={() => setSearchFocus(false)}
                autoCorrect={false}
                autoFocus={true}
              />
            </Input>
            {query.length > 0 && (
              <Button
                onPress={() => setQuery("")}
                className="bg-transparent border-none rounded-full data-[active=true]:bg-background-200 w-10 h-10"
              >
                <ButtonIcon as={X} size="xl" className="text-gray-500" />
              </Button>
            )}
          </HStack>
        </HStack>
      </VStack>
      {query.length === 0 ? (
        <RecentList
          data={recentData || []}
          onSelectSong={handleSelectSong}
          onSelectArtist={handleSelectArtist}
          onSelectPlaylist={handleSelectPlaylist}
          onRemoveRecent={removeRecentSearchEntry}
          onRemoveAll={removeAllSearchEntries}
          className="px-2 pt-4"
        />
      ) : isLoading ? null : (
        <SearchList
          data={data || []}
          dataSlice={dataSlice || []}
          displayAll={!searchFocus}
          onSelectSong={handleSelectSong}
          onSelectArtist={handleSelectArtist}
          onSelectPlaylist={handleSelectPlaylist}
          className="px-2"
        />
      )}
    </SafeAreaView>
  );
}
