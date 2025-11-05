import ButtonBottomSheet from "@/components/bottomSheet/ButtonBottomSheet";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import { HistoryTrackBottomSheet } from "@/components/bottomSheet/HistoryTrackBottomSheet";
import CustomHeader from "@/components/CustomHeader";
import { downloadSong } from "@/components/DowloadMusic";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TracksList } from "@/components/TrackList";
import { Button, HStack, Pressable, Text, Image, VStack, Box } from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { unknownTrackImageSource } from "@/constants/image";
import { useModal } from "@/context/modal";
import { supabase } from "@/lib/supabase";
import {
  addSongToFavorite,
  clearListeningHistory,
  deleteListeningHistory,
  getListeningHistory,
  removeSongFromFavorite,
  saveListeningHistory,
} from "@/services/cacheService";
import { useFavoriteStore, useLibraryStore } from "@/store/mylib";
import { MyTrack } from "@/types/zing.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import { CircleArrowDown, CirclePlus, Heart, Share2, Trash, UserRoundCheck } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MyTrack | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { show } = useModal();
  const favouriteStore = useFavoriteStore();
  const historyStore = useLibraryStore((state) => state.history);
  const libraryStore = useLibraryStore();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        if (historyStore.length > 0) {
          return;
        }

        const history = await getListeningHistory();
        const track = history.map((item) => {
          return {
            id: item.track.id,
            title: item.track.title || "Unknown Title",
            artist: item.track.artist || "Unknown Artist",
            album: item.track.album || "Unknown Album",
            url: item.track.url,
            artwork: item.track.artwork || undefined,
            genre: item.track.genre || undefined,
          } as MyTrack;
        });
        libraryStore.setHistory(track);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handleDeleteHistory = async () => {
    show({
      title: "Xóa lịch sử",
      message: "Bạn có chắc chắn muốn xóa lịch sử nghe nhạc không?",
      type: "normal",
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm: async () => {
        libraryStore.clearHistory();
        await clearListeningHistory();
      },
    });
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <LoadingOverlay isUnder={true} />
        <CustomHeader
          title="Lịch sử"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <CustomHeader
        title="Lịch sử"
        showBack={true}
        headerClassName="bg-background-0"
        right={
          <Pressable
            onPress={handleDeleteHistory}
            className="px-3 mr-2 rounded-full data-[active=true]:opacity-50"
          >
            <Text className="text-primary-500 font-semibold">Xóa tất cả</Text>
          </Pressable>
        }
      />
      <TracksList
        id="history"
        tracks={historyStore}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        onTrackOptionPress={(handleTrack) => {
          setSelectedItem(handleTrack);
          handlePresentModalPress();
        }}
        className="px-4"
      />
      <HistoryTrackBottomSheet
        bottomSheetRef={bottomSheetRef}
        selectedItem={selectedItem}
        handleDismissModalPress={handleDismissModalPress}
        handlePresentModalPress={handleDownloadPress}
      />
    </SafeAreaView>
  );
}
