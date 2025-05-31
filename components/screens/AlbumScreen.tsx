import { FlatList, ScrollView, View } from "react-native";
import { Image, VStack, Text, HStack, Box, Button } from "./../ui";
import { Heading } from "./../ui/heading";
import { ButtonIcon, ButtonText } from "./../ui/button";
import {
  ArrowLeft,
  CircleArrowDown,
  CircleCheck,
  CirclePlus,
  CircleUserRound,
  CircleX,
  EllipsisVertical,
  Heart,
  Pause,
  Pen,
  Play,
  Plus,
  Share2,
  Shuffle,
} from "lucide-react-native";
import { TracksList } from "./../TrackList";
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
import TrackPlayer, {
  isPlaying,
  Track,
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";
import { useCallback, useEffect, useRef, useState } from "react";
import { getGradient } from "@/helpers/color";
import { unknownTrackImageSource } from "@/constants/image";
import { useAuth } from "@/context/auth";
import { P } from "ts-pattern";
import { Artist, MyTrack } from "@/types/zing.types";
import { getTotalDuration } from "@/helpers/calc";
import { formatDate } from "@/helpers/format";
import { MyBottomSheet } from "../bottomSheet/MyBottomSheet";
import { Divider } from "../ui/divider";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueueStore } from "@/store/queue";
import { set } from "@gluestack-style/react";

interface AlbumProps {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  artists?: Artist[];
  releaseDate?: string;
  tracks?: MyTrack[];
  variant?: "library" | "songs";
  inUserPlaylist?: boolean;
  onTrackPress?: (track: Track) => void;
  onPlayPress?: () => void;
  onShufflePress?: () => void;
  onAddToPlaylistPress?: () => void;
  onOptionPress?: () => void;
  onDownloadPress?: () => void;
}

