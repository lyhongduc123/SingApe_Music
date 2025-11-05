import CustomHeader from "@/components/CustomHeader";
import { Button, HStack, VStack, Image, Pressable } from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { useLibraryStore } from "@/store/mylib";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { AlignJustify, CircleX, X } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useCallback, useEffect, useRef, useState } from "react";
import { MyPlaylist, MyTrack } from "@/types/zing.types";
import Animated, { LinearTransition, SlideOutLeft } from "react-native-reanimated";
import { P } from "ts-pattern";
import { unknownTrackImageSource } from "@/constants/image";
import { updatePlaylist } from "@/services/cacheService";
import { stat } from "react-native-fs";

export default function editPlaylist() {
  const item = useLocalSearchParams();
  const playlists = useLibraryStore((state) => state.playlists);
  const updateStorePlaylist = useLibraryStore((s) => s.setPlaylist);
  const [playlist, setPlaylist] = useState<MyPlaylist>();
  const [changed, setChanged] = useState(false);
  const [initialPlaylist, setInitialPlaylist] = useState<MyPlaylist>();

  useFocusEffect(
    useCallback(() => {
      const found = playlists.find((playlist) => playlist.id === item.id);
      console.log("Focus effect found:", found);
      if (found) {
        setPlaylist(found);
        setInitialPlaylist(found);
      }
    }, [item.id, playlists])
  );

  const handleChange = () => {
    if (playlist?.tracks.length !== initialPlaylist?.tracks.length) return true;
    if (playlist?.title !== initialPlaylist?.title) return true;
    if (playlist?.description !== initialPlaylist?.description) return true;

    for (let i = 0; i < (initialPlaylist?.tracks?.length ?? 0); i++) {
      if (playlist?.tracks[i].id !== initialPlaylist?.tracks[i].id) return true;
    }
    return false;
  }

  useEffect(() => {
    const isChanged = handleChange();
    console.log("isChanged", isChanged);
    setChanged(isChanged);
  }, [playlist]);

  const listHeader = () => {
    return (
      <VStack>
        <Image
          source={playlist?.artwork || unknownTrackImageSource}
          alt="Playlist Image"
          className="w-full h-32 rounded-md"
        />
        
      </VStack>
    )
  }

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<MyTrack>) => {
    return (
      <Animated.View exiting={SlideOutLeft}>
      <HStack space="md" className={`w-full items-center py-2 ${isActive && "bg-background-50"}`}>
        <Button variant="solid" size="lg"
          className="bg-transparent data-[active=true]:bg-transparent w-8 h-8 rounded-full"
          onPress={() => {
            setPlaylist((prev) => {
              if (!prev) return prev; // Ensure prev is defined
              return {
                ...prev,
                tracks: prev.tracks.filter((track) => track.id !== item.id),
              };
            });
          }}>
          <ButtonIcon as={CircleX} size="xl" className="text-primary-500" />
        </Button>
        <HStack className="flex-1 items-center justify-between w-full">
        <VStack>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            className="text-base text-primary-500"
          >
            {item.title}
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            className="text-base text-gray-500"
          >
            {item.artist}
          </Text>
        </VStack>
        <Button
          variant="solid"
          size="lg"
          onPressIn={drag}
          disabled={isActive}
          className="bg-transparent data-[active=true]:bg-transparent w-8 h-8 rounded-full"
        >
          <ButtonIcon
            as={AlignJustify}
            size="xl"
            className="text-primary-500"
          />
        </Button>
        </HStack>
      </HStack>
      </Animated.View>
    );
  }, [])

  const onDragEnd = ({ data, from, to }: DragEndParams<MyTrack>) => {
    if (from === to) return;
    setPlaylist((prev => {
      if (!prev) return prev; // Ensure prev is defined
      return {
        ...prev,
        tracks: data,
      };
    }
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CustomHeader
        title="Chỉnh sửa Playlist"
        backIcon={X}
        centerTitle={true}
        showBack={true}
        right={
          <Pressable
            className="mr-3"
            onPress={() => {
              if (!changed) return
              if (playlist) {
                updateStorePlaylist(playlist);
                updatePlaylist(playlist.id, playlist);
                router.back();
              }
            }}
          >
            <Text className={`${!changed ? "text-gray-500" : "text-primary-500"}`}>Lưu</Text>
          </Pressable>
        }
      />
      <DraggableFlatList
        data={playlist?.tracks || []}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={8}
        renderItem={renderItem}
        onDragEnd={onDragEnd}
      />
    </SafeAreaView>
  );
}
