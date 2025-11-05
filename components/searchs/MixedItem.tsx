import { Artist, MyTrack } from "@/types/zing.types";
import { Alert, FlatListProps, View } from "react-native";
import { Button, HStack, Image, VStack, Text, Box } from "../ui";
import { ButtonIcon, ButtonText } from "../ui/button";
import {
  CircleArrowDown,
  CirclePlus,
  CircleUserRound,
  Heart,
  ListFilterPlus,
  Share2,
  X,
} from "lucide-react-native";
import { TracksListItem } from "../TrackListItem";
import { useRef, useState } from "react";
import { MyBottomSheet } from "../bottomSheet/MyBottomSheet";
import { unknownTrackImageSource } from "@/constants/image";
import { Divider } from "../ui/divider";
import ButtonBottomSheet from "../bottomSheet/ButtonBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Pressable } from "react-native-gesture-handler";
import { ShareModal } from "../ShareModal";
import { downloadSong } from "../DowloadMusic";

export type MixedSearchItem = any & {
  type: "song" | "artist" | "playlist" | "album";
};

interface MixedItemProps extends Partial<FlatListProps<MixedSearchItem>> {
  item: MixedSearchItem;
  isRecent: boolean;
  onRemoveRecent?: (item: MixedSearchItem) => void;
  onSelectSong: (item: MyTrack) => void;
  onSelectArtist: (item: MixedSearchItem) => void;
  onSelectPlaylist: (item: MixedSearchItem) => void;
}

