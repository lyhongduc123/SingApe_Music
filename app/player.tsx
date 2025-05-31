import { MovingText } from "../components/MovingText";
import { PlayerControls } from "../components/PlayerControls";
import { PlayerProgressBar } from "../components/PlayerProgressbar";
import { PlayerRepeatToggle } from "../components/PlayerRepeatToggle";
import { unknownTrackImageSource } from "@/constants/image";
import { colors, fontSize } from "@/constants/tokens";
import { usePlayerBackground } from "@/hooks/usePlayerBackground";
import { useTrackPlayerFavorite } from "@/hooks/useTrackPlayerFavorite";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";
import { Box, VStack, HStack, Text, Spinner, Center } from "@/components/ui";
import { Alert, Image, Pressable, View } from "react-native";
import { PlayerShuffleToggle } from "@/components/PlayerShuffleToggle";
import { PlayerShareButton } from "@/components/PlayerShareButton";
import { router } from "expo-router";
import { AddToPlaylistButton } from "@/components/AddToPlaylistButton";
import AudioQualitySwitcher from "@/components/AudioQualitySelector";
import { downloadSong } from "@/components/DowloadMusic";
import { KaraokeMode } from "@/components/KaraokeMode";
import { useState } from "react";

const PlayerScreen = () => {
  const [showKaraoke, setShowKaraoke] = useState(false);

  const activeTrack = useActiveTrack();
  console.log("Active Track:", activeTrack);

  const { imageColors } = usePlayerBackground(
    activeTrack?.artwork ?? unknownTrackImageSource
  );

  const { top, bottom } = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useTrackPlayerFavorite();

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
        <KaraokeMode />
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
      <Box
        className="flex-1 px-5"
        style={{ paddingTop: top + 60, paddingBottom: bottom }}
      >
        <Box
          className="absolute left-0 top-0 z-10 flex-row items-center"
          style={{ paddingTop: top + 10 }}
        >
          <Feather
            name="chevron-down"
            size={28}
            color="white"
            onPress={() => router.back()}
            style={{ marginLeft: 15 }}
          />
        </Box>
        <DismissPlayerSymbol />

        <Center className="h-[45%]">
          <Image
            source={{ uri: activeTrack.artwork ?? unknownTrackImageSource }}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            resizeMode="cover"
          />
        </Center>

        <VStack className="flex-1 mt-10">
          <VStack>
            <VStack className="h-[70px]">
              <HStack className="justify-between items-center">
                <PlayerShareButton
                  title={activeTrack.title}
                  artist={activeTrack.artist}
                  image={activeTrack.artwork}
                  url={activeTrack.url}
                />
                <Center className="flex-1 overflow-hidden">
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
                </Center>
                <FontAwesome
                  name={isFavorite ? "heart" : "heart-o"}
                  size={20}
                  color={isFavorite ? colors.primary : colors.icon}
                  style={{ marginHorizontal: 14 }}
                  onPress={toggleFavorite}
                />
              </HStack>
            </VStack>
            <PlayerProgressBar style={{ marginTop: 20 }} />
            <HStack className="items-center justify-center px-12 py-6">
              <PlayerShuffleToggle size={30} style={{ paddingTop: 10 }} />
              <PlayerControls style={{ marginTop: 10 }} iconSize={48} />
              <PlayerRepeatToggle size={30} style={{ paddingTop: 10 }} />
            </HStack>

            <HStack space="4xl" className="items-center justify-center">
              <AddToPlaylistButton track={activeTrack}></AddToPlaylistButton>
              <AudioQualitySwitcher
                qualities={[
                  {
                    label: "128Kps",
                    url: "https://example.com/audio/low-quality.mp3",
                  },
                ]}
              ></AudioQualitySwitcher>
              <MaterialIcons
                name="mic"
                size={30}
                color="white"
                onPress={() => setShowKaraoke(true)}
              />
              <AntDesign
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
              />
            </HStack>
          </VStack>
        </VStack>
      </Box>
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
