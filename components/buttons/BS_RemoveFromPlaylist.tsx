import { MyTrack } from "@/types/zing.types";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { CirclePlus, CircleX } from "lucide-react-native";
import { useModal } from "@/context/modal";

interface BS_AddToPlaylistProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
  handleRemoveFromPlaylist: (track: MyTrack) => Promise<void>;
}

export const BS_RemoveFromPlaylist = ({
  selectedItem,
  handleDismissModalPress,
  handleRemoveFromPlaylist,
}: BS_AddToPlaylistProps) => {
  const { show } = useModal();

  const handleRemoveFromPlaylistPress = async () => {
    if (selectedItem) {
      try {
        await handleRemoveFromPlaylist(selectedItem);
        handleDismissModalPress();
      } catch (error) {
        show({
          title: "Lỗi",
          message: "Không thể xóa bài hát khỏi danh sách phát.",
          type: "error",
        });
      }
    }
  };

  return (
    <ButtonBottomSheet
      onPress={handleRemoveFromPlaylistPress}
      buttonIcon={CircleX}
      buttonText="Xóa khỏi danh sách phát"
    />
  );
};
