import { UserRoundCheck } from "lucide-react-native";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { router } from "expo-router";
import { MyTrack } from "@/types/zing.types";

interface BS_MoveToArtistProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
}

export const BS_MoveToArtist = ({
  selectedItem,
  handleDismissModalPress,
}: BS_MoveToArtistProps
) => {
  const handleArtistPress = async () => {
    console.log("HERE");
    if (selectedItem) {
      handleDismissModalPress();
      console.log("artistId", selectedItem);
      router.navigate({
        pathname: `/(app)/(tabs)/(songs)/artists/[id]`,
        params: {
          id: selectedItem?.artists[0].alias ?? selectedItem?.artist ?? "",
        },
      });
    }
  };
  return (
    <ButtonBottomSheet
      onPress={handleArtistPress}
      buttonIcon={UserRoundCheck}
      buttonText="Chuyển đến nghệ sĩ"
    />
  );
};