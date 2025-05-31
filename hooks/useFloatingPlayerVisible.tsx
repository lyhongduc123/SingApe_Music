import { useEffect, useState } from "react";
import TrackPlayer, {
  usePlaybackState,
  State,
  useActiveTrack,
} from "react-native-track-player";
import { useLastActiveTrack } from "./useLastActiveTrack";

export function useFloatingPlayerVisible() {
  const [visible, setVisible] = useState(false);
  const activeTrack = useActiveTrack();

  useEffect(() => {
    if (activeTrack) setVisible(true);
    else setVisible(false);
  }, [activeTrack]);

  return { visible };
}
