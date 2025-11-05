import { MyTrack } from "@/types/zing.types";
import { downloadSong } from "../DowloadMusic";
import { Alert } from "react-native";
import React from "react";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { CircleArrowDown } from "lucide-react-native";

interface BS_AddToFavoriteProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
}

export const BS_Download = ({
  selectedItem,
  handleDismissModalPress,
}: BS_AddToFavoriteProps) => {
  const handleDownloadPress = () => {
    if (!selectedItem) return;

    const result = downloadSong(
      selectedItem?.url ?? "",
      selectedItem?.title ?? "" + ".mp3"
    );
    if (result !== null) {
      Alert.alert("Tải thành công", "Nhạc đã được tải về.");
    }
    handleDismissModalPress();
  };

  return (
    <ButtonBottomSheet
      onPress={handleDownloadPress}
      buttonIcon={CircleArrowDown}
      buttonText="Tải xuống"
    />
  );
};
