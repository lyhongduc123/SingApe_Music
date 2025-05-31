import { useState } from "react";
import {
  Modal,
  Pressable,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
} from "@/components/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Share from "react-native-share";
import { colors } from "@/constants/tokens";
import { ButtonText } from "./ui/button";
import { Linking, TouchableWithoutFeedback, View } from "react-native";
import { ModalBackdrop, ModalContent } from "./ui/modal";

interface PlayerShareButtonProps {
  title?: string;
  artist?: string;
  url: string;
  image?: string;
  iconSize?: number;
}

export const PlayerShareButton = ({
  title,
  url,
  artist,
  image,
  iconSize = 30,
}: PlayerShareButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const message = `${title} - ${artist}\nNghe ngay tại: ${url}`;

  const handleFacebookShare = () => {
    console.log(url);
    const shareUrl = "https://example.com/duong-dan-can-chia-se"; // URL bài hát
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title + " - " + artist)}`;

    Linking.openURL(facebookShareUrl).catch((err) =>
      console.error("Failed to open Facebook:", err)
    );
    setIsModalOpen(false);
  };

  const handleNativeShare = async () => {
    try {
      await Share.open({
        title: "Chia sẻ bài hát",
        message,
        url,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
    setIsModalOpen(false);
  };

  return (
    <View>
      <Pressable onPress={() => setIsModalOpen(true)}>
        <MaterialCommunityIcons
          name="share"
          size={iconSize}
          color={colors.icon}
        />
      </Pressable>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeOnOverlayClick={true}
        avoidKeyboard
        className="flex-col justify-end"
      >
        <ModalBackdrop className="" />
        <ModalContent
          className="w-full p-0 m-0 bg-black dark:bg-neutral-900 rounded-t-2xl shadow-2xl"
          style={{
            borderWidth: 0,
          }}
        >
          <VStack className="p-5 pb-8  ">
            <HStack className="border-b border-white pb-6">
              {image && (
                <Image
                  source={{ uri: image }}
                  alt="cover"
                  className="w-12 h-12 rounded-xl shadow"
                />
              )}

              <VStack className="pl-5">
                <Text className="text-lg font-semibold text-center text-white dark:text-white">
                  {title}
                </Text>
                <Text className="text-lg text-white">{artist}</Text>
              </VStack>
            </HStack>

            <VStack>
              <Text className="text-lg text-white  py-2">Chia sẻ lên:</Text>

              <HStack space="xl" className="">
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
    </View>
  );
};
