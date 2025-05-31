import React from "react";
import { Pressable, View } from "react-native";
import { Box, HStack, Icon, Text, VStack } from "@/components/ui";
import { Music, MoreVertical } from "lucide-react-native";
import { UploadSong } from "@/lib/api/upload_songs.api";
import { format } from "date-fns";

type UploadedSongCardProps = {
  song: UploadSong;
  onPress?: (song: UploadSong) => void;
  onOptionsPress?: (song: UploadSong) => void;
};

export const UploadedSongCard: React.FC<UploadedSongCardProps> = ({
  song,
  onPress,
  onOptionsPress,
}) => {
  // Format upload date
  const formattedDate = song.upload_at
    ? format(new Date(song.upload_at), "dd/MM/yyyy")
    : "Unknown date";

  return (
    <Pressable
      onPress={() => onPress?.(song)}
      className="flex-row items-center p-3 bg-background-50 rounded-lg mb-2"
    >
      <Box className="w-12 h-12 rounded-md bg-primary-100 items-center justify-center mr-3">
        <Icon as={Music} size="md" className="text-primary-500" />
      </Box>

      <VStack className="flex-1">
        <Text numberOfLines={1} className="text-base font-medium">
          {song.title}
        </Text>
        <Text className="text-sm text-secondary-400">
          Uploaded on {formattedDate}
        </Text>
      </VStack>

      <Pressable
        onPress={() => onOptionsPress?.(song)}
        className="w-10 h-10 items-center justify-center"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon as={MoreVertical} size="sm" className="text-secondary-400" />
      </Pressable>
    </Pressable>
  );
};
