import React from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { VStack, Text } from "@/components/ui";

const hotAlbums = [
  {
    id: "1",
    title: "Album A",
    artwork: "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",
  },
  {
    id: "2",
    title: "Album B",
    artwork: "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",
  },
  {
    id: "3",
    title: "Album C",
    artwork: "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",
  },
  {
    id: "4",
    title: "Album D",
    artwork: "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",
  },
  {
    id: "5",
    title: "Album E",
    artwork: "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",
  },
];

const HotAlbum = () => {
  return (
    <VStack space="md" className="p-4">
      <Text className="text-2xl font-bold mb-2">Album Hot</Text>
      <FlatList
        data={hotAlbums}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4">
            <Image
              source={{ uri: item.artwork }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                marginBottom: 8,
              }}
            />
            <Text numberOfLines={1} className="font-medium text-center">
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </VStack>
  );
};

export default HotAlbum;
