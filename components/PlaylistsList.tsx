import { PlaylistListItem } from "@/components/PlaylistListItem";
import { unknownTrackImageSource } from "@/constants/image";
import { playlistNameFilter } from "@/helpers/filter";
import { Playlist } from "@/helpers/types";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { useMemo } from "react";

// Gluestack UI components
import { Box, Text, Image } from "@/components/ui";
import { FlatList, FlatListProps } from "react-native";

type PlaylistsListProps = {
  playlists: Playlist[];
  onPlaylistPress: (playlist: Playlist) => void;
} & Partial<FlatListProps<Playlist>>;

const ItemDivider = () => <Box className="ml-80 my-2" />;

export const PlaylistsList = ({
  playlists,
  onPlaylistPress: handlePlaylistPress,
  ...flatListProps
}: PlaylistsListProps) => {
  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: "Find in playlist",
    },
  });

  const filteredPlaylist = useMemo(() => {
    return playlists.filter(playlistNameFilter(search));
  }, [playlists, search]);

  return (
    <FlatList
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
      ItemSeparatorComponent={ItemDivider}
      ListFooterComponent={ItemDivider}
      ListEmptyComponent={
        <Box className="item-center justify-center">
          <Text>No playlist found</Text>
          <Image
            alt={`Thumbnail for`}
            source={{
              uri: unknownTrackImageSource,
            }}
          />
        </Box>
      }
      data={filteredPlaylist}
      renderItem={({ item: playlist }) => (
        <PlaylistListItem
          playlist={playlist}
          onPress={() => handlePlaylistPress(playlist)}
        />
      )}
      {...flatListProps}
    />
  );
};
