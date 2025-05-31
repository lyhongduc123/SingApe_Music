import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { VStack, Text, Image } from "@/components/ui";

const chillPlaylists = [
  {
    id: "1",
    title: "Chill Music",
    artwork:
      "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
  },
  {
    id: "2",
    title: "Relax Vibes",
    artwork:
      "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
  },
  {
    id: "3",
    title: "Late Night Chill",
    artwork:
      "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
  },
  {
    id: "4",
    title: "Acoustic Chill",
    artwork:
      "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
  },
  {
    id: "5",
    title: "Morning Chill",
    artwork:
      "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
  },
];

const Chill = () => {
  return (
    <VStack space="md" className="p-4">
      <Text className="text-2xl font-bold mb-2">Chill</Text>
      <FlatList
        data={chillPlaylists}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4 items-center justify-center">
            <Image
              source={{ uri: item.artwork }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                marginBottom: 8,
              }}
              alt="art"
            />
            <Text className="font-medium pt-4">{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </VStack>
  );
};

export default Chill;
