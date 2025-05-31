import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { VStack, Text } from "@/components/ui";

const genres = [
  { id: "1", title: "Ballad" },
  { id: "2", title: "EDM" },
  { id: "3", title: "Rap/HipHop" },
  { id: "4", title: "Pop" },
  { id: "5", title: "Rock" },
];

const CategoryGenre = () => {
  return (
    <VStack space="md" className="p-4">
      <Text className="text-2xl font-bold mb-2">Chủ đề & Thể loại</Text>
      <FlatList
        data={genres}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4 bg-green-100 p-4 rounded-lg">
            <Text className="font-medium">{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </VStack>
  );
};

export default CategoryGenre;
