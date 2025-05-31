import { Artist, MyTrack } from "@/types/zing.types";
import { Link } from "expo-router";
import { VStack, Image, Text } from "./ui";

export const ArtistListItem = ({ item }: { item: Artist }) => {
  return (
    <Link
      href={{
        pathname: `/artists/[id]`,
        params: { id: item.alias },
      }}
    >
      <VStack className="w-32">
        <Image
          source={{ uri: item.thumbnailM }}
          alt={item.name}
          className="w-32 h-32 rounded-full"
        />
        <Text
          className="text-md font-semibold text-primary-500 text-center"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </VStack>
    </Link>
  );
};
