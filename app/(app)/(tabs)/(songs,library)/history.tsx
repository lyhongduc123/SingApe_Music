import CustomHeader from "@/components/CustomHeader";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TracksList } from "@/components/TrackList";
import { Button } from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { useModal } from "@/context/modal";
import { supabase } from "@/lib/supabase";
import { deleteListeningHistory, getListeningHistory, saveListeningHistory } from "@/services/fileService";
import { MyTrack } from "@/types/zing.types";
import { Stack } from "expo-router";
import { Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Track, useActiveTrack } from "react-native-track-player";


export default function History() {
  const [tracks, setTracks] = useState<MyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { show } = useModal();

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
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
        
        setTracks(track);
        console.log("Fetched tracks: ", track.map((item) => item.id + " " + item.title));
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
        await deleteListeningHistory();
        setTracks([]);
      }
    })
  }
    

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
        centerTitle={true}
        headerClassName="bg-background-0"
        right={
          <Button
            variant="solid"
            size="md"
            onPress={handleDeleteHistory}
            className="w-10 h-10"
          >
            <ButtonText className="text-primary-500">
              Xoa
            </ButtonText>
          </Button>
        }
      />

      <TracksList
        id="history"
        tracks={tracks}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        className="px-4"
      />
    </SafeAreaView>
  );
}
