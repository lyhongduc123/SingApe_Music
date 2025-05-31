import CustomHeader from "@/components/CustomHeader";
import { Stack } from "expo-router";
import { UserRound } from "lucide-react-native";
import { Text } from "@/components/ui";
import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TracksList } from "@/components/TrackList";
import { Track } from "react-native-track-player";

export default function Follow() {
  const [isLoading, setIsLoading] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track>();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("https://api.example.com/favorites"); // Replace with your API endpoint
    //     const result = await response.json();
    //     setData(result);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchData();
  }, []);

  
  return (
    <SafeAreaView className="bg-background-0 dark:bg-background-0 flex-1">
      <ScrollView className="bg-background-0 dark:bg-background-0">
        <CustomHeader
          title="Đã tải"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0 dark:bg-background-0"
        />
        <TracksList
          id="follow"
          tracks={tracks}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          onTrackOptionPress={(track: Track) => {
            setSelectedTrack(track);
          }}
        />
        {/* <TrackActionSheet
                  isOpen={openActionsheet}
                  onClose={() => setOpenActionsheet(false)}
                  track={selectedTrack as Track}
                /> */}
      </ScrollView>
      
    </SafeAreaView>
  );
}
