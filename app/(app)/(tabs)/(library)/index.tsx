import ButtonBottomSheet from "@/components/bottomSheet/ButtonBottomSheet";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import CustomHeader from "@/components/CustomHeader";
import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoiding";
import { PlaylistCard } from "@/components/PlaylistCard";
import { UploadedSongCard } from "@/components/UploadedSongCard";
import {
  Button,
  HStack,
  Icon,
  Pressable,
  VStack,
  Image,
  Spinner,
} from "@/components/ui";
import { Box } from "@/components/ui/box";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { unknownTrackImageSource } from "@/constants/image";
import { fontSize, textColor } from "@/constants/tokens";
import { deletePlaylist, listPlaylists } from "@/services/cacheService";
import { playTrack } from "@/services/playbackService";
import { useLibraryStore } from "@/store/mylib";
import { MyPlaylist, MyTrack } from "@/types/zing.types";
import { View } from "@gluestack-ui/themed";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Href, Link, router, Stack, useFocusEffect } from "expo-router";
import uploadMusic from "@/lib/api/upload";
import {
  getUserUploadedSongs,
  deleteUploadedSong,
  UploadSong,
} from "@/lib/api/upload_songs.api";
import {
  ArrowBigDownDash,
  Download,
  Heart,
  History,
  Music,
  Plus,
  UserRound,
  UsersRound,
  X,
} from "lucide-react-native";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ScrollView, FlatList, Alert } from "react-native";
import { stat } from "react-native-fs";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { downloadSong } from "@/components/DowloadMusic";

