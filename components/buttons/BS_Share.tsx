import { MyTrack } from "@/types/zing.types";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { Share2 } from "lucide-react-native";
import { View } from "react-native";
import { ShareModal } from "../ShareModal";
import { useState } from "react";

interface BS_ShareProps {
  selectedItem: MyTrack | null;
  handleDismissModalPress: () => void;
}

export const BS_Share = ({
  selectedItem,
  handleDismissModalPress,
}: BS_ShareProps) => {
  const [showModal, setShowModal] = useState(false);
  // Placeholder for share functionality
  const handleSharePress = () => {
    if (selectedItem) {
      // Implement share logic here
      console.log(`Sharing track: ${selectedItem.title}`);
      setShowModal(true);
      // handleDismissModalPress();
    }
  };

  return (
    <View>
      <ButtonBottomSheet
        onPress={handleSharePress}
        buttonIcon={Share2}
        buttonText="Chia sẻ"
      />
      <ShareModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title={selectedItem?.title ?? ""}
        artist={selectedItem?.artist ?? ""}
        url={selectedItem?.url ?? ""}
        image={selectedItem?.artwork}
      />
    </View>
  );
};
