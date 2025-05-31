import { colors } from "../constants/tokens";
import { FontAwesome6 } from "@expo/vector-icons";
import { ViewStyle } from "react-native";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";
import { VStack, HStack, Pressable } from "@/components/ui";

type PlayerControlsProps = {
  style?: ViewStyle;
  iconSize?: number;
};

type PlayerButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export const PlayerControls = ({
  style,
  iconSize = 30,
}: PlayerControlsProps) => {
  return (
    <VStack space="lg" className="items-center " style={style}>
      <HStack className="items-center justify-between w-full px-6">
        <SkipToPreviousButton />
        <PlayPauseButton iconSize={iconSize} />
        <SkipToNextButton />
      </HStack>
    </VStack>
  );
};

export const PlayPauseButton = ({ iconSize = 48 }: PlayerButtonProps) => {
  const { playing } = useIsPlaying();
  TrackPlayer.getState().then((state) => {
    console.log("🎧 Player state:", state);
  });
  return (
    <Pressable
      className="flex-1 items-center"
      onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
    >
      <FontAwesome6
        name={playing ? "pause" : "play"}
        size={iconSize}
        color={colors.text}
      />
    </Pressable>
  );
};

export const SkipToNextButton = ({ iconSize = 30 }: PlayerButtonProps) => {
  return (
    <Pressable
      className="flex-1 items-center"
      onPress={() => TrackPlayer.skipToNext()}
    >
      <FontAwesome6 name="forward" size={iconSize} color={colors.text} />
    </Pressable>
  );
};

export const SkipToPreviousButton = ({ iconSize = 30 }: PlayerButtonProps) => {
  return (
    <Pressable
      className="flex-1 items-center"
      onPress={() => TrackPlayer.skipToPrevious()}
    >
      <FontAwesome6 name="backward" size={iconSize} color={colors.text} />
    </Pressable>
  );
};
