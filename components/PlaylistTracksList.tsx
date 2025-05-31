import { trackTitleFilter } from "@/helpers/filter";
import { generateTracksListId } from "@/services/playbackService";
import { Playlist } from "@/helpers/types";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { TracksList } from "./TrackList";
import { VStack, Text, Image } from "@/components/ui";
import { useMemo, useState } from "react";
import { QueueControls } from "./QueueControls";

export const PlaylistTracksList = ({ playlist }: { playlist: Playlist }) => {
  // const search = useNavigationSearch({
  //   searchBarOptions: {
  //     hideWhenScrolling: true,
  //     placeholder: "",
  //   },
  // });
  const [search, setSearch] = useState("");

  const filteredPlaylistTracks = useMemo(() => {
    return playlist.tracks
      .filter(trackTitleFilter(search))
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.url === value.url)
      );
  }, [playlist.tracks, search]);
  console.log("Filtered Tracks:", filteredPlaylistTracks);

  return (
    <TracksList
      id={generateTracksListId(playlist.name, search)}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      hideQueueControls
      ListHeaderComponentStyle={{ marginBottom: 32 }}
      ListHeaderComponent={
        <VStack className="items-center gap-6">
          <Image
            source={{ uri: playlist.artworkPreview }}
            className="w-[85%] h-72 rounded-xl"
            resizeMode="cover"
            alt="image"
          />

          <Text
            numberOfLines={1}
            className="text-center font-extrabold text-xl"
          >
            {playlist.name}
          </Text>
          {search.length === 0 && (
            <QueueControls
              className="pt-6"
              tracks={playlist.tracks}
              playlist={playlist.name}
            />
          )}
        </VStack>
      }
      tracks={filteredPlaylistTracks}
    />
  );
};
