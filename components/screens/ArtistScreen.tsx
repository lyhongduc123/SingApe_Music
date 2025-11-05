import { FlatList, ScrollView, SectionList, View } from "react-native";
import {
  Image,
  VStack,
  Text,
  HStack,
  Box,
  Button,
  Center,
} from "@/components/ui";
import { Heading } from "@/components/ui/heading";
import Library from "@/assets/data/library.json";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  ArrowLeft,
  CircleArrowDown,
  CirclePlus,
  CircleUserRound,
  CircleX,
  Disc,
  Disc2,
  EllipsisVertical,
  Heart,
  Pause,
  Pen,
  Play,
  Plus,
  Share,
  Share2,
  Shuffle,
  User,
} from "lucide-react-native";
import { TracksList } from "@/components/TrackList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import colors, { gray } from "tailwindcss/colors";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { backgroundColor } from "@/constants/tokens";
import {
  isPlaying,
  Track,
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";
import { useCallback, useEffect, useRef, useState } from "react";
import { getGradientColor, getImageColor } from "@/helpers/color";
import {
  unknownArtistImageSource,
  unknownTrackImageSource,
} from "@/constants/image";
import { useAuth } from "@/context/auth";
import { P } from "ts-pattern";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import {
  Artist,
  ArtistResult,
  ExtendedTrack,
  MyTrack,
} from "@/types/zing.types";
import { Divider } from "@/components/ui/divider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ButtonBottomSheet from "@/components/bottomSheet/ButtonBottomSheet";
import { TracksListItem } from "../TrackListItem";
import { set } from "@gluestack-style/react";
import { convertToTrack, convertZingToTrack } from "@/helpers/convert";
import { AlbumList } from "../AlbumList";
import { ArtistList } from "../ArtistList";
import { LoadingOverlay } from "../LoadingOverlay";
import { formatNumber } from "@/helpers/format";
import { useFloatingPlayerVisible } from "@/hooks/useFloatingPlayerVisible";
import { BS_AddToPlaylist } from "../buttons/BS_AddToPlaylist";
import { BS_AddToFavorite } from "../buttons/BS_AddToFavorite";
import { BS_Download } from "../buttons/BS_Download";
import { BS_MoveToArtist } from "../buttons/BS_MoveToArtist";
import { BS_Share } from "../buttons/BS_Share";
import { useDebounce } from "@/hooks/useDebounce";
import { useFollowStore } from "@/store/mylib";
import { addFollowArtist, removeFollowArtist } from "@/services/cacheService";

interface ArtistProps {
  id?: string;
  name?: string;
  alias?: string;
  description?: string;
  imageUrl?: string;
  data?: ArtistResult;
  gradientColor: string[];
  onRefresh?: () => void;
  onTrackPress?: (track: Track) => void;
  onPlayPress?: () => void;
  onShufflePress?: () => void;
  onAddToPlaylistPress?: () => void;
  onOptionPress?: () => void;
  onPlusPress?: () => void;
  onEditPress?: () => void;
}

export const ArtistScreen = ({
  id,
  name,
  description,
  alias,
  imageUrl,
  data,
  gradientColor,
  onRefresh,
  onTrackPress,
  onPlayPress,
  onShufflePress,
  onOptionPress,
}: ArtistProps) => {
  const followStore = useFollowStore();
  const { user } = useAuth();

  const [selectedItem, setSelectedItem] = useState<MyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followed, setFollowed] = useState(false);
  const { playing } = useIsPlaying();
  const { visible } = useFloatingPlayerVisible();
  const [showAllTracks, setShowAllTracks] = useState<boolean>(false);

  const debouncedFollow = useDebounce(followed, 2000);
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue<number>(0);
  const colorScheme = useColorScheme();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageSectionAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 160],
      [0, -10],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 160],
      [0.8, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const headerBackgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [160, 200],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const scrollHeaderTitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [160, 200], [0, 1]);
    return { opacity };
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  useEffect(() => {
    if (data) {
      const isFollowed = followStore.isArtistFollowing(id || "");
      console.log("Is artist followed:", isFollowed);
      setFollowed(isFollowed);
    }
  }, []);

  useEffect(() => {
    const updateFollow = async () => {
      try {
        if (debouncedFollow) {
          const artist: Artist = {
            id: id || "",
            encodeId: id || "",
            name: name || "",
            thumbnail: imageUrl || "",
            thumbnailM: imageUrl || "",
            totalFollow: data?.totalFollow || 0,
            isOA: true,
            link: "",
            spotlight: "false",
            alias: alias || "",
            playlistId: "",
          };
          console.log("Adding artist to following:", artist);
          followStore.addArtistToFollowing(artist);
          if (user?.id) {
            console.log("User ID:", user.id);
            await addFollowArtist(user.id, artist);
          } else {
            console.log("User ID is undefined");
          }
        } else {
          followStore.removeArtistFromFollowing(id || "");
          if (user?.id) {
            console.log("Removing artist from following:", id);
            await removeFollowArtist(user.id, id || "");
          } else {
            console.log("User ID is undefined");
          }
        }
      } catch (e) {
        console.log("Failed to update follow state", e);
      }
    };

    updateFollow();
  }, [debouncedFollow]);

  const handleTrackOptionPress = (track: MyTrack) => {
    setSelectedItem(track);
    handlePresentModalPress();
  };

  const handleAddToPlaylistPress = () => {};
  const handleFavoritePress = () => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        isFavorite: !selectedItem?.isFavorite,
      });
    }
  };

  const onFollowPress = () => {
    setFollowed(!followed);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
    }
    setIsRefreshing(false);
  };

  const renderItem = ({
    items,
    sectionType,
    title,
  }: {
    items: ExtendedTrack[] | Artist[];
    sectionType: string;
    title: string;
  }) => {
    if (title === "MV") return null;
    if (sectionType === "artist") {
      return (
        <View>
          <Heading className="text-2xl font-semibold px-4 py-2">
            {title}
          </Heading>
          <ArtistList data={items as Artist[]} horizontal={true} />
        </View>
      );
    }

    const tracks = items.map((item) => convertToTrack(item as ExtendedTrack));

    if (sectionType === "playlist") {
      return (
        <View>
          <Heading className="text-2xl font-semibold px-4 py-2">
            {title}
          </Heading>
          <AlbumList data={tracks} horizontal={true} />
        </View>
      );
    }

    return (
      <View>
        <Heading className="text-2xl font-semibold px-4 py-2">{title}</Heading>
        <TracksList
          id={data?.id ?? ""}
          tracks={showAllTracks ? tracks : tracks.slice(0, 6)}
          scrollEnabled={false}
          showIndex={true}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListFooterComponent={() => (
            <Center className="py-2">
              <Button
                variant="outline"
                className="rounded-full"
                onPress={() => setShowAllTracks(!showAllTracks)}
              >
                <ButtonText className="text-primary-500">
                  {showAllTracks ? "Ẩn bớt" : "Xem thêm"}
                </ButtonText>
              </Button>
            </Center>
          )}
          className="px-4"
        />
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* <Animated.ScrollView
        className="flex-1 w-full bg-transparent"
        onScroll={scrollHandler}
      ></Animated.ScrollView> */}
      <Animated.FlatList
        data={data?.sections || []}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={() => (
          <View className="w-full">
            <LinearGradient
              colors={[gradientColor[0], gradientColor[1]]}
              locations={[0.6, 1]}
              className="absolute w-full h-full -z-20"
            />
            <View>
              <Animated.View
                className="w-full h-72 relative rounded-lg overflow-hidden bg-transparent -z-20"
                style={imageSectionAnimatedStyle}
              >
                <Image
                  source={imageUrl || unknownArtistImageSource}
                  className="absolute w-full h-full -z-10"
                  resizeMode="cover"
                  alt="artist image"
                />
              </Animated.View>
              <View className="absolute bottom-0 left-0 right-0 px-4 py-1">
                <Heading numberOfLines={1} className="text-white text-5xl">
                  {name}
                </Heading>
              </View>
            </View>
            <Text className="text-primary-700 px-4 pt-2">
              {formatNumber(data?.totalFollow ?? 0)} người theo dõi
            </Text>
            <HStack className="space-x-2 justify-between pr-4 pb-2 pt-1 w-full pl-4">
              <HStack className="items-center space-x-2">
                <Button
                  variant="outline"
                  action="primary"
                  className="rounded-md justify-center bg-transparent w-fit"
                  size="md"
                  onPress={onFollowPress}
                >
                  <ButtonText>
                    {followed ? "Đang theo dõi" : "Theo dõi"}
                  </ButtonText>
                </Button>
                <Button
                  variant="solid"
                  className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
                  size="md"
                  onPress={onOptionPress}
                >
                  <ButtonIcon
                    as={EllipsisVertical}
                    className={buttonIconStyle}
                  />
                </Button>
              </HStack>
              <HStack className="justify-items-end gap-2">
                <Button
                  variant="solid"
                  className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
                  size="md"
                  onPress={onShufflePress}
                >
                  <ButtonIcon as={Shuffle} className={buttonIconStyle} />
                </Button>
                <Animated.View>
                  <Button
                    variant="solid"
                    className="rounded-full justify-center bg-indigo-400 data-[active=true]:bg-indigo-900 h-14 w-14"
                    size="md"
                    onPress={onPlayPress}
                  >
                    <ButtonIcon
                      as={playing ? Pause : Play}
                      className="text-black fill-black w-6 h-6"
                    />
                  </Button>
                </Animated.View>
              </HStack>
            </HStack>
          </View>
        )}
        renderItem={({ item }) => renderItem(item)}
        ListFooterComponent={() =>
          visible && <View className="h-28 bg-transparent" />
        }
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />

      <Animated.View
        className="absolute w-full"
        style={{ paddingTop: insets.top }}
      >
        <Animated.View
          style={[
            headerBackgroundAnimatedStyle,
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: insets.top,
            },
          ]}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: gradientColor[0],
            }}
          />
        </Animated.View>
        <HStack className="items-center w-full">
          <Button
            onPress={() => {
              router.back();
            }}
            variant="solid"
            className="bg-transparent rounded-full justify-center h-14 w-14 data-[active=true]:bg-transparent"
            size="md"
          >
            <ButtonIcon
              as={ArrowLeft}
              className="text-primary-500"
              size="xxl"
            />
          </Button>
          <Animated.Text
            style={[scrollHeaderTitleAnimatedStyle]}
            className="text-primary-500 text-xl font-semibold ml-4"
          >
            {name}
          </Animated.Text>
        </HStack>

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
      </Animated.View>
    </View>
  );
};

const buttonIconStyle = "text-primary-500 w-6 h-6";
