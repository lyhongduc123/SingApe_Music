// components/ShareModal.tsx
import { Modal, Pressable, HStack, VStack, Text, Image } from "@/components/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalBackdrop, ModalContent } from "./ui/modal";
import { colors } from "@/constants/tokens";
import { shareSong } from "./shareSong";

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  artist: string;
  url: string;
  image?: string;
}

export const ShareModal = ({
  isVisible,
  onClose,
  title,
  artist,
  url,
  image,
}: ShareModalProps) => {
  const handleFacebookShare = () => {
    shareSong({ title, artist, url, image, method: "facebook" });
    onClose();
  };

  const handleNativeShare = () => {
    shareSong({ title, artist, url, image, method: "native" });
    onClose();
  };

  return (
    <Modal
      isOpen={isVisible}
      onClose={onClose}
      closeOnOverlayClick
      className="flex-col justify-end"
    >
      <ModalBackdrop />
      <ModalContent className="w-full p-0 m-0 bg-black dark:bg-neutral-900 rounded-t-2xl shadow-2xl">
        <VStack className="p-5 pb-8">
          <HStack className="border-b border-white pb-6">
            {image && (
              <Image
                source={{ uri: image }}
                alt="cover"
                className="w-12 h-12 rounded-xl shadow"
              />
            )}
            <VStack className="pl-5">
              <Text className="text-lg font-semibold text-white">{title}</Text>
              <Text className="text-lg text-white">{artist}</Text>
            </VStack>
          </HStack>

          <VStack>
            <Text className="text-lg text-white py-2">Chia sẻ lên:</Text>
            <HStack space="xl">
              <Pressable
                onPress={handleFacebookShare}
                className="bg-[#4267B2] p-3 rounded-full"
              >
                <MaterialCommunityIcons
                  name="facebook"
                  size={24}
                  color="white"
                />
              </Pressable>

              <Pressable
                onPress={handleNativeShare}
                className="bg-gray-800 p-3 rounded-full"
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="white"
                />
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
