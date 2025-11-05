import { MovingText } from "../components/MovingText";
import { PlayerControls } from "../components/PlayerControls";
import { PlayerProgressBar } from "../components/PlayerProgressbar";
import { PlayerRepeatToggle } from "../components/PlayerRepeatToggle";
import { unknownTrackImageSource } from "@/constants/image";
import { colors, fontSize } from "@/constants/tokens";
import { usePlayerBackground } from "@/hooks/usePlayerBackground";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Track, useActiveTrack } from "react-native-track-player";
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Center,
  Button,
  Icon,
} from "@/components/ui";
import { Alert, Image, Pressable, View } from "react-native";
import { PlayerShuffleToggle } from "@/components/PlayerShuffleToggle";
import { router } from "expo-router";
import { AddToPlaylistButton } from "@/components/AddToPlaylistButton";
import AudioQualitySwitcher from "@/components/AudioQualitySelector";
import { downloadSong } from "@/components/DowloadMusic";
import { KaraokeMode } from "@/components/KaraokeMode";
import { useState, useEffect, useRef } from "react";
import {
  addSongToFavorite,
  checkIfSongInFavorites,
  removeSongFromFavorite,
} from "@/services/cacheService";
import { MyTrack } from "@/types/zing.types";
import { ShareModal } from "@/components/ShareModal";
import { ButtonIcon } from "@/components/ui/button";
import {
  CircleArrowDown,
  EllipsisVertical,
  Heart,
  LetterText,
  Share,
  Share2,
} from "lucide-react-native";
import { MyBottomSheet } from "@/components/bottomSheet/MyBottomSheet";
import { TrackBottomSheet } from "@/components/bottomSheet/TrackBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFavoriteStore } from "@/store/mylib";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";
import { useSharedValue } from "react-native-reanimated";
import { MarqueeText } from "@/components/MarqueeText";
import { getMixedColor } from "@/helpers/color";
import { fetchLyric } from "@/lib/spotify";

