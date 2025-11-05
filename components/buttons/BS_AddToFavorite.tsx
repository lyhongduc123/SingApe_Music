import { useDebouncedCallback } from "@/hooks/useDebounceCallback";
import {
  addSongToFavorite,
  removeSongFromFavorite,
} from "@/services/cacheService";
import { useFavoriteStore } from "@/store/mylib";
import { MyTrack } from "@/types/zing.types";
import { useState } from "react";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { Heart } from "lucide-react-native";

interface BS_AddToFavoriteProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
}

export const BS_AddToFavorite = ({
  selectedItem,
  handleDismissModalPress,
}: BS_AddToFavoriteProps) => {
  const favouriteStore = useFavoriteStore();
  const isFavorite = selectedItem
    ? favouriteStore.isTrackFavorite(selectedItem.id)
    : false;

  const handleFavoritePress = () => {
    if (!selectedItem) return;

    if (isFavorite) {
      favouriteStore.removeTrackFromFavorites(selectedItem.id);
      debounceUnfavorite(selectedItem); // call debounced remove
    } else {
      favouriteStore.addTrackToFavorites(selectedItem);
      debounceFavorite(selectedItem); // call debounced add
    }
  };

  const debounceFavorite = useDebouncedCallback(async (item) => {
    await addSongToFavorite(item);
  }, 2000);

  const debounceUnfavorite = useDebouncedCallback(async (item) => {
    await removeSongFromFavorite(item);
  }, 2000);

  return (
    <ButtonBottomSheet
      onPress={handleFavoritePress}
      stateChangable={true}
      fillIcon={isFavorite}
      buttonIcon={Heart}
      buttonText={isFavorite ? "Đã thích" : "Thêm vào yêu thích"}
    />
  );
};
