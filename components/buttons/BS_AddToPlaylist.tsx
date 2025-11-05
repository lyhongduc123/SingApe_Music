import { MyTrack } from "@/types/zing.types";
import { router } from "expo-router";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { CirclePlus } from "lucide-react-native";

interface BS_AddToPlaylistProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
}

export const BS_AddToPlaylist = ({
  selectedItem,
  handleDismissModalPress,
}: BS_AddToPlaylistProps) => {
  const handleAddToPlaylistPress = async () => {
    if (selectedItem) {
      handleDismissModalPress();
      router.push({
        pathname: "/addToPlaylist",
        params: selectedItem,
      });
    }
  };

  return (
    <ButtonBottomSheet
      onPress={handleAddToPlaylistPress}
      buttonIcon={CirclePlus}
      buttonText="Thêm vào danh sách phát"
    />
  );
};
