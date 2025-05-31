import React, { useState } from "react";
import { Text } from "react-native";
import { HStack, Input } from "@/components/ui";
import { InputField } from "@/components/ui/input";
import { Feather } from "@expo/vector-icons";
import { SearchBar } from "@/components/home/SearchBar";
import { router } from "expo-router";

const HeaderHome = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log("Search:", text);
  };

  return (
    <>
      <HStack className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold">Khám phá</Text>
        <HStack className="flex-row space-x-2">
          <Feather
            name="mic"
            size={24}
            color="black"
            onPress={() => {
              router.push("/voice");
            }}
            onFocus={() => {}}
          />
          <Feather
            name="search"
            size={24}
            color="black"
            onPress={() => {
              router.push("/search");
            }}
            onFocus={() => {}}
          />
        </HStack>
      </HStack>

      {isSearchVisible && (
        <Input variant="rounded" size="md">
          <InputField
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search on here..."
          />
        </Input>
      )}
    </>
  );
};

export default HeaderHome;
