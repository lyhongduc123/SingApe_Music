import { useEffect, useState } from 'react';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';

export function usePlayback() {
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(playbackState.state === State.Playing);
  }, [playbackState]);

  return { isPlaying, togglePlayPause: () => TrackPlayer.play() };
}