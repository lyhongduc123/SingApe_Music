import { useMemo } from "react";
import { View, FlatListProps } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Button } from "../ui";
import { ButtonIcon, ButtonText } from "../ui/button";
import { X } from "lucide-react-native";

export type FilterType = { label: string; value: string };



interface SearchListHeaderProps {
  isVisible?: boolean;
  selected: FilterType;
  filterOptions: FilterType[];
  onSelect: (value: FilterType) => void;
}

export const SearchListHeader = ({
  selected,
  onSelect,
  filterOptions,
  isVisible,
}: SearchListHeaderProps) => {
  const displayedOptions = useMemo(() => {
    if (selected.value === "all") return filterOptions;
    const filtered = filterOptions.filter(
      (item) => item.value === selected.value
    );
    return [{ label: "button", value: "x" }, ...filtered];
  }, [selected, filterOptions]);

  if (!isVisible) {
    return null;
  }

  const handleOnSelect = async (value: FilterType) => {
    if (selected?.value === value.value) {
      return onSelect({
        label: "Tất cả",
        value: "all",
      });
    }
    onSelect(value);
  };

  return (
    <Animated.FlatList
      data={displayedOptions}
      keyExtractor={(item) => item.value.toString()}
      horizontal
      className="h-12"
      showsHorizontalScrollIndicator={false}
      itemLayoutAnimation={LinearTransition}
      removeClippedSubviews={false}
      ItemSeparatorComponent={() => <View className="w-2" />}
      ListHeaderComponent={() => <View className="w-4" />}
      ListFooterComponent={() => <View className="w-4" />}
      renderItem={({ item }) => {
        const isActive = selected.value === item.value;
        if (item.value === "x") {
          return (
            <Button
              variant="solid"
              action="secondary"
              className={`rounded-full w-10 h-10`}
              size="sm"
              onPress={() => handleOnSelect(selected)}
            >
              <ButtonIcon as={X} className="text-base" />
            </Button>
          );
        }
        return (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Button
              variant="solid"
              action="secondary"
              className={`rounded-full w-fit h-10 ${
                isActive && "bg-green-500"
              }`}
              onPress={() => handleOnSelect(item)}
            >
              <ButtonText
                className={`text-base font-medium ${isActive && "text-white"}`}
              >
                {item.label}
              </ButtonText>
            </Button>
          </Animated.View>
        );
      }}
    />
  );
};