export const MixedItem = ({
  item,
  isRecent,
  onRemoveRecent,
  onSelectSong,
  onSelectArtist,
  onSelectPlaylist,
}: MixedItemProps) => {
  const [followed, setFollowed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MixedSearchItem | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const ref = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => {
    ref.current?.present();
  };
  const handleDismissModalPress = () => {
    ref.current?.dismiss();
  };
  const handleSelectItem = (item: MixedSearchItem) => {
    setSelectedItem(item);
    handlePresentModalPress();
  };

  const handleFollowArtist = () => {
    setFollowed(!followed);
    console.log("Follow artist:", item);
  };

  const handleAddToPlaylistPress = () => {
    console.log("Add to playlist:", selectedItem);
  };
  const handleFavoritePress = () => {
    console.log("Favorite:", selectedItem);
  };
  const handleDownloadPress = () => {
    const result = downloadSong(
      selectedItem?.url ?? "",
      selectedItem?.title ?? "" + ".mp3"
    );
    if (result !== null) {
      Alert.alert("Tải thành công", "Nhạc đã được tải về.");
    }
    console.log("Download:", selectedItem);
  };
  const handleArtistPress = () => {
    console.log("Artist:", selectedItem);
  };
  const handleSharePress = () => {
    console.log("Share:", selectedItem);
    setShowModal(true);
  };
  const handleAddToNowPlayingPress = () => {};

  const renderItem = () => {
    if (item.type === "artist") {
      return renderArtistItem();
    } else if (item.type === "song") {
      return renderTrackItem();
    } else if (item.type === "playlist") {
      return renderPlaylistItem();
    }
    return null;
  };

  const removeRecentButton = (item: MixedSearchItem) => {
    return (
      <Button
        onPress={() => {
          onRemoveRecent?.(item);
          console.log("Remove recent:", item);
        }}
        className="bg-transparent border-none rounded-full data-[active=true]:bg-background-200 w-10 h-10"
      >
        <ButtonIcon as={X} size="xxl" className="text-gray-500" />
      </Button>
    );
  };

  const renderTrackItem = () => {
    const newItem = item as unknown as MyTrack;
    return (
      <View className="px-2">
        {isRecent ? (
          <TracksListItem
            track={newItem}
            showOptionButton={false}
            onTrackSelect={() => {
              onSelectSong(newItem);
            }}
          >
            {removeRecentButton(item)}
          </TracksListItem>
        ) : (
          <TracksListItem
            track={newItem}
            onTrackSelect={() => {
              onSelectSong(newItem);
            }}
            onRightPress={() => {
              handleSelectItem(newItem);
            }}
          />
        )}
      </View>
    );
  };

  const renderArtistItem = () => {
    const newItem = item as unknown as Artist;
    return (
      <Pressable
        onPress={() => {
          onSelectArtist(newItem);
        }}
      >
        <HStack space="lg" className="pl-2 pr-3 items-center">
          <Image
            source={newItem.thumbnailM}
            className="rounded-full"
            size="sm"
            alt={newItem.name || "Unknown"}
          />
          <HStack className="flex-1 justify-between items-center">
            <VStack space="xs" className="flex-1">
              <Text className="text-base font-semibold text-black dark:text-white">
                {newItem.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Nghệ sĩ
              </Text>
              {/* {star} {newItem.totalFollow} người theo dõi */}
            </VStack>

            {isRecent ? (
              removeRecentButton(newItem)
            ) : (
              <Button
                variant="outline"
                action="primary"
                onPress={() => {
                  handleFollowArtist();
                  console.log("Select artist:", newItem);
                }}
                className={`w-fit h-10 rounded-full ${
                  followed ? "border-primary-500" : "border-gray-500"
                }`}
              >
                <ButtonText>
                  {followed ? "Đang theo dõi" : "Theo dõi"}
                </ButtonText>
              </Button>
            )}
          </HStack>
        </HStack>
      </Pressable>
    );
  };

  const renderPlaylistItem = () => {
    const newItem = item as unknown as MyTrack;
    return (
      <Pressable
        onPress={() => {
          onSelectPlaylist(newItem);
        }}
      >
        <HStack space="lg" className="px-2 items-center">
          <Image
            source={newItem.thumbnailM}
            className="rounded-sm"
            size="sm"
            alt={newItem.name || "Unknown"}
          />
          <HStack space="md">
            <VStack space="xs" className="w-10/12">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-base font-semibold text-primary-500"
              >
                {newItem.title}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Danh sách phát
              </Text>
            </VStack>

            {isRecent && removeRecentButton(newItem)}
          </HStack>
        </HStack>
      </Pressable>
    );
  };

  return (
    <View>
      {renderItem()}
      <MyBottomSheet bottomSheetRef={ref}>
        <HStack space="md">
          <Image
            source={
              selectedItem?.artwork
                ? { uri: selectedItem.artwork }
                : unknownTrackImageSource
            }
            className="rounded"
            size="sm"
            alt="track artwork"
          />
          <VStack className="flex-1 pl-2">
            <Text className="text-xl font-medium text-primary-500">
              {selectedItem?.title}
            </Text>
            <Text className="text-md text-gray-500">
              {selectedItem?.artist}
            </Text>
          </VStack>
        </HStack>
        <Box className="w-full my-4">
          <Divider />
        </Box>
        <VStack space="md" className="w-full">
          <ButtonBottomSheet
            onPress={handleAddToPlaylistPress}
            buttonIcon={CirclePlus}
            buttonText="Thêm vào danh sách phát"
          />
          <ButtonBottomSheet
            onPress={handleFavoritePress}
            stateChangable={true}
            fillIcon={selectedItem?.isFavorite}
            buttonIcon={Heart}
            buttonText="Thêm vào yêu thích"
          />
          <ButtonBottomSheet
            onPress={handleAddToNowPlayingPress}
            buttonIcon={ListFilterPlus}
            buttonText="Thêm vào danh sách chờ"
          />
          <ButtonBottomSheet
            onPress={handleDownloadPress}
            buttonIcon={CircleArrowDown}
            buttonText="Tải xuống"
          />
          <ButtonBottomSheet
            onPress={handleArtistPress}
            buttonIcon={CircleUserRound}
            buttonText="Chuyển đến nghệ sĩ"
          />
          <ButtonBottomSheet
            onPress={handleSharePress}
            buttonIcon={Share2}
            buttonText="Chia sẻ"
          />
        </VStack>
        <ShareModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          title={selectedItem?.title ?? ""}
          artist={selectedItem?.artist ?? ""}
          url={selectedItem?.url ?? ""}
          image={selectedItem?.artwork}
        />
      </MyBottomSheet>
    </View>
  );
};
