import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Input, VStack } from "../ui";
import { InputField } from "../ui/input";
import { router } from "expo-router";
import { Track } from "react-native-track-player";

interface Props {
  data: Track[];
  onSelect: (track: Track) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({ data, onSelect, placeholder }) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Track[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    const lowerText = text.toLowerCase();
    const results = data.filter((track) => {
      const title = track.title?.toLowerCase() || "";
      const artist = track.artist?.toLowerCase() || "";
      return `${title} ${artist}`.includes(lowerText);
    });
    setFilteredData(results);
  };
  const highlightText = (text: string, query: string) => {
    if (!query) return <Text>{text}</Text>;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return (
      <Text>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Text key={index} style={{ fontWeight: "bold", color: "red" }}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView>
      <VStack className="w-full p-4">
        <HStack space="md" className=" items-center ">
          <AntDesign
            name="arrowleft"
            size={30}
            color="black"
            onPress={() => router.back()}
            style={{
              left: -5,
            }}
          />
          <HStack className="flex-1 items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 ">
            <Feather name="search" size={24} color="#888" />
            <Input
              className=" border-0 flex-1 ml-3 text-base text-black dark:text-white"
              size="sm"
            >
              <InputField
                placeholder={placeholder || "Tìm bài hát, ca sĩ, album..."}
                placeholderTextColor="#aaa"
                value={query}
                onChangeText={handleSearch}
                autoCorrect={false}
                autoFocus={true}
              />
            </Input>
          </HStack>
        </HStack>

        {query.length > 0 && (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) =>
              `${item.title || ""}-${item.artist || ""}
              }-${index}`
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-3 border-b border-gray-200 dark:border-gray-700"
                onPress={() => {
                  onSelect(item);
                  setQuery("");
                  setFilteredData([]);
                }}
              >
                <Text className="text-base text-black dark:text-white">
                  {highlightText(item.title || "", query)}
                </Text>
                <Text className="text-sm text-gray-500">
                  {highlightText(item.artist || "", query)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </VStack>
    </SafeAreaView>
  );
};
