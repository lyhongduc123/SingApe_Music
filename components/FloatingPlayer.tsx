import {
  SkipToPreviousButton,
  PlayerControls,
  PlayPauseButton,
  SkipToNextButton,
} from "@/components/PlayerControls";
import { unknownTrackImageSource } from "../constants/image";
import { useLastActiveTrack } from "@/hooks/useLastActiveTrack";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui";
import { View, TouchableOpacity, ViewProps } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import { MovingText } from "@/components/MovingText";
import { HStack, Image, Pressable, VStack } from "@/components/ui";
import { backgroundColor, colors } from "@/constants/tokens";
import { Marquee } from "@animatereactnative/marquee";
import usePlayerBackground from "@/hooks/usePlayerBackground";
import { LinearGradient } from "expo-linear-gradient";
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedSensor,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useFloatingPlayerVisible } from "@/hooks/useFloatingPlayerVisible";

export const FloatingPlayer = ({ style }: ViewProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [speed, setSpeed] = useState(0.2);

  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;

  useEffect(() => {
    setMeasured(!measured);
  }, [displayedTrack, textWidth]);

  const marqueePosition = useSharedValue(0);
  const router = useRouter();

  const { imageColors } = usePlayerBackground(
    displayedTrack?.artwork ?? unknownTrackImageSource
  );

  const handlePress = () => {
    router.navigate("/player");
  };

  if (!displayedTrack) {
    console.log("No track is currently playing or active.");
    return null;
  }

  const renderTitle = () => {
    if (measured && textWidth > containerWidth) {
      return (
        <Marquee
          spacing={50}
          speed={speed}
          style={{ width: "100%" }}
          position={marqueePosition}
        >
          <Text
            numberOfLines={1}
            className="text-white font-semibold text-base"
          >
            {displayedTrack.title}
          </Text>
        </Marquee>
      );
    } else {
      return (
        <Text numberOfLines={1} className="text-white font-semibold text-base">
          {displayedTrack.title}
        </Text>
      );
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 40,
        left: 10,
        right: 10,
        zIndex: 9999,
        paddingVertical: 10,
        borderRadius: 10,
      }}
    >
      <Pressable
        onPress={handlePress}
        className="flex-row items-center  rounded-xl"
        style={{
          backgroundColor: imageColors
            ? imageColors.primary
            : colors.background,
        }}
      >
        <HStack space="lg" className="flex-1 items-center z-50">
          <Image
            source={
              typeof displayedTrack.artwork === "string"
                ? { uri: displayedTrack.artwork }
                : unknownTrackImageSource
            }
            className="w-16 h-16 rounded-lg m-2"
            alt={displayedTrack?.title || "Track Artwork"}
          />
          {/* <MovingText
            text={displayedTrack.title ?? ""}
            animationThreshold={25}
            style={{
              color: colors.text,
              flex: 1,
              fontSize: 15,
              fontWeight: "600",
              overflow: "hidden",
            }}
          /> */}
          <Text
            className="text-white font-semibold text-base absolute opacity-0"
            onLayout={(e) => {
              setTextWidth(e.nativeEvent.layout.width);
            }}
          >
            {displayedTrack.title ?? ""}
          </Text>
          <VStack
            className="flex-1 overflow-hidden w-full"
            onLayout={(e) => {
              setContainerWidth(e.nativeEvent.layout.width);
              setMeasured(true);
            }}
          >
            <LinearGradient
              colors={[
                imageColors?.primary || colors.background,
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 10,
                zIndex: 10,
              }}
            />
            <View className="ml-2 w-full">
              {renderTitle()}
              <Text numberOfLines={1} className="text-gray-400">
                {displayedTrack.artist}
              </Text>
            </View>

            <LinearGradient
              colors={[
                "transparent",
                imageColors?.primary || colors.background,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 10,
                zIndex: 10,
              }}
            />
          </VStack>
          <HStack className="items-center flex-1 px-30">
            <SkipToPreviousButton iconSize={22} />
            <PlayPauseButton iconSize={28} />
            <SkipToNextButton iconSize={22} />
          </HStack>
        </HStack>
      </Pressable>
    </View>
  );
};
