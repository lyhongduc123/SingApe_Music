import { Box, Text } from "@/components/ui";
import { colors, fontSize } from "@/constants/tokens";
import { formatSecondsToMinutes } from "../helpers/miscellaneous";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import TrackPlayer, { useProgress } from "react-native-track-player";
import clsx from "clsx";
import { StyleProp, ViewStyle } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useState } from "react";

interface PlayerProgressBarProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const PlayerProgressBar = ({
  className,
  style,
}: PlayerProgressBarProps) => {
  const { duration, position } = useProgress(250);
  const [remainTimeMode, setRemainTimeMode] = useState(false);

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const trackElapsedTime = formatSecondsToMinutes(position);
  const trackRemainingTime = formatSecondsToMinutes(duration - position);
  const trackDuration = formatSecondsToMinutes(duration);

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0;
  }

  return (
    <Box className={className} style={style}>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        containerStyle={{ width: "100%" }}
        thumbWidth={10}
        renderBubble={() => null}
        theme={{
          minimumTrackTintColor: colors.minimumTrackTintColor,
          maximumTrackTintColor: colors.maximumTrackTintColor,
        }}
        onSlidingStart={() => (isSliding.value = true)}
        onValueChange={async (value) => {
          await TrackPlayer.seekTo(value * duration);
        }}
        onSlidingComplete={async (value) => {
          if (!isSliding.value) return;
          isSliding.value = false;
          await TrackPlayer.seekTo(value * duration);
        }}
      />

      <Box className="flex-row justify-between items-baseline mt-5">
        <Text className="text-[12px] font-medium opacity-75 text-white tracking-[0.7px]">
          {trackElapsedTime}
        </Text>
        <Pressable onPress={() => setRemainTimeMode(!remainTimeMode)}>
          <Text className="text-[12px] font-medium opacity-75 text-white tracking-[0.7px] ">
            {remainTimeMode ? `- ${trackRemainingTime}` : trackDuration}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};

export default PlayerProgressBar;
