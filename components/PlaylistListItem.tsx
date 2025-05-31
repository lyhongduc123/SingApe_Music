import { Playlist } from "@/helpers/types";

// Gluestack UI
import { Box, Text, Pressable, Image, HStack, VStack } from "@/components/ui";

type PlaylistListItemProps = {
  playlist: Playlist;
  onPress?: () => void;
};

export const PlaylistListItem = ({
  playlist,
  onPress,
}: PlaylistListItemProps) => {
  return (
    <Pressable onPress={onPress}>
      <Box className="h-20">
        <HStack className="w-full h-full items-center justify-start gap-4">
          <Image
            source={{ uri: playlist.artworkPreview }}
            alt="Playlist Image"
            className="w-16 h-16 rounded-md"
          />
          <VStack className="flex-1 h-full justify-center gap-1">
            <Text className="text-base font-semibold">{playlist.name}</Text>
            <Text className="text-sm text-gray-500">
              Playlist ✦ {playlist.createdBy ?? "Unknown"}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};
