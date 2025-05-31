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
import { ArrowLeft, Search, UserRound, X } from "lucide-react-native";
import { backgroundColor, fontSize } from "@/constants/tokens";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Button, HStack, Icon, Input, VStack, Image } from "@/components/ui";
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
import { saveRecentSearch } from "@/services/fileService";
import e from "express";

type MixedSearchItem = any & {
  type: "song" | "artist" | "playlist" | "album";
};

type FilterType = { label: string; value: string };

export default function SearchScreen() {
  // const isInitialized = useRef(false);
  // useSetupTrackPlayer({
  //   onLoad: () => {
  //     console.log("TrackPlayer setup hoàn tất");
  //     isInitialized.current = true;
  //   },
  // });
  // const handleSelectSong = async (song: any) => {
  //   console.log("Selected song:", song);
  //   if (isInitialized.current) {
  //     await TrackPlayer.reset();
  //   }
  //   TrackPlayer.add(song)
  //     .then(() => {
  //       router.push("/player");
  //       TrackPlayer.play()
  //         .then(() => {
  //           console.log("Playback started");
  //         })
  //         .catch((error) => {
  //           console.error("Error playing track:", error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error("Error adding track:", error);
  //     });
  // };
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<FilterType>({
    label: "Tất cả",
    value: "all",
  });
  const [query, setQuery] = useState<string>("");
  const [searchFocus, setSearchFocus] = useState(true);
  const [data, setData] = useState<MixedSearchItem[]>();
  const [filteredData, setFilteredData] = useState<MixedSearchItem[]>();
  const [recentData, setRecentData] = useState<MixedSearchItem[]>();
  const debounceQuery = useDebounce(query, 100);

  const filterOptions: FilterType[] = [
    { label: "Bài hát", value: "song" },
    { label: "Danh sách phát", value: "playlist" },
    { label: "Nghệ sĩ", value: "artist" },
    { label: "Album", value: "album" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 0) {
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
        setFilteredData([
          ...convertedArtists.slice(0, 3),
          ...convertedTracks.slice(0, 3),
          ...convertedPlaylists.slice(0, 3),
        ]);
      } else {
        setData(undefined);
      }
    };
    const fetchRecentData = async () => {
      const recentSearches = await fetchSearch("recent");
      const convertedTracks = await Promise.all(
        recentSearches.songs.map(async (item: any) => {
          const track = await convertZingToTrack(item);
          return {
            ...track,
            type: "song",
          };
        })
      );
      const convertedArtists = recentSearches.artists.map((item: any) => ({
        ...item,
        type: "artist",
      }));
      const convertedPlaylists = recentSearches.playlists.map((item: any) => ({
        ...item,
        type: "playlist",
      }));
      const mixedItems: MixedSearchItem[] = [
        ...convertedArtists,
        ...convertedTracks,
        ...convertedPlaylists,
      ];
      setRecentData(mixedItems);
    }

    fetchData();
  }, [debounceQuery]);

  useEffect(() => {
    if (query.length === 0) {
      setFilteredData([])
    } else {
      if (searchFocus) {

      }
      setFilteredData(
        data?.filter((item: MixedSearchItem) => {
          if (filter.value === "all") {
            return true;
          } else {
            return filter.value === item.type;
          }
        })
      );
    }
  }, [filter, showAll, searchFocus]);

  const handleSelectSong = async (song: MyTrack) => {
    console.log("Selected song:", song);
    addRecentSearchEntry(song);
    playTrack(song);
  };

  const handleSelectArtist = async (artist: Artist) => {
    console.log("Selected artist:", artist);
    addRecentSearchEntry(artist);
    router.push({
      pathname: "/artists/[id]",
      params: { id: artist.id },
    });
  }

  const handleSelectPlaylist = async (playlist: MyTrack) => {
    console.log("Selected playlist:", playlist);
    addRecentSearchEntry(playlist);
    router.push({
      pathname: "/playlists/[id]",
      params: { id: playlist.id },
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
  }
  
  const removeRecentSearchEntry = async (entry: any) => {
    setRecentData(recentData?.filter((i) => i.id !== entry.id));
    saveRecentSearch(recentData?.filter((i) => i.id !== entry.id));
  }

  const removeRecentButton = (entry: any) => {
    return (
      <Button
        onPress={() => {
          removeRecentSearchEntry(entry);
        }}
        className="bg-transparent border-none rounded-full data-[active=true]:bg-background-200 w-10 h-10"
      >
        <ButtonIcon as={X} size="xxl" className="text-gray-500" />
      </Button>
    )
  }

  const renderItem = ({ item }: { item: MixedSearchItem }) => {
    const isRecent = query.length === 0;
    if (item.type === "artist") {
      return renderArtistItem({ item, isRecent });
    } else if (item.type === "song") {
      return renderTrackItem({ item, isRecent });
    } else if (item.type === "playlist") {
      return renderPlaylistItem({ item, isRecent });
    }
    return null;
  };

  const renderTrackItem = ({ item, isRecent }: { item: MixedSearchItem, isRecent?: boolean }) => {
    const newItem = item as unknown as MyTrack;
    return (
      <View className="px-2">
        {isRecent ? (
          <TracksListItem
            track={newItem}
            showOptionButton={false}
            onTrackSelect={() => {
              handleSelectSong(newItem);
            }}
          >
            {removeRecentButton(item)}
          </TracksListItem>
        ) : (<TracksListItem
          track={newItem}
          onTrackSelect={() => {
            handleSelectSong(newItem);
          }}
          onRightPress={() => {
            console.log("Long pressed:", item);
          }}
        />)}
      </View>
    );
  };

  const renderArtistItem = ({ item, isRecent }: { item: MixedSearchItem, isRecent: boolean }) => {
    const newItem = item as unknown as Artist;
    return (
      <HStack space="lg" className="px-2 items-center">
        <Image
          source={newItem.thumbnailM}
          className="rounded-full"
          size="sm"
          alt={newItem.name || "Unknown"}
        />
        <HStack space="md">
          <VStack space="xs">
            <Text className="text-base font-semibold text-black dark:text-white">
              {newItem.name}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Nghệ sĩ
            </Text>
            {/* {star} {newItem.totalFollow} người theo dõi */}
          </VStack>
          
          {isRecent ? (
          removeRecentButton(newItem)
          ) : (<Button
            onPress={() => {
              console.log("Theo dõi nghệ sĩ:", newItem.name);
              // Theo dõi nghệ sĩ
            }}
            className="bg-transparent border-none rounded-full data-[active=true]:bg-background-200 w-10 h-10"
          >
            <ButtonText>Theo dõi</ButtonText>
          </Button>)}
        </HStack>
      </HStack>
    );
  };

  const renderPlaylistItem = ({ item, isRecent }: { item: MixedSearchItem, isRecent: boolean }) => {
    const newItem = item as unknown as MyTrack;
    return (
      <HStack space="lg" className="px-2 items-center">
        <Image
          source={newItem.thumbnailM}
          className="rounded-sm"
          size="sm"
          alt={newItem.name || "Unknown"}
        />
        <HStack space="md">
          <VStack space="xs" className="w-10/12">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-base font-semibold text-primary-500"
            >
              {newItem.title}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Danh sách phát
            </Text>
          </VStack>

          {isRecent && (
            removeRecentButton(newItem)
          )}
        </HStack>
      </HStack>
    );
  };

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
                placeholder={"Tìm bài hát, ca sĩ, album..."}
                value={query}
                onChangeText={(text) => setQuery(text)}
                onFocus={() => {
                  setShowAll(false);
                }}
                onSubmitEditing={() => {
                  setShowAll(true);
                }}
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
        <ListHeaderComponent
          selected={filter}
          onSelect={setFilter}
          filterOptions={filterOptions}
          isVisible={showAll}
        />
        <FlatList
          data={query.length > 0 ? filteredData : recentData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          ItemSeparatorComponent={() => <View className="h-3 bg-transparent" />}
          ListFooterComponent={() => (
            <>
              {!showAll && query.length > 0 && filteredData && (
                <Button
                  variant="link"
                  action="positive"
                  onPress={() => setShowAll(true)}
                >
                  <ButtonText>Xem tất cả các kết quả</ButtonText>
                </Button>
              )}
              {query.length === 0 && recentData && (
                <Button
                  variant="link"
                  action="positive"
                  onPress={() => removeRecentSearchEntry}
                >
                  <ButtonText>Xóa lịch sử tìm kiếm</ButtonText>
                </Button>
              )}
              <View className="h-10 bg-transparent" />
            </>
          )}
          ListHeaderComponent={() => {
            return query === "" && <Heading className="px-4 text-2xl">Các tìm kiếm gần đây</Heading>;
          }}
          renderItem={renderItem}
        />
      </VStack>
    </SafeAreaView>
  );
}

interface ListHeaderComponentProps {
  isVisible?: boolean;
  selected: FilterType;
  filterOptions: FilterType[];
  onSelect: (value: FilterType) => void;
}

const ListHeaderComponent = ({
  selected,
  onSelect,
  filterOptions,
  isVisible,
}: ListHeaderComponentProps) => {
  const displayedOptions = useMemo(() => {
    if (selected.value === "all") return filterOptions;
    const filtered = filterOptions.filter(
      (item) => item.value === selected.value
    );
    return [{ label: "button", value: "x" }, ...filtered];
  }, [selected, filterOptions]);

  if (!isVisible) {
    return null;
  }

  const handleOnSelect = async (value: FilterType) => {
    if (selected?.value === value.value) {
      return onSelect({
        label: "Tất cả",
        value: "all",
      });
    }
    onSelect(value);
  };

  return (
    <Animated.FlatList
      data={displayedOptions}
      keyExtractor={(item) => item.value.toString()}
      horizontal
      className="h-12"
      showsHorizontalScrollIndicator={false}
      itemLayoutAnimation={LinearTransition}
      removeClippedSubviews={false}
      ItemSeparatorComponent={() => <View className="w-2" />}
      renderItem={({ item }) => {
        const isActive = selected.value === item.value;
        if (item.value === "x") {
          return (
            <Button
              variant="solid"
              action="secondary"
              className={`rounded-full w-10 h-10`}
              size="sm"
              onPress={() => handleOnSelect(selected)}
            >
              <ButtonIcon as={X} className="text-base" />
            </Button>
          );
        }
        return (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Button
              variant="solid"
              action="secondary"
              className={`rounded-full w-fit h-10 ${
                isActive && "bg-green-500"
              }`}
              onPress={() => handleOnSelect(item)}
            >
              <ButtonText
                className={`text-base font-medium ${isActive && "text-white"}`}
              >
                {item.label}
              </ButtonText>
            </Button>
          </Animated.View>
        );
      }}
    />
  );
};