export default function Library() {
  const [data, setData] = useState<MyPlaylist[]>([]);
  const [uploadedSongs, setUploadedSongs] = useState<UploadSong[]>([]);
  const [selectedItem, setSelectedItem] = useState<MyTrack | UploadSong | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploadedSongsLoading, setUploadedSongsLoading] = useState(false);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();
  const store = useLibraryStore();

  // Use this ref to track if an upload is actually in progress
  const uploadInProgressRef = useRef(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleFavorite = () => {
    router.push("/favorite" as Href);
  };

  const handleDownload = () => {
    router.push("/download" as Href);
  };

  const handleHistory = () => {
    router.push("/history" as Href);
  };

  const handleFollow = () => {
    router.push("/follow" as Href);
  };

  const createPlaylist = () => {
    router.push("/createPlaylist" as Href);
  };
  // Handle focus/blur state to fix spinner issue
  useEffect(() => {
    // When focus returns to the screen
    if (isFocused) {
      // If no actual upload is in progress, make sure spinner is hidden
      if (!uploadInProgressRef.current) {
        setIsUploadingMusic(false);
      }
    }

    // Cleanup function when component unmounts or loses focus
    return () => {
      // Don't reset if there's a real upload in progress
      if (!uploadInProgressRef.current) {
        setIsUploadingMusic(false);
      }
    };
  }, [isFocused]);

  // Handle music upload with loading state and callbacks
  const handleUploadMusic = async () => {
    setIsUploadingMusic(true);
    setUploadSuccess(false);
    uploadInProgressRef.current = true;

    // Call uploadMusic with callbacks
    await uploadMusic({
      onStart: () => {
        console.log("Upload started");
        setIsUploadingMusic(true);
        uploadInProgressRef.current = true;
      },
      onSuccess: (song) => {
        console.log("Upload completed successfully:", song);
        // Add the new song to the list without refetching everything
        setUploadedSongs((prev) => [song, ...prev]);
        setIsUploadingMusic(false);
        setUploadSuccess(true);
        uploadInProgressRef.current = false;

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      },
      onError: (error) => {
        console.error("Upload error:", error);
        setIsUploadingMusic(false);
        uploadInProgressRef.current = false;
      },
    });
  };
  // Fetch playlists and uploaded songs when component is focused
  useFocusEffect(
    useCallback(() => {
      // Reset loading states if no upload is actually in progress
      if (!uploadInProgressRef.current) {
        setIsUploadingMusic(false);
      }

      const fetchData = async () => {
        setLoading(true);
        try {
          const playlists = await listPlaylists();
          setData(playlists);

          // Convert MyTrack array to MyPlaylist array by adding empty tracks array
          const playlistItems = playlists.map((item) => ({
            ...item,
            tracks: [], // Add empty tracks array to make it compatible with MyPlaylist
          }));

          // Now it matches the MyPlaylist[] type
          store.setPlaylists(playlists);
        } catch (error) {
          console.error("Error fetching playlists:", error);
        } finally {
          setLoading(false);
        }
      };

      const fetchUploadedSongs = async () => {
        setUploadedSongsLoading(true);
        try {
          const songs = await getUserUploadedSongs();
          console.log("Fetched uploaded songs:", songs);
          setUploadedSongs(songs);
        } catch (error) {
          console.error("Error fetching uploaded songs:", error);
        } finally {
          setUploadedSongsLoading(false);
        }
      };

      fetchData();
      fetchUploadedSongs();

      // Cleanup function when focus leaves
      return () => {
        // Only reset if no actual upload is in progress
        if (!uploadInProgressRef.current) {
          setIsUploadingMusic(false);
        }
      };
    }, [])
  );
  const handleOnOptionsPress = (item: MyTrack) => {
    handlePresentModalPress();
    // Set as playlist type
    setSelectedItem(item);
  };
  // Handle deletion of an uploaded song
  const handleDeleteUploadedSong = async (song: UploadSong) => {
    if (!song || !song.id) return;

    try {
      const { success, error } = await deleteUploadedSong(song.id);
      if (success) {
        // Remove the song from the local state
        setUploadedSongs(uploadedSongs.filter((s) => s.id !== song.id));
        console.log("Song deleted successfully");
      } else {
        console.error("Failed to delete song:", error);
      }
    } catch (err) {
      console.error("Error deleting song:", err);
    }
    // Close the modal
    handleCloseModalPress();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <CustomHeader
          title="Thư viện"
          showBack={false}
          centerTitle={false}
          titleClassName="text-3xl font-bold"
          headerClassName="px-4"
        />
        <Box className="flex-1 w-full h-full bg-background-0 px-4">
          <VStack className="flex-1 w-max-md gap-2">
            <Heading className="text-2xl font-bold">Bài hát</Heading>
            <Divider className="w-full mb-2" />
            <HStack className="w-full items-center justify-center gap-2">
              <Button
                onPress={handleFavorite}
                variant="solid"
                className="rounded-lg justify-start bg-pink-400 dark:bg-pink-400 data-[active=true]:bg-pink-500 w-1/2 h-14"
                size="xl"
              >
                <ButtonIcon as={Heart} className="text-red-600 fill-red-600" />
                <ButtonText className="text-secondary-50">Yêu thích</ButtonText>
              </Button>
              <Button
                onPress={handleFollow}
                variant="solid"
                className="rounded-lg justify-start bg-yellow-400 dark:bg-yellow-400 data-[active=true]:bg-yellow-500 w-1/2 h-14"
                size="xl"
              >
                <ButtonIcon as={UsersRound} className="text-black fill-black" />
                <ButtonText className="text-secondary-50">Theo dõi</ButtonText>
              </Button>
            </HStack>
            <HStack className="w-full items-center justify-center gap-2">
              <Button
                onPress={handleHistory}
                variant="solid"
                className="rounded-lg justify-start bg-blue-400 dark:bg-blue-400 data-[active=true]:bg-blue-500 w-1/2 h-14"
                size="xl"
              >
                <ButtonIcon as={History} className="text-black " />
                <ButtonText>Lịch sử</ButtonText>
              </Button>
              <Button
                onPress={handleDownload}
                variant="solid"
                className="rounded-lg justify-start bg-green-400 dark:bg-green-400 data-[active=true]:bg-green-500 w-1/2 h-14"
                size="xl"
              >
                <ButtonIcon
                  as={ArrowBigDownDash}
                  className="text-black fill-black"
                />
                <ButtonText
                  >
                  Tải xuống
                </ButtonText>
              </Button>
            </HStack>
            <View className="h-2" />
            <HStack className="items-center gap-2">
              <Heading className="text-2xl font-bold">Danh sách phát</Heading>
              <Pressable
                onPress={createPlaylist}
                className="rounded-full data-[active=true]:bg-background-100 items-center justify-center"
              >
                <Icon as={Plus} className="fill-primary-500" />
              </Pressable>
            </HStack>
            <Divider className="w-full" />
            <Animated.FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              layout={LinearTransition}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/playlists/[id]",
                      params: item,
                    });
                  }}
                >
                  <PlaylistCard
                    item={item}
                    tracks={item.tracks}
                    type="Danh sách phát"
                    onOptionPress={() => handleOnOptionsPress(item)}
                  />
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View className="h-3" />}
              ListFooterComponent={() => <View className="h-3" />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
            />
            <HStack className="items-center">
              <Heading className="text-2xl font-bold">
                Bài hát đã tải lên
              </Heading>
              <Pressable
                onPress={handleUploadMusic}
                disabled={isUploadingMusic}
                className="rounded-full w-10 h-10 data-[active=true]:bg-background-100 items-center justify-center"
              >
                {isUploadingMusic ? (
                  <Spinner size="small" color="primary.500" />
                ) : (
                  <Icon as={Plus} className="fill-primary-500" />
                )}
              </Pressable>
            </HStack>
            <Divider className="w-full mb-2" />
            {uploadedSongsLoading ? (
              <Box className="h-12 items-center justify-center">
                <Text>Đang tải...</Text>
              </Box>
            ) : uploadedSongs.length === 0 ? (
              <Box className="h-20 items-center justify-center">
                <Text className="text-primary-500">
                  Bạn chưa tải lên bài hát nào
                </Text>
                <Text className="text-primary-500 mt-1">
                  Nhấn vào dấu + để tải lên bài hát
                </Text>
              </Box>
            ) : (
              <Animated.FlatList
                data={uploadedSongs}
                keyExtractor={(item) => item.id.toString()}
                itemLayoutAnimation={LinearTransition}
                renderItem={({ item }) => (
                  <UploadedSongCard
                    song={item}
                    onPress={() => {
                      // Play the song
                      console.log("Playing uploaded song:", item.title);
                      // Convert to Track format and play
                      const track = {
                        id: item.id,
                        title: item.title,
                        artist: "Bài hát đã tải lên",
                        url: item.url,
                        artwork: "https://via.placeholder.com/400",
                        duration: 0,
                      };
                      playTrack(track);
                    }}
                    onOptionsPress={() => {
                      // Show options for the song
                      console.log(
                        "Show options for uploaded song:",
                        item.title
                      );
                      setSelectedItem(item); // This is an UploadSong
                      handlePresentModalPress();
                    }}
                  />
                )}
                ItemSeparatorComponent={() => <View className="h-1" />}
                ListFooterComponent={() => <View className="h-8" />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={false}
              />
            )}
          </VStack>
        </Box>
        <View className="h-28" />
      </ScrollView>
      <MyBottomSheet bottomSheetRef={bottomSheetRef}>
        {selectedItem && "url" in selectedItem ? (
          <VStack space="md" className="p-4">
            <Heading className="text-xl">Tùy chọn</Heading>
            <Button
              onPress={() =>
                handleDeleteUploadedSong(selectedItem as UploadSong)
              }
              className="bg-red-500"
            >
              <ButtonText>Xóa bài hát</ButtonText>
            </Button>
            <Button
              onPress={handleCloseModalPress}
              variant="outline"
              className="border-secondary-400"
            >
              <ButtonText className="text-secondary-400">Hủy bỏ</ButtonText>
            </Button>
          </VStack>
        ) : (
          <VStack space="md" className="p-4">
            <Heading className="text-xl">Tùy chọn</Heading>
            <Button
              onPress={() => {
                if (
                  selectedItem &&
                  !("url" in selectedItem) &&
                  "id" in selectedItem
                ) {
                  const playlistItem = selectedItem as MyTrack;
                  const playlistId = playlistItem.id;
                  deletePlaylist(playlistId);
                  setData(data.filter((item) => item.id !== playlistId));

                  const playlistItems = data
                    .filter((item) => item.id !== playlistId)
                    .map((item) => ({
                      ...item,
                      tracks: [],
                    }));

                  store.setPlaylists(playlistItems);
                  handleCloseModalPress();
                }
              }}
              className="bg-red-500"
            >
              <ButtonText>Xóa danh sách phát</ButtonText>
            </Button>
            <Button
              onPress={handleCloseModalPress}
              variant="outline"
              className="border-secondary-400"
            >
              <ButtonText className="text-secondary-400">Hủy bỏ</ButtonText>
            </Button>
          </VStack>
        )}
      </MyBottomSheet>
      {uploadSuccess && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            zIndex: 999,
            alignItems: "center",
            transform: [{ translateY: -50 }],
          }}
        >
          <Box
            bg="success.500"
            px="5"
            py="3"
            rounded="xl"
            shadow="9"
            borderWidth={2}
            borderColor="success.400"
            style={{
              width: "85%",
              alignItems: "center",
              backgroundColor: "rgba(34, 197, 94, 0.95)",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 10,
            }}
          >
            <HStack space="md" alignItems="center" mb={1}>
              <Icon as={Music} size="sm" color="white" />
              <Text color="white" fontWeight="bold" fontSize={18}>
                Tải lên thành công!
              </Text>
            </HStack>
            <Text
              color="white"
              textAlign="center"
              fontSize={14}
              letterSpacing={0.3}
            >
              Bài hát đã được thêm vào thư viện của bạn
            </Text>
          </Box>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