const PlayerScreen = () => {
  const [showKaraoke, setShowKaraoke] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const activeTrack = useActiveTrack();
  const { imageColors } = usePlayerBackground(
    activeTrack?.artwork ?? unknownTrackImageSource
  );
  const { top, bottom } = useSafeAreaInsets();
  const [selectedItem, setSelectedItem] = useState<MyTrack | null>(null);

  const favoriteStore = useFavoriteStore();
  const isFavorite = favoriteStore.isTrackFavorite(selectedItem?.id ?? "");
  const [favorite, setFavorite] = useState<boolean>(isFavorite);

  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [measured, setMeasured] = useState(false);

  const [lyricText, setLyricText] = useState("");

  useEffect(() => {
    setMeasured(!measured);
  }, [selectedItem, textWidth]);

  const marqueePosition = useSharedValue(0);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handleDismissModalPress = () => {
    bottomSheetRef.current?.dismiss();
  };
  const handlePresentModalPress = () => {
    bottomSheetRef.current?.present();
  };

  // Sử dụng useEffect để cập nhật selectedItem khi activeTrack thay đổi
  useEffect(() => {
    if (activeTrack) {
      setSelectedItem(activeTrack as MyTrack);
    }
    loadLyrics();
  }, [activeTrack]);

  const loadLyrics = async () => {
    if (!activeTrack?.id) return;

    try {
      const lyricData = await fetchLyric(activeTrack.id);
      if (!lyricData?.file) {
        console.warn("No lyric file found");
        setLyricText("Không tìm thấy lời bài hát ");
        return;
      }

      const response = await fetch(lyricData.file);
      if (!response.ok) {
        console.warn("Failed to fetch lyric file, status:", response.status);
        setLyricText("Không tìm thấy lời bài hát ");
        return;
      }

      const text = await response.text();
      setLyricText(text);
    } catch (error) {
      console.log("Error loading lyrics:", error);
      setLyricText("");
    }
  };

  const debounceFavorite = useDebouncedCallback(async (item) => {
    await addSongToFavorite(item);
  }, 2000);

  const debounceUnfavorite = useDebouncedCallback(async (item) => {
    await removeSongFromFavorite(item);
  }, 2000);

  const handleFavoritePress = async () => {
    if (!selectedItem) return;

    if (isFavorite) {
      favoriteStore.removeTrackFromFavorites(selectedItem.id);
      debounceUnfavorite(selectedItem); // call debounced remove
    } else {
      favoriteStore.addTrackToFavorites(selectedItem);
      debounceFavorite(selectedItem); // call debounced add
    }
  };

  const mixedColors = imageColors
    ? getMixedColor(imageColors.background, imageColors.primary, 0.58)
    : getMixedColor(colors.background, colors.background, 0.58);

  if (!activeTrack) {
    console.log("No active track found");
    return (
      <Center className="flex-1 bg-background">
        <Spinner color="$icon" />
      </Center>
    );
  }

  console.log("Share button props:", {
    title: activeTrack.title,
    artist: activeTrack.artist,
    image: activeTrack.artwork,
    url: activeTrack.url,
  });

  if (showKaraoke) {
    return (
      <View className="flex-1 bg-black">
        <Pressable
          className="absolute top-0 right-0 p-4 z-50"
          style={{ marginTop: top }}
          onPress={() => setShowKaraoke(false)}
        >
          <MaterialIcons name="close" size={28} color="white" />
        </Pressable>
        <KaraokeMode lyricText={lyricText} />
      </View>
    );
  }

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={
        imageColors
          ? [imageColors.background, imageColors.primary]
          : [colors.background, colors.background]
      }
    >
      <Center className="absolute left-0 top-0 w-full mt-10">
        <Text className="text-white text-sm font-normal">ĐANG PHÁT</Text>
      </Center>
      <HStack
        className="absolute left-0 top-0 z-10 flex-row items-center justify-between w-full px-2"
        style={{ paddingTop: top + 10 }}
      >
        <Feather
          name="chevron-down"
          size={28}
          color="white"
          onPress={() => router.back()}
          style={{ marginLeft: 15 }}
        />
        <Button
          onPress={handlePresentModalPress}
          className="bg-transparent data-[active=true]:bg-transparent data-[active=true]:opacity-70"
        >
          <ButtonIcon as={EllipsisVertical} size="xxl" className="text-white" />
        </Button>
      </HStack>
      <Box
        className="flex-1 px-5"
        style={{ paddingTop: top + 60, paddingBottom: bottom }}
      >
        {/* <DismissPlayerSymbol /> */}

        <Center className="h-[45%] m-2">
          <Image
            source={{ uri: activeTrack.artwork ?? unknownTrackImageSource }}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            resizeMode="cover"
          />
        </Center>

        <VStack className="flex-1 mt-10">
          <VStack>
            {/* <VStack className="h-[70px]"> */}
            {/* <HStack className="h-full justify-between items-center">
                <HStack>
                  <MaterialCommunityIcons
                    name="share"
                    size={30}
                    color={colors.icon}
                    onPress={() => setShowModal(true)}
                  />
                  <ShareModal
                    isVisible={showModal}
                    onClose={() => setShowModal(false)}
                    title={activeTrack.title ?? ""}
                    artist={activeTrack.artist ?? ""}
                    url={activeTrack.url ?? ""}
                    image={activeTrack.artwork}
                  />
                </HStack> */}
            {/* <Center className="flex-1 overflow-hidden">
                  <MovingText
                    text={activeTrack.title ?? ""}
                    animationThreshold={30}
                    style={{
                      color: colors.text,
                      fontSize: 25,
                      fontWeight: "700",
                    }}
                  />
                  {activeTrack.artist && (
                    <Text
                      numberOfLines={1}
                      className="text-white text-[20px] font-bold opacity-80 w-[90%] text-center"
                    >
                      {activeTrack.artist}
                    </Text>
                  )}
                </Center> */}
            <HStack className="overflow-hidden justify-between items-center">
              <VStack space="xs" className="h-14 " style={{ width: "80%" }}>
                <MarqueeText
                  text={activeTrack.title || ""}
                  linearGradientColor={mixedColors}
                  textClassName="text-white font-semibold text-2xl"
                />
                <Text
                  numberOfLines={1}
                  className="text-white font-bold opacity-80 text-sm mx-2"
                >
                  {activeTrack.artist}
                </Text>
              </VStack>

              {/* <FontAwesome
                  name={isFavorite ? "heart" : "heart-o"}
                  size={20}
                  color={isFavorite ? colors.primary : colors.icon}
                  style={{ marginHorizontal: 14 }}
                  onPress={() => {
                    console.log("isFavorite", isFavorite);
                    handleFavoritePress();
                  }}
                /> */}
              <Button
                className="bg-transparent data-[active=true]:bg-transparent data-[active=true]:opacity-70"
                onPress={() => {
                  handleFavoritePress();
                }}
              >
                <ButtonIcon
                  as={Heart}
                  size="xxl"
                  className={
                    isFavorite ? "text-red-500 fill-red-500" : "text-white"
                  }
                  // style={{ color: isFavorite ? "red" : "white" }}
                />
              </Button>
            </HStack>
            {/* </HStack> */}
            {/* </VStack> */}
            <PlayerProgressBar style={{ marginTop: 20 }} className="mx-2" />
            <HStack className="items-center justify-center px-12 py-6">
              <PlayerShuffleToggle size={30} style={{ paddingTop: 10 }} />
              <PlayerControls style={{ marginTop: 10 }} iconSize={48} />
              <PlayerRepeatToggle size={30} style={{ paddingTop: 10 }} />
            </HStack>

            <HStack
              space="xl"
              className="items-center justify-between px-4 pt-4"
            >
              {/* <AddToPlaylistButton track={activeTrack}></AddToPlaylistButton> */}
              {/* <AudioQualitySwitcher
                qualities={[
                  {
                    label: "128Kps",
                    url: "https://example.com/audio/low-quality.mp3",
                  },
                ]}
              ></AudioQualitySwitcher> */}
              {/* <MaterialIcons
                name="mic"
                size={30}
                color="white"
                onPress={() => setShowKaraoke(true)}
              /> */}
              {/* <MaterialCommunityIcons
                name="share"
                size={30}
                color={colors.icon}
                onPress={() => setShowModal(true)}
              /> */}
              <Pressable
                onPress={() => {
                  const result = downloadSong(
                    activeTrack.url,
                    activeTrack.title + ".mp3"
                  );
                  if (result !== null) {
                    Alert.alert("Tải thành công", "Nhạc đã được tải về.");
                  }
                }}
              >
                <Icon as={CircleArrowDown} size="xxl" color="white" />
              </Pressable>

              <HStack space="xl">
                <Pressable
                  onPress={() => {
                    setShowModal(true);
                  }}
                >
                  <Icon as={Share2} size="xxl" color="white" />
                </Pressable>
                <ShareModal
                  isVisible={showModal}
                  onClose={() => setShowModal(false)}
                  title={activeTrack.title ?? ""}
                  artist={activeTrack.artist ?? ""}
                  url={activeTrack.url ?? ""}
                  image={activeTrack.artwork}
                />
                <Pressable
                  onPress={() => {
                    setShowKaraoke(true);
                    <KaraokeMode lyricText={lyricText} />;
                  }}
                >
                  <Icon as={LetterText} size="xxl" color="white" />
                </Pressable>
              </HStack>
              {/* <AntDesign
                name="download"
                size={30}
                color="white"
                onPress={() => {
                  const result = downloadSong(
                    activeTrack.url,
                    activeTrack.title + ".mp3"
                  );
                  if (result !== null) {
                    Alert.alert("Tải thành công", "Nhạc đã được tải về.");
                  }
                }}
              /> */}
            </HStack>
          </VStack>
        </VStack>
      </Box>
      <TrackBottomSheet
        bottomSheetRef={bottomSheetRef}
        selectedItem={selectedItem}
        handleDismissModalPress={handleDismissModalPress}
        handlePresentModalPress={handlePresentModalPress}
      />
    </LinearGradient>
  );
};

const DismissPlayerSymbol = () => {
  const { top } = useSafeAreaInsets();

  return (
    <Box
      className="absolute left-0 right-0 flex-row justify-center"
      style={{ top: top + 20 }}
    >
      <Box className="w-[50px] h-2 rounded-full bg-white opacity-70" />
    </Box>
  );
};

export default PlayerScreen;
