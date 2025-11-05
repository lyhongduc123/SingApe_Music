import { Artist } from "@/types/zing.types";
import { FlatList, View } from "react-native";
import { ArtistListItem } from "./ArtistListItem";

interface ArtistProps extends Partial<FlatList<Artist>> {
  horizontal?: boolean;
  data: Artist[];
}

export const ArtistList = ({ horizontal, data, ...props }: ArtistProps) => {
  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View className="w-4" />}
      ListHeaderComponent={<View className="w-4" />}
      ItemSeparatorComponent={() => <View className="w-4" />}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ArtistListItem item={item} />}
      {...props}
    />
  );
};