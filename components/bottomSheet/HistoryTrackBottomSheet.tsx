import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import {
  CircleArrowDown,
  CirclePlus,
  Heart,
  Share2,
  Trash,
  UserRoundCheck,
} from "lucide-react-native";
import {
  Button,
  HStack,
  Pressable,
  Text,
  Image,
  VStack,
  Box,
} from "@/components/ui";
import { MyBottomSheet } from "./MyBottomSheet";
import { MyTrack } from "@/types/zing.types";
import ButtonBottomSheet from "./ButtonBottomSheet";
import { unknownTrackImageSource } from "@/constants/image";
import { Divider } from "../ui/divider";
import { downloadSong } from "../DowloadMusic";
import { Alert } from "react-native";
import { useCallback, useRef, useState } from "react";
import { useFavoriteStore } from "@/store/mylib";
import {
  addSongToFavorite,
  removeSongFromFavorite,
} from "@/services/cacheService";
import { BS_MoveToArtist } from "../buttons/BS_MoveToArtist";
import { BS_AddToPlaylist } from "../buttons/BS_AddToPlaylist";
import { BS_AddToFavorite } from "../buttons/BS_AddToFavorite";
import { BS_Download } from "../buttons/BS_Download";
import { BS_Share } from "../buttons/BS_Share";
import { BS_RemoveFromHistory } from "../buttons/BS_RemoveFromHistory";

interface HistoryTrackBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
  handlePresentModalPress: () => void;
  // isFavorite: boolean;
}

export const HistoryTrackBottomSheet = ({
  bottomSheetRef,
  selectedItem,
  handleDismissModalPress,
  handlePresentModalPress,
}: HistoryTrackBottomSheetProps) => {
  return (
    <MyBottomSheet bottomSheetRef={bottomSheetRef}>
      <HStack space="md">
        <Image
          source={
            selectedItem?.artwork
              ? { uri: selectedItem.artwork }
              : unknownTrackImageSource
          }
          className="rounded"
          size="sm"
          alt="track artwork"
        />
        <VStack className="flex-1 pl-2">
          <Text className="text-xl font-medium text-primary-500">
            {selectedItem?.title}
          </Text>
          <Text className="text-md text-gray-500">{selectedItem?.artist}</Text>
        </VStack>
      </HStack>
      <Box className="w-full my-4">
        <Divider />
      </Box>
      <VStack space="md" className="w-full">
        <BS_AddToPlaylist
          selectedItem={selectedItem}
          handleDismissModalPress={handleDismissModalPress}
        />
        <BS_AddToFavorite
          selectedItem={selectedItem}
          handleDismissModalPress={handleDismissModalPress}
        />
        <BS_Download
          selectedItem={selectedItem}
          handleDismissModalPress={handleDismissModalPress}
        />
        <BS_RemoveFromHistory
          selectedItem={selectedItem}
          handleDismissModalPress={handleDismissModalPress}
        />
        <BS_MoveToArtist
          selectedItem={selectedItem}
          handleDismissModalPress={handleDismissModalPress}
        />
        <BS_Share
          selectedItem={selectedItem}
          handleDismissModalPress={handleDismissModalPress}
        />
      </VStack>
    </MyBottomSheet>
  );
};
