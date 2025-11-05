import { saveListeningHistory } from "@/services/cacheService";
import { useTrackPlayerEvents, Event } from "react-native-track-player";

export function useTrackHistoryLogger() {
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.track) {
      await saveListeningHistory(event.track);
    }
  });
}
