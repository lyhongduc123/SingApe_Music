import { TracksListItem } from "@/components/TrackListItem";
import { Button, HStack, Icon, Input, VStack } from "@/components/ui";
import { ButtonIcon } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { useAlert } from "@/context/alert";
import { convertZingToTrack } from "@/helpers/convert";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchSearch } from "@/lib/spotify";
import { addSongToPlaylist } from "@/services/fileService";
import { playTrack } from "@/services/playbackService";
import { useLibraryStore } from "@/store/mylib";
import { MyTrack, SearchResult } from "@/types/zing.types";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CirclePlus, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchSong() {
  const item = useLocalSearchParams();
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<MyTrack[]>();
  const debounceQuery = useDebounce(query, 200);

  const { showAlert } = useAlert();

  const playlists = useLibraryStore((state) => state.playlists);
  const addTrackToStorePlaylist = useLibraryStore((state) => state.addTrackToPlaylist);
  const checkTrackInPlaylist = useLibraryStore((state) => state.checkTrackInPlaylist);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 0) {
        const response: SearchResult = await fetchSearch(query);
        const convertedTracks = await Promise.all(
          response.songs.map(async (item: any) => {
            const track = await convertZingToTrack(item);
            return track;
          })
        )

        setData(convertedTracks);
      } else {
        setData(undefined);
      }
    };
    fetchData();
  }, [debounceQuery]);

  function handleSelectSong(track: MyTrack) {
    playTrack(track);
  }

  const handleAddPress = (track: MyTrack) => {
    if (typeof item.id === "string") {
      try {
      const exist = checkTrackInPlaylist(track.id, item.id);
      if (exist) {
        showAlert(
          "Bài hát đã có trong danh sách phát này",
        );
        return;
      }
      addSongToPlaylist(item.id, track);
      addTrackToStorePlaylist(track, item.id);
      setData((prevData) => {
        if (prevData) { 
          return prevData.filter((t) => t.id !== track.id);
        } else {
          return [];
        }
      });
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    } finally {
      
    }
    } else {
      console.error("Invalid item.id: Expected a string but got an array.");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
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
                placeholder={"Tìm bài hát, nghệ sĩ"}
                value={query}
                onChangeText={(text) => setQuery(text)}
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
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        layout={LinearTransition}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        className="px-4"
        ItemSeparatorComponent={() => <View className="h-3 bg-transparent" />}
        ListHeaderComponent={() => <View className="h-3 bg-transparent" />}
        ListFooterComponent={() => <View className="h-28 bg-transparent" />}
        renderItem={({ item }) => (
          <TracksListItem
            track={item}
            showOptionButton={false}
            onTrackSelect={() => {
              handleSelectSong(item);
            }}
            onRightPress={() => {
              console.log("Long pressed:", item);
            }}
          >
            <Button
            variant="solid"
            className="bg-transparent border-none data-[active=true]:bg-transparent w-10 h-10"
            size="sm"
            onPress={() => handleAddPress(item)}
          >
            <ButtonIcon
              as={CirclePlus}
              size="xxl"
              className="text-primary-500"
            />
          </Button>
          </TracksListItem>
        )}
      />
    </SafeAreaView>
  );
}
