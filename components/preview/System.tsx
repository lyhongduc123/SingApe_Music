// components/theme/SystemBox.tsx
import React from "react";
import { View, Text } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { Box, HStack, VStack } from "../ui";

export const SystemBox = () => {
  return (
    <VStack
      className="border rounded-t-xl w-full"
      style={{ borderColor: "#333" }}
    >
      <VStack space="md" className="bg-white rounded-t-xl px-2 pt-2 pb-1">
        <Box className="h-6 w-20 bg-gray-200 rounded-md" />
        <HStack space="sm">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-5 bg-gray-300" />
          ))}
        </HStack>
      </VStack>

      <VStack
        space="sm"
        className="px-2 pb-2 pt-1"
        style={{ backgroundColor: "#272625" }}
      >
        {[...Array(2)].map((_, i) => (
          <HStack key={i} space="sm" className="items-center">
            <Skeleton className="h-5 w-5 rounded-md bg-gray-300" />
            <VStack space="xs" className="flex-1">
              <Box className="h-3 w-3/5 bg-gray-200 rounded-md" />
              <Box className="h-2 w-2/5 bg-gray-200 rounded-md" />
            </VStack>
            <Box className="h-3 w-3 bg-gray-300 rounded-full" />
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};
