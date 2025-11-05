import { useEffect, useRef } from "react";
import TrackPlayer, {
  Capability,
  RatingType,
  RepeatMode,
  State,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

const setupPlayer = async () => {
  const currentState = await TrackPlayer.getState().catch(() => null);

  if (currentState !== null && currentState !== State.None) {
    return;
  }

  await TrackPlayer.setupPlayer({
    maxCacheSize: 1024 * 10,
  });

  await TrackPlayer.updateOptions({
    ratingType: RatingType.Heart,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
  });

  await TrackPlayer.setVolume(0.3);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
};

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    setupPlayer()
      .then(() => {
        isInitialized.current = true;
        onLoad?.();
      })
      .catch((error) => {
        isInitialized.current = false;
        console.log(error);
      });
  }, [onLoad]);
};
