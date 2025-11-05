import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  View,
  FlatList,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  InteractionManager,
  Alert,
} from "react-native";
import { Href, Link, useNavigation, useRouter } from "expo-router";
import {
  VStack,
  HStack,
  Text,
  Input,
  Spinner,
  Image,
  Box,
  Center,
} from "@/components/ui";
import { useCallback, useEffect, useState, memo, useMemo, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TracksList } from "@/components/TrackList";
import { getSongs } from "@/services/apiService";
import { Track, useActiveTrack } from "react-native-track-player";
import CustomHeader from "@/components/CustomHeader";
import { Heading } from "@/components/ui/heading";
import { MyTrack, Home, ExtendedTrack } from "@/types/zing.types";
import { fetchHome } from "@/lib/spotify";
import { convertZingToTrack } from "@/helpers/convert";
import { TracksListItem } from "@/components/TrackListItem";
import {
  playPlaylist,
  playTrack,
  playPlaylistFromIndex,
  playPlaylistFromTrack,
  generateTracksListId,
} from "@/services/playbackService";
import {
  addSongToFavorite,
  checkIfSongInFavorites,
  getListeningHistory,
  removeSongFromFavorite,
} from "@/services/cacheService";
import { getAllSongs, getSongsByArtistId } from "@/lib/api/songs";
import { getAllArtists } from "@/lib/api/artists";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Divider } from "@/components/ui/divider";
import { unknownTrackImageSource } from "@/constants/image";
import ButtonBottomSheet from "@/components/bottomSheet/ButtonBottomSheet";
import {
  CircleArrowDown,
  CirclePlus,
  Heart,
  Search,
  Share2,
  UserRoundCheck,
  Mic,
} from "lucide-react-native";
import { AlbumList } from "@/components/AlbumList";
import { downloadSong } from "@/components/DowloadMusic";

import { useFavoriteStore } from "@/store/mylib";
import { ShareModal } from "@/components/ShareModal";
import { BS_AddToFavorite } from "@/components/buttons/BS_AddToFavorite";
import { BS_AddToPlaylist } from "@/components/buttons/BS_AddToPlaylist";
import { BS_Download } from "@/components/buttons/BS_Download";
import { BS_MoveToArtist } from "@/components/buttons/BS_MoveToArtist";
import { BS_Share } from "@/components/buttons/BS_Share";

