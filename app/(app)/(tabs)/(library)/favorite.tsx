import CustomHeader from "@/components/CustomHeader";
import { Stack } from "expo-router";
import { UserRound } from "lucide-react-native";
import { Text } from "@/components/ui";
import { ScrollView, View } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TracksList } from "@/components/TrackList";
import { Track } from "react-native-track-player";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getFavorites } from "@/services/fileService";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export default function Favorite() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getFavorites();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-background-0 dark:bg-background-0 flex-1">
        <LoadingOverlay 
          isUnder={true}
        />
        <CustomHeader
          title="Yêu thích"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0 dark:bg-background-0"
        />
      </SafeAreaView>
    )
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
          ListFooterComponent={
            <View className="h-28" />
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          onTrackOptionPress={(track: Track) => {
            handlePresentModalPress();
            setSelectedTrack(track);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
