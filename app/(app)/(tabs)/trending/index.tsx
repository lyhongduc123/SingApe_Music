import CustomHeader from "@/components/CustomHeader";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TracksListItem } from "@/components/TrackListItem";
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Image,
  Icon,
  Button,
} from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { unknownTrackImageSource } from "@/constants/image";
import { iconColor } from "@/constants/tokens";
import { convertZingToTrack } from "@/helpers/convert";
import { fetchChart, fetchSong, fetchTop100Tracks } from "@/lib/spotify";
import { playTrack } from "@/services/playbackService";
import { Chart, ExtendedTrack, MyTrack, RegionChart } from "@/types/zing.types";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  CircleSmall,
  Play,
  Scroll,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList, Pressable, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Track, useActiveTrack, useIsPlaying } from "react-native-track-player";
import { useSelector } from "react-redux";
import colors, { inherit } from "tailwindcss/colors";
import { P } from "ts-pattern";

export default function Trending() {
  const [data, setData] = useState<Chart | null>(null);
  const [trendingTracks, setTrendingTracks] = useState<MyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch trending data from an API or service
    const fetchTrendingData = async () => {
      setLoading(true);
      try {
        const data = await fetchChart();
        setData(data);
        const track = await Promise.all(
          data.RTChart.items.map((item: ExtendedTrack) =>
            convertZingToTrack(item)
          )
        );
        setTrendingTracks(track);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0">
        <LoadingOverlay isUnder={true} />
        <CustomHeader
          title="Xu hướng"
          showBack={false}
          titleClassName="text-3xl font-bold"
          headerClassName="px-4"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView 
      contentContainerStyle={{
          paddingBottom: 50,
        }}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader
          title="Xu hướng"
          showBack={false}
          titleClassName="text-3xl font-bold"
          headerClassName="px-4"
        />
        <TrendingList tracks={trendingTracks} />
        <Box className="flex-1 bg-transparent rounded-t-md">
        <Divider className="mb-2"/>
          <Heading className="text-2xl font-bold text-center">Xu hướng tuần</Heading>
          <Pressable onPress={() => {}}>
            <WeeklyList data={data?.weekChart.vn} title="V-POP"/>
          </Pressable>
          <Pressable onPress={() => {}}>
            <WeeklyList data={data?.weekChart.us} title="US-UK"/>
          </Pressable>
          <Pressable onPress={() => {}}>
            <WeeklyList data={data?.weekChart.korea} title="K-POP"/>
          </Pressable>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}









interface TrendingListProps {
  tracks?: MyTrack[];
}

const TrendingList = ({ tracks }: TrendingListProps) => {
  const [visibleCount, setVisibleCount] = useState(20);

  const visibleTracks = tracks?.slice(0, visibleCount) || [];

  const onTrackSelect = async (track: Track) => {
    const { url } = await fetchSong(track.id);
    if (url) {
      track.url = url;
      console.log("Track URL:", url);
      playTrack(track);
    } else {
      console.error("Error fetching song URL:", url);
    }
  };

  const numberStyle = (index: number) => {
    if (index === 1) return "text-yellow-500 text-xl font-bold";
    if (index === 2) return "text-gray-500 text-xl font-bold";
    if (index === 3) return "text-amber-500 text-xl font-bold";
    return "text-primary-500 text-lg font-medium";
  };

  const rankingStyle = (rakingStatus: number) => {
    if (rakingStatus > 0)
      return (
        <HStack className="items-center">
          <Icon as={ArrowUp} className="text-green-500 w-3 h-3" />
          <Text className="text-green-500 text-xs font-bold">
            {rakingStatus}
          </Text>
        </HStack>
      );
    if (rakingStatus < 0)
      return (
        <HStack className="items-center">
          <Icon as={ArrowDown} className="text-red-500 w-3 h-3" />
          <Text className="text-red-500 text-xs font-bold">
            {Math.abs(rakingStatus)}
          </Text>
        </HStack>
      );
    if (rakingStatus === 0)
      return (
        <Icon
          as={CircleSmall}
          className="text-gray-500 fill-gray-500 w-2 h-2"
          size="sm"
        />
      );
    return null;
  };

  return (
    <Box>
    <FlatList
      data={visibleTracks}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      windowSize={10}
      ItemSeparatorComponent={() => (
        <View className="h-3 bg-transparent" />
      )}
      ListFooterComponent={
        visibleCount < (tracks?.length || 0) ? (
          <Center className="w-full h-10 bg-background-0">
            <Button
              variant="link"
              className="rounded-full"
              onPress={() => setVisibleCount(visibleCount + 100)}
            >
              <VStack className="items-center">
              <ButtonText className="text-sm">Xem thêm</ButtonText>
              <ButtonIcon as={ChevronDown} />
              </VStack>
            </Button>
  
          </Center>
        ) : (
          <></>
        )
      }
      renderItem={({ item: track, index: index }) => (
        <HStack className="pr-4 pl-2">
          <Center className="w-14 pr-2">
            <Text className={numberStyle(index + 1)}>{index + 1}</Text>
            {rankingStyle(track.rakingStatus ?? 0)}
          </Center>
          <Box className="flex-1">
            <TracksListItem
              track={track}
              onTrackSelect={() => onTrackSelect(track)}
            />
          </Box>
        </HStack>
      )}
    />
    </Box>
  );
};

interface WeeklyListProps {
  data?: RegionChart;
  title: string;
}

const WeeklyList = (props: WeeklyListProps) => {
  return (
    <Card className="rounded-xl m-4 p-0">
      <HStack space="md" className="flex-1 w-full h-full justify-evenly p-2">
        <Image
          source={props.data?.items[0].thumbnailM || unknownTrackImageSource}
          className="rounded-xl m-2"
          alt="track artwork"
        />
        <VStack className="flex-1">
          <Text className="text-lg font-semibold text-white">
            {props.title}
          </Text>
          {props.data?.items.slice(0, 3).map((item, index) => {
            return (
            <Text key={item.encodeId || index}
            className="text-sm text-white" ellipsizeMode="tail" numberOfLines={1}>
              {index + 1}. {item.title} - {item.artists[0].name}
            </Text>
            )
          })}
        </VStack>
      </HStack>
      <Image
        source={props.data?.items[0].thumbnailM || unknownTrackImageSource}
        className="rounded-xl w-full h-full absolute -z-10"
        blurRadius={40}
        alt="blurred"
      />
    </Card>
  );
};

