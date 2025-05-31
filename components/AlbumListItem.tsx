import { MyTrack } from "@/types/zing.types";
import { Link } from "expo-router";
import { VStack, Image, Text } from "./ui";

export const AlbumListItem = ({ item }: { item: MyTrack }) => {
  return (
    <Link
      href={{
        pathname: `${
          item.datatype === "playlist" ? "/playlists" : "/albums"
        }/[id]`,
        params: item,
      }}
    >
      <VStack className="w-40">
        <Image
          source={{ uri: item.artwork }}
          alt={item.title}
          className="w-40 h-40 rounded-lg"
        />
        <Text
          className="text-md font-semibold text-primary-500"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text className="text-gray-400">{item.sortDescription}</Text>
      </VStack>
    </Link>
  );
};
