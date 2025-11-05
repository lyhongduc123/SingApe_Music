import CustomHeader from "@/components/CustomHeader";
import { Stack } from "expo-router";
import { Box, Heart, UserRound } from "lucide-react-native";
import { HStack, Text, VStack, Image } from "@/components/ui";
import { ScrollView, View } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TracksList } from "@/components/TrackList";
import { Track } from "react-native-track-player";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getFavorites, removeSongFromFavorite } from "@/services/cacheService";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { MyTrack } from "@/types/zing.types";
import { HistoryTrackBottomSheet } from "@/components/bottomSheet/HistoryTrackBottomSheet";
import { useFavoriteStore } from "@/store/mylib";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import { unknownTrackImageSource } from "@/constants/image";
import { Divider } from "@/components/ui/divider";
import { BS_AddToPlaylist } from "@/components/buttons/BS_AddToPlaylist";
import ButtonBottomSheet from "@/components/bottomSheet/ButtonBottomSheet";
import { BS_Download } from "@/components/buttons/BS_Download";
import { BS_MoveToArtist } from "@/components/buttons/BS_MoveToArtist";
import { BS_Share } from "@/components/buttons/BS_Share";
import { useModal } from "@/context/modal";

export default function Favorite() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MyTrack | null>(null);
  const [tracks, setTracks] = useState<MyTrack[]>([]);
  const removeFavorite = useFavoriteStore((state) => state.removeTrackFromFavorites);
  const favoriteStore = useFavoriteStore((state) => state.favorites);
  const { show } = useModal();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getFavorites();
        setTracks(data);
      } catch (error) {
        console.log("No data found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [favoriteStore]);

  const handleFavoritePress = () => {
    if (!selectedItem) return;
    show({
      title: "Xoá khỏi yêu thích",
      message: "Bạn có chắc muốn xoá bài hát này khỏi danh sách yêu thích?",
      confirmText: "Xoá",
      cancelText: "Huỷ",
      onConfirm: async () => {
        try {
          await removeSongFromFavorite(selectedItem);
          removeFavorite(selectedItem.id);
          setTracks((prev) => prev.filter((track) => track.id !== selectedItem.id));
          handleDismissModalPress();
        } catch (error) {
          console.error("Error removing from favorites:", error);
        }
      },
      type: "normal",
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView className="bg-background-0 dark:bg-background-0 flex-1">
        <LoadingOverlay isUnder={true} />
        <CustomHeader
          title="Yêu thích"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0 dark:bg-background-0"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background-0 dark:bg-background-0 flex-1">
      <ScrollView className="bg-background-0 dark:bg-background-0">
        <CustomHeader
          title="Yêu thích"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0 dark:bg-background-0"
        />
        <TracksList
          id="favorite"
          tracks={tracks}
          className="px-4"
          scrollEnabled={false}
          ListFooterComponent={<View className="h-28" />}
          ItemSeparatorComponent={() => <View className="h-3" />}
          onTrackOptionPress={(track: MyTrack) => {
            handlePresentModalPress();
            setSelectedItem(track);
          }}
        />
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
            <ButtonBottomSheet
              onPress={handleFavoritePress}
              fillIcon={true}
              buttonIcon={Heart}
              buttonText="Đã thích"
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
      </ScrollView>
    </SafeAreaView>
  );
}
