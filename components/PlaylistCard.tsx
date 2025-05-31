import { Box, Button, HStack, Icon, VStack } from "./ui";
import { Pressable } from "./ui/pressable";
import { Image } from "./ui/image";
import { Text } from "./ui/text";
import { MyTrack } from "@/types/zing.types";
import { Link, router } from "expo-router";
import { unknownTrackImageSource } from "@/constants/image";
import { ButtonIcon } from "./ui/button";
import { EllipsisVertical } from "lucide-react-native";
import { useWindowDimensions } from "react-native";
import { star } from "@/constants/text";

export const PlaylistCard = ({ item, type, onOptionPress }: { item: MyTrack, type: string, onOptionPress: () => void }) => {
  return (
    <HStack space="md" className="w-full items-center">
    <Image
      source={ item.artwork || unknownTrackImageSource }
      alt="Playlist Image"
      className="w-16 h-16 rounded-md"
    />
    <HStack className="flex-1 w-full h-full bg-transparent items-center justify-between">
      <VStack className="flex-1 w-full gap-1">
        <Text className="text-lg font-semibold">{item.title}</Text>
        <Text className="text-sm text-gray-500">
          {type} {star} {item.createdBy}
        </Text>
      </VStack>
      {/* <Pressable className="rounded-full w-10 h-10 items-center justify-center"
        onPress={onOptionPress}
      >
        <Icon as={EllipsisVertical} className="text-black fill-black" />
      </Pressable> */}
    </HStack>
  </HStack>
    // </Pressable>
  );
};

