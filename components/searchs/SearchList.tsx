import { FlatList, FlatListProps, View } from "react-native";
import { MixedItem, MixedSearchItem } from "./MixedItem";
import { useEffect, useState } from "react";
import { Button, Center, HStack, Text, VStack } from "../ui";
import { ButtonText } from "../ui/button";
import { FilterType, SearchListHeader } from "./SearchListHeader";
import { MyBottomSheet } from "../bottomSheet/MyBottomSheet";
import { unknownTrackImageSource } from "@/constants/image";

interface SearchListProps extends Partial<FlatListProps<MixedSearchItem>> {
  data: MixedSearchItem[];
  dataSlice?: MixedSearchItem[];
  displayAll?: boolean;
  onSelectSong: (item: MixedSearchItem) => void;
  onSelectArtist: (item: MixedSearchItem) => void;
  onSelectPlaylist: (item: MixedSearchItem) => void;
}

export const SearchList = ({
  data,
  dataSlice,
  displayAll = false,
  onSelectSong,
  onSelectArtist,
  onSelectPlaylist,
  ...props
}: SearchListProps) => {
  const [filteredData, setFilteredData] = useState<MixedSearchItem[]>(
    dataSlice || []
  );
  const [showAll, setShowAll] = useState(displayAll);

  const [filter, setFilter] = useState<FilterType>({
    label: "Tất cả",
    value: "all",
  });

  const filterOptions: FilterType[] = [
    { label: "Bài hát", value: "song" },
    { label: "Danh sách phát", value: "playlist" },
    { label: "Nghệ sĩ", value: "artist" },
    { label: "Album", value: "album" },
  ];

  useEffect(() => {
    if (showAll) {
      if (filter.value === "all") {
        setFilteredData(data);
      } else {
        const filtered = data.filter((item) => item.type === filter.value);
        setFilteredData(filtered);
      }
    } else {
      setFilteredData(dataSlice || []);
    }
  }, [filter, showAll, data, dataSlice]);

  if (filteredData.length === 0) {
    return (
      <Center className="flex-1">
        <Text className="text-gray-500">Không có kết quả nào</Text>
      </Center>
    );
  }

  return (
    <VStack space="xs" className="pt-2">
      <SearchListHeader
        selected={filter}
        onSelect={setFilter}
        filterOptions={filterOptions}
        isVisible={showAll}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        ItemSeparatorComponent={() => <View className="h-3 bg-transparent" />}
        ListFooterComponent={() => (
          <>
            {!showAll && filteredData.length > 0 && (
              <Button
                variant="link"
                action="positive"
                className="h-14"
                onPress={() => {
                  setShowAll(true);
                }}
              >
                <ButtonText>Xem tất cả các kết quả</ButtonText>
              </Button>
            )}
            <View className="h-20 bg-transparent" />
          </>
        )}
        renderItem={({ item }) => (
          <MixedItem
            item={item}
            isRecent={false}
            onSelectSong={onSelectSong}
            onSelectArtist={onSelectArtist}
            onSelectPlaylist={onSelectPlaylist}
          />
        )}
        {...props}
      />
    </VStack>
  );
};
