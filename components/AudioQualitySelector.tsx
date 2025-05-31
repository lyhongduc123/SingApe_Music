import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, VStack } from "@gluestack-ui/themed";
import TrackPlayer from "react-native-track-player";

interface QualityOption {
  label: string;
  url: string;
}

interface Props {
  qualities: QualityOption[];
}

const AudioQualitySwitcher: React.FC<Props> = ({ qualities }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePress = async () => {
    const nextIndex = (currentIndex + 1) % qualities.length;
    const nextQuality = qualities[nextIndex];

    try {
      //   await TrackPlayer.stop();
      //   await TrackPlayer.reset();
      //   await TrackPlayer.add({
      //     id: "track-id",
      //     url: nextQuality.url,
      //     title: "Bài hát",
      //     artist: "Ca sĩ",
      //   });
      //   await TrackPlayer.play();
      setCurrentIndex(nextIndex);
    } catch (error) {
      console.error("Lỗi khi đổi chất lượng:", error);
    }
  };

  const currentQuality = qualities[currentIndex];

  return (
    <VStack className="p-4">
      <TouchableOpacity onPress={handlePress}>
        <Text className="text-white text-2xl">{currentQuality.label}</Text>
      </TouchableOpacity>
    </VStack>
  );
};

export default AudioQualitySwitcher;
