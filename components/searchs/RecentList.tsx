import { MyTrack } from "@/types/zing.types";
import { MixedItem, MixedSearchItem } from "./MixedItem";
import { FlatList, FlatListProps, View } from "react-native";
import { Button, Center, Text } from "../ui";
import { ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { useModal } from "@/context/modal";

interface RecentListProps extends Partial<FlatListProps<MixedSearchItem>> {
  data: MixedSearchItem[];
  onSelectSong: (item: MyTrack) => void;
  onSelectArtist: (item: MixedSearchItem) => void;
  onSelectPlaylist: (item: MixedSearchItem) => void;
  onRemoveRecent: (item: MixedSearchItem) => void;
  onRemoveAll: () => void;
}

export const RecentList = ({
  data,
  onSelectSong,
  onSelectArtist,
  onSelectPlaylist,
  onRemoveRecent,
  onRemoveAll,
  ...props
}: RecentListProps) => {
  const { show } = useModal();

  const handleRemoveRecentSearch = () => {
    show({
      title: "Xóa lịch sử tìm kiếm",
      message: "Bạn có chắc chắn muốn xóa lịch sử tìm kiếm không?",
      type: "normal",
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm: () => {
        onRemoveAll();
      },
    });
  };

  if (data.length === 0) {
    return (
      <Center className="flex-1 gap-2">
        <Heading className="text-primary-500">Phát nội dung bạn thích</Heading>
        <Text className="text-base text-gray-500 w-2/3 text-center">
          Tìm kiếm bài hát, nghệ sĩ và nhiều nội dung khác
        </Text>
      </Center>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      ItemSeparatorComponent={() => <View className="h-3 bg-transparent" />}
      ListFooterComponent={() => (
        <Center className="pt-4">
          <Button
            variant="outline"
            action="primary"
            onPress={handleRemoveRecentSearch}
            size="md"
            className="rounded-full w-fit h-10"
          >
            <ButtonText>Xóa lịch sử tìm kiếm gần đây</ButtonText>
          </Button>
          <View className="h-10 bg-transparent" />
        </Center>
      )}
      ListHeaderComponent={() => {
        return (
          <Heading className="px-2 text-2xl pb-4">Các tìm kiếm gần đây</Heading>
        );
      }}
      renderItem={({ item }) => (
        <MixedItem
          item={item}
          isRecent={true}
          onRemoveRecent={onRemoveRecent}
          onSelectSong={onSelectSong}
          onSelectArtist={onSelectArtist}
          onSelectPlaylist={onSelectPlaylist}
        />
      )}
      {...props}
    />
  );
};
