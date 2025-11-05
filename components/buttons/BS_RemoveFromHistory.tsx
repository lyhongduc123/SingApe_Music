import { useLibraryStore } from "@/store/mylib";
import { MyTrack } from "@/types/zing.types";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { Trash } from "lucide-react-native";
import { deleteListeningHistory } from "@/services/cacheService";

interface BS_RemoveFromHistoryProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
}

export const BS_RemoveFromHistory = ({
  selectedItem,
  handleDismissModalPress,
}: BS_RemoveFromHistoryProps) => {
  const removeTrackFromHistory = useLibraryStore(
    (state) => state.removeTrackFromHistory
  );

  const handleRemoveFromHistory = async () => {
    if (selectedItem) {
      handleDismissModalPress();
      removeTrackFromHistory(selectedItem.id);
      await deleteListeningHistory(selectedItem.id);
    }
  };

  return (
    <ButtonBottomSheet
      onPress={handleRemoveFromHistory}
      buttonIcon={Trash}
      buttonText="Xóa khỏi lịch sử"
    />
  );
};
