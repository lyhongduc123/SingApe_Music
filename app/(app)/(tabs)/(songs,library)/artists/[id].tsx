import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ArtistScreen } from "@/components/screens/ArtistScreen";
import { getGradient, getGradientColor, getImageColor, getSafeBackgroundColor } from "@/helpers/color";
import { fetchArtist, fetchSong } from "@/lib/spotify";
import { ArtistResult, MyTrack } from "@/types/zing.types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export default function Artist() {
  const item = useLocalSearchParams<MyTrack>();
  const [data, setData] = useState<ArtistResult>();
  const [gradientColor, setGradientColor] = useState<string[]>(getGradientColor("gray"));
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchArtist(item.id);
    // const data = await fetchSong("Z6697EZ9");
    // console.log("data", data);
    const gradient = await getImageColor(response.thumbnailM || "")
    setGradientColor([
      colorScheme === "dark" ? getSafeBackgroundColor(gradient[1], false) : getSafeBackgroundColor(gradient[0]),
      colorScheme === "dark" ? "#121212" : "#ffffff",
    ]);
    setData(response);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-background-0">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <LoadingOverlay isUnder={true} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-0">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ArtistScreen
        data={data}
        id={data?.id}
        name={data?.name}
        imageUrl={data?.thumbnailM}
        gradientColor={gradientColor}
        onRefresh={onRefresh}
      />
    </View>
  );
}