export const AlbumScreen = ({
  id,
  title,
  description,
  imageUrl,
  artists,
  tracks,
  variant = "songs",
  onTrackPress,
  releaseDate,
  onPlayPress,
  onShufflePress,
  onAddToPlaylistPress,
  onOptionPress,
  onDownloadPress,
  inUserPlaylist = false,
}: AlbumProps) => {
  const [selectedItem, setSelectedItem] = useState<Track>();
  const { playing } = useIsPlaying();
  const queueId = useQueueStore((state) => state.activeQueueId);
  const [activeButton, setActiveButton] = useState(false);

  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue<number>(0);
  const colorScheme = useColorScheme();

  const formatedDate = formatDate(releaseDate || "");
  const artistsName = "Unknown Artist";

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
    const opacity = interpolate(
      scrollY.value,
      [0, 160],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const playButtonOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [234, 235], [0, 1]);

    return { opacity };
  });

  const playButtonAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [238, 278],
      [42, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleTrackOptionPress = (track: Track) => {
    handlePresentModalPress();
    setSelectedItem(track);
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
  const handleDownloadPress = () => {
    // Handle download action
  };
  const handleRemoveFromPlaylistPress = () => {
    // Handle remove from playlist action
  };
  const handleArtistPress = () => {
    handleDismissModalPress();
    router.navigate({
      pathname: `/(app)/(tabs)/(${variant})/artists/[id]`,
      params: { id: selectedItem?.artist ?? "" },
    });
  };
  const handleSharePress = () => {
    // Handle share action
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
          {inUserPlaylist ? (
            <ButtonIcon as={CircleCheck} className={buttonIconStyle} />
          ) : (
            <ButtonIcon as={CirclePlus} className={buttonIconStyle} />
          )}
        </Button>
        <Button
          variant="solid"
          className="rounded-full justify-center bg-transparent h-14 w-14 data-[active=true]:bg-transparent data-[active=true]:opacity-40"
          size="md"
          onPress={onDownloadPress}
        >
          <ButtonIcon as={CircleArrowDown} className={buttonIconStyle} />
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
      <Animated.ScrollView
        className="flex-1 w-full bg-transparent"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
      >
        <LinearGradient
          colors={getGradient(id || "")}
          style={[{ paddingTop: insets.top }]}
        >
          <VStack className="bg-transparent">
            <Box className="w-full justify-center items-center mt-4">
              <Image
                source={{ uri: imageUrl || unknownTrackImageSource }}
                className="w-48 h-48 rounded-lg"
                alt="Playlist Image"
                resizeMode="cover"
              />
            </Box>
            <Box className="justify-center items-center mt-4">
              <Heading>{title}</Heading>
              <Text className="text-gray-500 mt-2">{description}</Text>
            </Box>
            <HStack space="md" className="items-center px-4">
              <Image
                source={{
                  uri: artists?.[0]?.thumbnail || unknownTrackImageSource,
                }}
                className="w-7 h-7 rounded-full"
                alt="User"
                resizeMode="cover"
              />
              <Text className="text-gray-500 font-bold">{artistsName}</Text>
            </HStack>
            <Box className="w-full px-4 pt-2">
              <Text className="text-gray-500">{formatedDate}</Text>
            </Box>
            <HStack className="space-x-2 justify-between pr-4 py-2 w-full">
              {variantSong()}
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
                    onPress={() => {
                      setActiveButton(!activeButton);
                      onPlayPress?.();
                    }}
                  >
                    <ButtonIcon
                      as={activeButton ? Pause : Play}
                      className="text-black fill-black w-6 h-6"
                    />
                  </Button>
                </Animated.View>
              </HStack>
            </HStack>
          </VStack>
        </LinearGradient>
        <TracksList
          id={title || "random"}
          tracks={tracks || []}
          scrollEnabled={false}
          className="p-4"
          ItemSeparatorComponent={() => <View className="h-3" />}
          onTrackOptionPress={handleTrackOptionPress}
          onTrackSelect={onTrackPress}
        />
      </Animated.ScrollView>

      <View className="absolute w-full" style={{ paddingTop: insets.top }}>
        <Animated.View
          style={[headerBackgroundAnimatedStyle, {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingTop: insets.top,
          }]}
          // className="absolute w-full h-full bg-transparent"
        >
          <LinearGradient
            colors={getGradient(id || "")}
            // className="absolute w-full h-full"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
            className="text-primary-500 text-xl font-bold ml-4"
          >
            Danh sách phát
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
            onPress={() => {
              setActiveButton(!activeButton);
              onPlayPress;
            }}
          >
            <ButtonIcon
              as={activeButton ? Pause : Play}
              className="text-black fill-black"
            />
          </Button>
        </Animated.View>
      </View>
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
          <ButtonBottomSheet
            onPress={handleAddToPlaylistPress}
            buttonIcon={CirclePlus}
            buttonText="Thêm vào danh sách phát"
          />
          <ButtonBottomSheet
            onPress={handleFavoritePress}
            stateChangable={true}
            fillIcon={selectedItem?.isFavorite}
            buttonIcon={Heart}
            buttonText="Thêm vào yêu thích"
          />
          <ButtonBottomSheet
            onPress={handleDownloadPress}
            buttonIcon={CircleArrowDown}
            buttonText="Tải xuống"
          />
          <ButtonBottomSheet
            onPress={handleRemoveFromPlaylistPress}
            buttonIcon={CircleX}
            buttonText="Xóa khỏi danh sách phát"
          />
          <ButtonBottomSheet
            onPress={handleArtistPress}
            buttonIcon={CircleUserRound}
            buttonText="Chuyển đến nghệ sĩ"
          />
          <ButtonBottomSheet
            onPress={handleSharePress}
            buttonIcon={Share2}
            buttonText="Chia sẻ"
          />
        </VStack>
      </MyBottomSheet>
    </View>
  );
};

const buttonIconStyle = "text-primary-500 w-6 h-6";
