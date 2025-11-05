import { FlatList, ScrollView, View } from "react-native";
import { Image, VStack, Text, HStack, Box, Button } from "@/components/ui";
import { Heading } from "@/components/ui/heading";
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
  UserRoundCheck,
} from "lucide-react-native";
import { TracksList } from "@/components/TrackList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import colors from "tailwindcss/colors";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { backgroundColor } from "@/constants/tokens";
import {
  isPlaying,
  Track,
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";
import { useCallback, useRef, useState } from "react";
import { getGradient } from "@/helpers/color";
import { unknownTrackImageSource } from "@/constants/image";
import { useAuth } from "@/context/auth";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import { MyTrack } from "@/types/zing.types";
import { Divider } from "@/components/ui/divider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ButtonBottomSheet from "@/components/bottomSheet/ButtonBottomSheet";
import { useQueueStore } from "@/store/queue";
import { generateTracksListId } from "@/services/playbackService";
import { BS_MoveToArtist } from "../buttons/BS_MoveToArtist";
import { BS_AddToPlaylist } from "../buttons/BS_AddToPlaylist";
import { BS_AddToFavorite } from "../buttons/BS_AddToFavorite";
import { BS_Download } from "../buttons/BS_Download";
import { BS_RemoveFromPlaylist } from "../buttons/BS_RemoveFromPlaylist";
import { BS_Share } from "../buttons/BS_Share";
import { MergeImage } from "../MergeImage";

interface PlaylistProps {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  createdBy?: string;
  userImage?: string;
  tracks?: MyTrack[];
  variant?: "library" | "songs";
  onTrackPress?: (track: Track) => void;
  onPlayPress?: () => void;
  onShufflePress?: () => void;
  onAddToPlaylistPress?: () => void;
  onOptionPress?: () => void;
  onPlusPress?: () => void;
  onEditPress?: () => void;
  onRemoveFromPlaylist: (track: MyTrack) => Promise<void>;
}

export const PlaylistScreen = ({
  id,
  title,
  description,
  imageUrl,
  createdBy,
  userImage,
  tracks,
  variant = "songs",
  onTrackPress,
  onPlayPress,
  onShufflePress,
  onAddToPlaylistPress,
  onOptionPress,
  onPlusPress,
  onEditPress,
  onRemoveFromPlaylist,
}: PlaylistProps) => {
  const [selectedItem, setSelectedItem] = useState<MyTrack | null>(null);
  const { playing } = useIsPlaying();
  const queue = useQueueStore((state) => state.activeQueueId);

  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue<number>(0);
  const colorScheme = useColorScheme();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const scrollHeaderTitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [160, 200], [0, 1]);
    return { opacity };
  });

  const headerBackgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 200], [0, 1]);
    return { opacity };
  });

  const playButtonOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [225, 226], [0, 1]);

    return { opacity };
  });

  const playButtonAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [210, 250],
      [42, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const IMAGE_HEIGHT = 28;
    const scale = interpolate(
      scrollY.value,
      [0, 70],
      [1, 0.6],
      Extrapolation.CLAMP
    );
    const translateY = IMAGE_HEIGHT * (1 - scale) * 5;
    const opacity = interpolate(
      scrollY.value,
      [70, 150],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }, { translateY: translateY }],
    };
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleTrackOptionPress = (track: MyTrack) => {
    setSelectedItem(track);
    handlePresentModalPress();
  };

  const variantRender = () => {
    switch (variant) {
      case "library":
        return variantLibrary();
      case "songs":
        return variantSong();
      default:
        return null;
    }
  };

  const variantSong = () => {
    return (
      <HStack>
        <Button
          variant="solid"
          className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
          size="md"
          onPress={onAddToPlaylistPress}
        >
          <ButtonIcon as={CirclePlus} className={buttonIconStyle} />
        </Button>
      </HStack>
    );
  };

  const variantLibrary = () => {
    return (
      <HStack>
        <Button
          variant="solid"
          className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
          size="md"
          onPress={onPlusPress}
        >
          <ButtonIcon as={Plus} className={buttonIconStyle} />
        </Button>
        <Button
          variant="solid"
          className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
          size="md"
          onPress={onEditPress}
        >
          <ButtonIcon as={Pen} className={buttonIconStyle} />
        </Button>
        <Button
          variant="solid"
          className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
          size="md"
          onPress={onOptionPress}
        >
          <ButtonIcon as={EllipsisVertical} className={buttonIconStyle} />
        </Button>
      </HStack>
    );
  };

  return (
    <View className="flex-1">
      {/* <Animated.ScrollView
        className="flex-1 w-full bg-transparent"
        onScroll={scrollHandler}
      > */}
      <TracksList
        id={id || title || "default"}
        tracks={tracks || []}
        ItemSeparatorComponent={() => <View className="h-3" />}
        onScroll={scrollHandler}
        scrollEnabled={true}
        trackClassName="px-4"
        ListFooterComponent={() => <View className="h-28" />}
        onTrackSelect={onTrackPress}
        onTrackOptionPress={handleTrackOptionPress}
        ListHeaderComponent={
          <LinearGradient
            colors={getGradient(id || "")}
            style={[{ paddingTop: insets.top }]}
            locations={[0.2, 0.4, 0.6, 0.8, 1]}
          >
            <VStack className="bg-transparent">
              <Box className="w-full justify-center items-center mt-4">
                <Animated.View style={[imageAnimatedStyle]}>
                  {imageUrl ? (
                    <Image
                      source={imageUrl || unknownTrackImageSource}
                      className="w-48 h-48 rounded-lg"
                      alt="Playlist Image"
                      resizeMode="cover"
                    />
                  ) : (
                    <MergeImage
                      image1={tracks?.[0]?.artwork || null}
                      image2={tracks?.[1]?.artwork || unknownTrackImageSource}
                      image3={tracks?.[2]?.artwork || unknownTrackImageSource}
                      image4={tracks?.[3]?.artwork || unknownTrackImageSource}
                    />
                  )}
                </Animated.View>
              </Box>
              <Box className="justify-center items-center mt-4">
                <Heading>{title}</Heading>
                {description && <Text className="text-gray-500 mt-2">{description}</Text>}
              </Box>
              <HStack space="md" className="items-center px-4 mt-2">
                <Image
                  source={{
                    uri:
                      userImage ||
                      "https://ui-avatars.com/api/?length=1&bold=true&background=f76806&name=" +
                        createdBy,
                  }}
                  className="w-7 h-7 rounded-full"
                  alt="User"
                  resizeMode="cover"
                />
                <Text className="text-primary-500 font-bold">{createdBy || "SingApe"}</Text>
              </HStack>
              <Text className="text-gray-500 text-sm px-4 mt-2">
                {tracks?.length || 0} bài hát
              </Text>
              <HStack className="space-x-2 justify-between pr-4 py-2 w-full">
                {variantRender()}
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
                        as={playing && queue === id ? Pause : Play}
                        className="text-black fill-black w-6 h-6"
                      />
                    </Button>
                  </Animated.View>
                </HStack>
              </HStack>
            </VStack>
          </LinearGradient>
        }
      />
      {/* </Animated.ScrollView> */}

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
          <LinearGradient
            colors={getGradient(id || "")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: insets.top,
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
            className="text-primary-500 text-2xl font-bold ml-4"
          >
            {title}
          </Animated.Text>
        </HStack>
        <Animated.View
          className="absolute right-4 top-7"
          style={[
            playButtonAnimatedStyle,
            playButtonOpacity,
            { paddingTop: insets.top },
          ]}
        >
          <Button
            variant="solid"
            className="rounded-full justify-center bg-indigo-400 data-[active=true]:bg-indigo-900 h-14 w-14"
            size="md"
            onPress={onPlayPress}
          >
            <ButtonIcon
              as={playing && queue === id ? Pause : Play}
              className="text-black fill-black"
            />
          </Button>
        </Animated.View>
      </Animated.View>

      {/* Bottom Sheet Modal ----------------------------------------------------------------------------*/}
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
        <VStack space="lg" className="w-full">
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
          <BS_RemoveFromPlaylist
            selectedItem={selectedItem}
            handleDismissModalPress={handleDismissModalPress}
            handleRemoveFromPlaylist={onRemoveFromPlaylist}
          />
          <BS_Share
            selectedItem={selectedItem}
            handleDismissModalPress={handleDismissModalPress}
          />
        </VStack>
      </MyBottomSheet>
    </View>
  );
};

const buttonIconStyle = "text-primary-500 w-6 h-6";
