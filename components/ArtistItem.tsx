import { Artist } from "@/types/zing.types";
import { router } from "expo-router";
import { HStack, Image, Pressable, VStack, Text, Button } from "./ui";
import { ButtonText } from "./ui/button";
import { formatNumber } from "@/helpers/format";

interface ArtistItemProps {
  item: Artist;
  onPress?: (artist: Artist) => void;
}

export const ArtistItem = ({ item, onPress }: ArtistItemProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.navigate({
        pathname: "/artists/[id]",
        params: { id: item.alias },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <HStack space="lg" className="px-2 items-center">
        <Image source={item.thumbnailM} className="rounded-full" size="sm" />
        <HStack space="md" className="flex-1 items-center justify-between">
          <VStack>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {formatNumber(item.totalFollow)} người theo dõi
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Pressable>
  );
};