export default function Songs() {
  const [tracks, setTracks] = useState<MyTrack[]>([]);
  const [selectedItem, setSelectedItem] = useState<MyTrack | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [homeData, setHomeData] = useState<{
    tracks: Track[];
    chillSection: MyTrack[];
    recentSection: MyTrack[];
    top100Section: MyTrack[];
    newReleaseSection: MyTrack[];
    albumHotSection: MyTrack[];
  }>({
    tracks: [],
    chillSection: [],
    recentSection: [],
    top100Section: [],
    newReleaseSection: [],
    albumHotSection: [],
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const numCols = 3;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Data states
  // const [songs, setSongs] = useState<Song[]>([]);
  // const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);

  const favouriteStore = useFavoriteStore();
  const router = useRouter();
  const navigation = useNavigation();

  // Load data when component mounts
  // useEffect(() => {
  //   loadData();
  // }, []);

  // Function to load data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch songs
      const songsData = await getAllSongs();
      // if (songsData) {
      //   setSongs(songsData);
      //   console.log(`Loaded ${songsData.length} songs`);
      // }

      // Fetch artists
      const artistsData = await getAllArtists();
      // if (artistsData) {
      //   setArtists(artistsData);
      //   console.log(`Loaded ${artistsData.length} artists`);
      // }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnOptionsPress = (item: MyTrack) => {
    handlePresentModalPress();
    favoriteState();
    setSelectedItem(item);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log(text);
  };

  // const songsToTracks = (songs: Song[]): Track[] => {
  //   if (!songs || songs.length === 0) return [];

  //   return songs.map((song) => {
  //     const fallbackUrl =
  //       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  //     return {
  //       id: song.id,
  //       title: song.title || "Unknown Title",
  //       artist: "Various Artists",
  //       url: song.url || fallbackUrl,
  //       artwork: song.cover_url || "https://via.placeholder.com/400",
  //       duration: 0,
  //     };
  //   });
  // };

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      // const myData = await getSongs();
      // const tracks = myData.map(
      //   (song) =>
      //     ({
      //       id: song.id,
      //       title: song.title ?? undefined,
      //       artist: song.song_artists
      //         .map((sa: any) => sa.artists.name)
      //         .join(", "),
      //       album: song.albums?.title ?? undefined,
      //       url: song.url || "",
      //       genre: song.song_genres.map((sa: any) => sa.genres.name).join(", "),
      //       artwork: song.cover_url || "",
      //     } as Track)
      // );

      // setTracks(tracks);

      const resultData: Home = await fetchHome();
      const chillSection = resultData?.items.find(
        (item) => item.title === "Chill"
      )?.items;

      const newReleaseSection = resultData?.items.find(
        (item) => item.sectionType === "new-release"
      )?.items;

      const recentSection = await getListeningHistory();

      const top100Section = resultData?.items.find(
        (item) => item.sectionId === "h100"
      )?.items;

      const albumHotSection = resultData?.items.find(
        (item) => item.sectionId === "hAlbum"
      )?.items;

      setHomeData({
        tracks,
        chillSection: Array.isArray(chillSection)
          ? await handleData(chillSection)
          : [],
        recentSection: recentSection.map((song) => song.track),
        top100Section: Array.isArray(top100Section)
          ? await handleData(top100Section)
          : [],
        newReleaseSection: Array.isArray(newReleaseSection)
          ? await handleData(newReleaseSection)
          : newReleaseSection?.all
          ? await handleData(newReleaseSection.all.slice(0, 5))
          : [],
        albumHotSection: Array.isArray(albumHotSection)
          ? await handleData(albumHotSection)
          : [],
      });
    } catch (error) {
      console.error("", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleData = async (data: ExtendedTrack[]) => {
    const tracks = await Promise.all(
      data
        .filter(
          (song: ExtendedTrack) =>
            !song.streamPrivileges || song.streamPrivileges.includes(1)
        )
        .map((song: any) => {
          return convertZingToTrack(song);
        })
    );
    return tracks;
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchSongs();
    });
    return () => task.cancel();
  }, []);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const favoriteState = () => {
    if (selectedItem) {
      const isFavorite = favouriteStore.isTrackFavorite(selectedItem.id);
      setIsFavorite(isFavorite);
    }
  };

  const handleAddToPlaylistPress = async () => {
    if (selectedItem) {
      handleDismissModalPress();
      router.push({
        pathname: "/addToPlaylist",
        params: selectedItem,
      });
    }
  };

  const handleFavoritePress = async () => {
    if (selectedItem) {
      try {
        if (isFavorite) {
          favouriteStore.removeTrackFromFavorites(selectedItem.id);
          await removeSongFromFavorite(selectedItem);
        } else {
          favouriteStore.addTrackToFavorites(selectedItem);
          await addSongToFavorite(selectedItem);
        }
      } catch (error) {
        console.error("Error playing playlist:", error);
      }
    }
  };

  const handleDownloadPress = async () => {
    if (selectedItem) {
      try {
      } catch (error) {
        console.error("Error playing playlist:", error);
      }
    }
  };

  const handleArtistPress = async () => {
    if (selectedItem) {
      handleDismissModalPress();
      console.log("artistId", selectedItem);
      router.navigate({
        pathname: `/(app)/(tabs)/(songs)/artists/[id]`,
        params: {
          id: selectedItem?.artists[0].alias ?? selectedItem?.artist ?? "",
        },
      });
    }
  };

  const handleSharePress = async () => {
    if (selectedItem) {
      handleDismissModalPress();
      console.log("Share", selectedItem);
      // Implement share functionality here
      setShowModal(true);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsError(false);
    fetchSongs()
      .then(() => setRefreshing(false))
      .catch(() => {
        setRefreshing(false);
        setIsError(true);
      });
  }, []);

  const renderRecentSection = () => {
    return (
      <View>
        <HStack className="justify-between items-center pr-4">
          <Heading className={headingStyle}>Gần đây</Heading>
          <Button
            variant="link"
            className="text-sm font-semibold"
            onPress={() => {
              router.push("/history" as Href);
            }}
          >
            <ButtonText className="text-primary-500">Xem tất cả</ButtonText>
          </Button>
        </HStack>
        <TracksList
          id="recent"
          className="px-4 data-[active=true]:no-underline"
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          tracks={homeData.recentSection.slice(0, 5)}
          onTrackOptionPress={(track) => {
            handleOnOptionsPress(track as MyTrack);
          }}
        />
      </View>
    );
  };

  const renderTop100Section = () => {
    return (
      <View>
        <Heading className={headingStyle}>Tuyển tập top</Heading>
        <Box className="">
          <AlbumList horizontal={true} data={homeData.top100Section} />
        </Box>
      </View>
    );
  };

  const recommendSection = () => {
    return (
      <View>
        <Heading className={headingStyle}>Dựa trên sở thích của bạn</Heading>
        <TracksList
          id="recommend"
          className="px-4"
          scrollEnabled={false}
          tracks={tracks}
          ItemSeparatorComponent={() => <View className="h-3" />}
          onTrackOptionPress={(track) => {
            handleOnOptionsPress(track as MyTrack);
          }}
        />
      </View>
    );
  };

  const renderChillSection = () => {
    if (!homeData.chillSection || homeData.chillSection.length === 0) {
      return null; // Return null if there are no chill tracks
    }
    return (
      <View>
        <Heading className={headingStyle}>Thư giãn</Heading>
        <Box className="">
          <AlbumList horizontal={true} data={homeData.chillSection} />
        </Box>
      </View>
    );
  };

  const renderAlbumHotSection = () => {
    return (
      <View>
        <Heading className={headingStyle}>Album Hot</Heading>
        <Box className="">
          <AlbumList horizontal={true} data={homeData.albumHotSection} />
        </Box>
      </View>
    );
  };
  const renderNewReleaseSection = () => {
    return (
      <View>
        <Heading className={headingStyle}>Mới phát hành</Heading>
        <Box>
          {/* <ColumnWiseFlatList
            data={homeData.newReleaseSection || []}
            onTrackOptionPress={(track) => {
              handleOnOptionsPress(track as MyTrack);
            }}
          /> */}
          <FlatList
            data={homeData.newReleaseSection}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TracksListItem
                track={item}
                onTrackSelect={(track: MyTrack) => {
                  playTrack(track);
                }}
                onRightPress={() => {
                  handleOnOptionsPress(item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            className="px-4"
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View className="h-3" />}
          />
        </Box>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0">
        <LoadingOverlay isUnder={true} />
        <CustomHeader
          title="Khám phá"
          showBack={false}
          titleClassName="text-3xl font-bold"
          headerClassName="bg-background-0 px-4"
          right={
            <HStack space="md">
              <Button
                variant="link"
                className="text-sm font-semibold"
                onPress={() => {
                  router.navigate("/search" as Href);
                }}
              >
                <ButtonIcon
                  as={Search}
                  size="xxl"
                  className="text-primary-500"
                />
              </Button>
              <Button
                variant="link"
                className="text-sm font-semibold"
                onPress={() => {
                  router.navigate("/voice" as Href);
                }}
              >
                <ButtonIcon as={Mic} size="xxl" className="text-primary-500" />
              </Button>
            </HStack>
          }
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background-0">
        <CustomHeader
          title="Khám phá"
          showBack={false}
          titleClassName="text-3xl font-bold"
          headerClassName="bg-background-0 px-4"
          right={
            <HStack space="md">
              <Button
                variant="link"
                className="text-sm font-semibold"
                onPress={() => {
                  router.navigate("/search" as Href);
                }}
              >
                <ButtonIcon
                  as={Search}
                  size="xxl"
                  className="text-primary-500"
                />
              </Button>
              <Button
                variant="link"
                className="text-sm font-semibold"
                onPress={() => {
                  router.navigate("/voice" as Href);
                }}
              >
                <ButtonIcon as={Mic} size="xxl" className="text-primary-500" />
              </Button>
            </HStack>
          }
        />
        <Center className="flex-1">
          <Text className="text-center text-red-500">
            Đã xảy ra lỗi khi tải dữ liệu.
          </Text>
          <Button
            variant="solid"
            className="rounded-full mt-4"
            onPress={onRefresh}
          >
            <ButtonText className="font-semibold">Thử lại</ButtonText>
          </Button>
        </Center>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CustomHeader
          title="Khám phá"
          showBack={false}
          titleClassName="text-3xl font-bold"
          headerClassName="bg-background-0 px-4"
          right={
            <HStack space="md">
              <Button
                variant="link"
                className="text-sm font-semibold"
                onPress={() => {
                  router.navigate("/search" as Href);
                }}
              >
                <ButtonIcon
                  as={Search}
                  size="xxl"
                  className="text-primary-500"
                />
              </Button>
              <Button
                variant="link"
                className="text-sm font-semibold"
                onPress={() => {
                  router.navigate("/voice" as Href);
                }}
              >
                <ButtonIcon as={Mic} size="xxl" className="text-primary-500" />
              </Button>
            </HStack>
          }
        />
        <VStack space="lg">
          {renderAlbumHotSection()}
          {recommendSection()}
          {homeData.recentSection.length > 3 && renderRecentSection()}
          {renderNewReleaseSection()}
          {renderTop100Section()}
          {renderChillSection()}
        </VStack>
        <MyBottomSheet bottomSheetRef={bottomSheetRef}>
          <HStack space="md">
            <Image
              source={
                selectedItem?.artwork
                  ? { uri: selectedItem.artwork }
                  : unknownTrackImageSource
              }
              className="rounded"
              size="sm"
              alt="track artwork"
            />
            <VStack className="flex-1 pl-2">
              <Text className="text-xl font-medium text-primary-500">
                {selectedItem?.title}
              </Text>
              <Text className="text-md text-gray-500">
                {selectedItem?.artist}
              </Text>
            </VStack>
          </HStack>
          <Box className="w-full my-4">
            <Divider />
          </Box>
          <VStack space="md" className="w-full">
            <BS_AddToPlaylist
              selectedItem={selectedItem}
              handleDismissModalPress={handleDismissModalPress}
            />
            <BS_AddToFavorite
              selectedItem={selectedItem}
              handleDismissModalPress={handleDismissModalPress}
            />
            <BS_Download
              selectedItem={selectedItem}
              handleDismissModalPress={handleDismissModalPress}
            />
            <BS_MoveToArtist
              selectedItem={selectedItem}
              handleDismissModalPress={handleDismissModalPress}
            />
            <BS_Share
              selectedItem={selectedItem}
              handleDismissModalPress={handleDismissModalPress}
            />
          </VStack>
        </MyBottomSheet>
        <ShareModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          title={selectedItem?.title ?? ""}
          artist={selectedItem?.artist ?? ""}
          url={selectedItem?.url ?? ""}
          image={selectedItem?.artwork}
        />
        <Box className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}

interface ColumnWiseFlatListProps {
  data: MyTrack[];
  onTrackSelect?: (track: MyTrack) => void;
  onTrackOptionPress?: (track: MyTrack) => void;
}

const ColumnWiseFlatList = ({
  data,
  onTrackOptionPress,
  onTrackSelect,
}: ColumnWiseFlatListProps) => {
  const screenWidth = useWindowDimensions().width - 32;
  const snapInterval = screenWidth + 14; // 16 is the width of the separator
  const numCols = 5;

  const transformedData = useMemo(() => {
    const columns: MyTrack[][] = [];
    for (let i = 0; i < data.length; i += numCols) {
      columns.push(data.slice(i, i + numCols));
    }
    return columns;
  }, [data]);

  const Column = ({ items }: { items: MyTrack[] }) => (
    <VStack style={{ width: screenWidth }} space="md">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TracksListItem
            track={item}
            onTrackSelect={(item: any) => {
              playPlaylistFromTrack(items, item);
            }}
            onRightPress={() => {
              onTrackOptionPress && onTrackOptionPress(item);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </VStack>
  );
  const _renderitem = useCallback(
    ({ item }: any) => <Column items={item} />,
    []
  );
  return (
    <FlatList
      data={transformedData}
      horizontal
      keyExtractor={(_, i) => `col-${i}`}
      renderItem={_renderitem}
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={() => <View className="w-4" />}
      ListFooterComponent={() => <View className="w-4" />}
      ItemSeparatorComponent={() => <View className="w-4" />}
      initialNumToRender={9}
      maxToRenderPerBatch={9}
      windowSize={6}
      snapToAlignment="start"
      snapToInterval={snapInterval}
      disableIntervalMomentum={true}
      className="flex-grow-0"
    />
  );
};

const headingStyle = "text-2xl px-4";
const listStyle = "px-4";
