import { MyTrack } from "@/types/zing.types";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { VStack, Image, Text } from "./ui";
import { AlbumListItem } from "./AlbumListItem";

interface AlbumListProps {
  horizontal?: boolean;
  data: MyTrack[];
}

export const AlbumList = ({ horizontal, data, ...props }: AlbumListProps) => {
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
      renderItem={({ item }) => <AlbumListItem item={item} />}
      {...props}
    />
  );
};

