import { ToggleIcon } from "@/components/buttons/ToggleIcon";
import CustomHeader from "@/components/CustomHeader";
import { AnimatedIcon } from "@/components/icons/AnimatedIcon";
import {
  Box,
  Button,
  Icon,
  Pressable,
  Text,
  VStack,
  Image,
  Center,
} from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { unknownTrackImageSource } from "@/constants/image";
import { addSongToPlaylist, getPlaylist, listPlaylists } from "@/services/fileService";
import { MyTrack } from "@/types/zing.types";
import { router, useLocalSearchParams } from "expo-router";
import {
  Check,
  CheckCircle,
  Circle,
  CircleCheck,
  Search,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListPlaylist() {
  const item = useLocalSearchParams<MyTrack>();
  const [data, setData] = useState<MyTrack[]>([]);

  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    const isSelected = selected.includes(id);
    const updated = isSelected
      ? selected.filter((pid) => pid !== id)
      : [...selected, id];

    setSelected(updated);
  };

  const handleCreatePlaylist = async () => {
    console.log("Tạo playlist với tên:", item);
    router.push({
      pathname: "/createPlaylist",
      params: item,
    });
  };

  const handleConfirm = async () => {
    console.log("Xác nhận thêm vào danh sách phát", selected);
    await Promise.all(
      await selected.map(async (playlistId) => {
        await addSongToPlaylist(playlistId, item);
      })
    );
    router.back();
  }

  useEffect(() => {
    const fetchAlbum = async () => {
      const response = await listPlaylists();
      setData(response);
    };

    fetchAlbum();
  }, []);

  return (
    <SafeAreaView className="bg-background-0 flex-1">
      <CustomHeader
        title="Thêm vào danh sách phát"
        showBack={true}
        centerTitle={true}
      />
      <ScrollView className="flex-1">
        <VStack space="md" className="px-4 py-2">
          <Center>
            <Button
              variant="solid"
              className="h-14 rounded-full mt-2 mb-2 px-4"
              style={{ width: 170 }}
              action="primary"
              onPress={handleCreatePlaylist}
            >
              <ButtonText>Tạo danh sách phát</ButtonText>
            </Button>
          </Center>
          <Button
            variant="outline"
            className="w-full mt-2 mb-2 px-4 justify-start"
          >
            <ButtonIcon as={Search} />
            <ButtonText>Tìm kiếm danh sách phát</ButtonText>
          </Button>
          <FlatList
            data={data}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View className="h-3 bg-transparent" />
            )}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item.id);
              return (
                <Pressable
                  onPress={() => toggleSelect(item.id)}
                  className="flex-row items-center justify-between"
                >
                  <Image
                    source={item.artwork || unknownTrackImageSource}
                    alt={"Playlist" + item.title}
                    className="w-16 h-16 rounded-lg"
                  />
                  <VStack className="flex-1 ml-4 justify-center">
                    <Text className="text-base font-medium text-primary-500">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-primary-400">
                      {item.tracks.length} Bài hát
                    </Text>
                  </VStack>
                  <Center className="w-8">
                  {isSelected ? (
                    <AnimatedIcon
                      as={CircleCheck}
                      size="xl"
                      className="text-background-0 fill-green-500 h-8 w-8 "
                    />
                  ) : (
                    <AnimatedIcon
                      as={Circle}
                      size="xl"
                      className="text-primary-500 h-6 w-6 "
                    />
                  )}
                  </Center>
                </Pressable>
              );
            }}
          />
        </VStack>
      </ScrollView>
      <Center
        style={{ position: "absolute", bottom: 20, left: 0, right: 0 }}
        className="p-4"
      >
        <Button
          onPress={() => {
            handleConfirm();
          }}
          className="w-32 h-14 rounded-full"
          variant="solid"
          action="positive"
        >
          <ButtonText className="text-base font-medium">Xác nhận</ButtonText>
        </Button>
      </Center>
    </SafeAreaView>
  );
}
