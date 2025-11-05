import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  Text,
  Pressable,
  Spinner,
  VStack,
  HStack,
  Image,
  Center,
  Icon,
  Box,
  Button,
} from "@/components/ui";
import { Track, useActiveTrack, useIsPlaying } from "react-native-track-player";
import { unknownTrackImageSource } from "@/constants/image";
import PlayingBars from "./PlayingBar";
import {
  CirclePlus,
  EllipsisVertical,
  Option,
  Play,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import { iconColor } from "@/constants/tokens";
import { useSelector } from "react-redux";
import { ButtonIcon } from "./ui/button";
import { Children, useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "./ui/actionsheet";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { useWindowDimensions, View } from "react-native";
import { MyTrack } from "@/types/zing.types";

export type TracksListItemProps = {
  track: MyTrack;
  onTrackSelect: (track: MyTrack) => void;
  onRightPress?: (track: MyTrack) => void;
  variant?: variantType;
  showOptionButton?: boolean;
  children?: React.ReactNode;
};

export type variantType = "playlist" | "album";

export const TracksListItem = ({
  track,
  onTrackSelect: handleTrackSelect,
  variant = "playlist",
  onRightPress,
  showOptionButton = true,
  children,
}: TracksListItemProps) => {
  const { playing } = useIsPlaying();
  const isActiveTrack = useActiveTrack()?.id === track.id;

  const windowWidth = useWindowDimensions().width - 32;

  const variantAlbum = () => {
    if (!isActiveTrack || variant !== "album") return null;

    return (
      <PlayingBars
        color={iconColor.activeLight}
        running={playing}
        wapperHeight={15}
        className="relative"
      />
    );
  };

  const variantPlaylist = () => {
    if (variant !== "playlist") return null;
    return (
      <Center className="relative">
        <Image
          source={
            track.artwork ? { uri: track.artwork } : unknownTrackImageSource
          }
          className={`rounded`}
          size="sm"
          alt="track artwork"
        />

        {isActiveTrack ? (
          <Center className="absolute w-full h-full">
            <BlurView
              className="absolute w-full h-full"
              tint="dark"
              intensity={80}
            />
            {playing ? (
              <PlayingBars color={iconColor.activeLight} />
            ) : (
              <Icon
                as={Play}
                className="absolute text-indigo-500 fill-indigo-500"
              />
            )}
          </Center>
        ) : null}
      </Center>
    );
  };

  const handleOptionPress = (track: MyTrack) => {
    onRightPress?.(track);
  };

  return (
    <Pressable
      onPress={() => handleTrackSelect(track)}
      className="px-0 w-full"
      style={{ maxWidth: windowWidth }}
    >
      <HStack space="lg" className="items-center">
        {variantPlaylist()}
        <HStack className="flex-1 items-center justify-between">
          <VStack space="xs" className="flex-1">
            <HStack space="sm">
              {variantAlbum()}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={`text-lg font-medium ${
                  isActiveTrack ? "text-indigo-500" : "text-primary-500"
                }`}
              >
                {track.title}
              </Text>
            </HStack>
            {track.artist && (
              <Text numberOfLines={1} className="text-gray-500 dark:text-gray-400 text-sm">
                {track.artist}
              </Text>
            )}
          </VStack>
          {children}
          {showOptionButton && (
            <Button
              variant="solid"
              className="bg-transparent border-none data-[active=true]:bg-transparent w-10 h-10"
              size="sm"
              onPress={() => handleOptionPress(track)}
            >
              <ButtonIcon
                as={EllipsisVertical}
                size="xxl"
                className="text-primary-500"
              />
            </Button>
          )}
        </HStack>
      </HStack>
    </Pressable>
  );
};
