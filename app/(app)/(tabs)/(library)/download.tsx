import CustomHeader from "@/components/CustomHeader";
import {
  FlatList,
  Pressable,
  ScrollView,
  Touchable,
  View,
  StyleSheet,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

import { TracksList } from "@/components/TrackList";
import { Track } from "react-native-track-player";
import { Actionsheet, HStack, Image, VStack, Text, Box } from "@/components/ui";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { CircleArrowDown, Heart } from "lucide-react-native";
import { unknownTrackImageSource } from "@/constants/image";
import { getMusicInfo } from "@/services/metadataService";
import { Divider } from "@/components/ui/divider";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import colors from "tailwindcss/colors";
import { useColorScheme, vars } from "nativewind";
import { backgroundColor } from "@/constants/tokens";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { MyTrack } from "@/types/zing.types";
import { playTrack } from "@/services/playbackService";

export default function Download() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track>();
  const [tracks, setTracks] = useState<MyTrack[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setIsLoading(true);
        setHasPermission(true);
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 100,
        });

        const tracks = assets.map((asset) => {
          return {
            id: asset.id,
            title: asset.filename,
            artist: "Unknown Artist",
            album: "Unknown Album",
            url: asset.uri,
          };
        });
        console.log("tracks", tracks);
        setTracks(tracks);
        setIsLoading(false);
      } else {
        setHasPermission(false);
        console.log("Permission to access media library was denied");
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-transparent flex-1">
        <LoadingOverlay isUnder={true} />
        <CustomHeader
          title="Đã tải"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background-0 dark:bg-background-0 flex-1">
      <ScrollView className="bg-background-0 dark:bg-background-0">
        <CustomHeader
          title="Đã tải"
          showBack={true}
          centerTitle={false}
          headerClassName="bg-background-0 dark:bg-background-0"
        />
        <TracksList
          id="downloaded"
          tracks={tracks}
          scrollEnabled={false}
          onTrackSelect={playTrack}
          onTrackOptionPress={(track: MyTrack) => {
            handlePresentModalPress();
            setSelectedTrack(track);
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          className="px-4"
        />
        {/* <TrackActionSheet
          isOpen={openActionsheet}
          onClose={() => setOpenActionsheet(false)}
          track={selectedTrack as Track}
        /> */}
      </ScrollView>
      <TrackBottomSheet track={selectedTrack} bottomSheetRef={bottomSheetRef} />
    </SafeAreaView>
  );
}

interface TrackBottomSheetProps {
  track: Track | undefined;
  bottomSheetRef?: React.Ref<BottomSheetModal>;
}

const TrackBottomSheet = ({ ...props }: TrackBottomSheetProps) => {
  const colorMode = useColorScheme();

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const renderBackdrop = useCallback(
    (backdropprops: any) => (
      <BottomSheetBackdrop
        {...backdropprops}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={props.bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      backgroundStyle={{
        backgroundColor:
          colorMode.colorScheme === "dark"
            ? backgroundColor.dark
            : backgroundColor.light,
      }}
    >
      <BottomSheetView className="p-4">
        <HStack>
          <Image
            source={
              props.track?.artwork
                ? { uri: props.track.artwork }
                : unknownTrackImageSource
            }
            className="rounded"
            size="md"
            alt="track artwork"
          />
          <VStack className="flex-1 pl-2">
            <Text className="text-xl font-medium text-primary-500">
              {props.track?.title}
            </Text>
            <Text className="text-sm text-gray-500">
              {props.track?.artist} ● {props.track?.album}
            </Text>
          </VStack>
        </HStack>
        <Box className="w-full my-4">
          <Divider />
        </Box>
        <VStack space="md" className="w-full">
          <Button onPress={() => {}} size="md" className={buttonStyle}>
            <ButtonIcon
              as={CircleArrowDown}
              size="xxl"
              className="text-primary-500"
            />
            <ButtonText className={buttonTextStyle}>Tải xuống</ButtonText>
          </Button>
          <Button onPress={() => {}} className={buttonStyle}>
            <ButtonIcon as={Heart} size="xxl" className="text-primary-500" />
            <ButtonText className={buttonTextStyle}>Yêu thích</ButtonText>
          </Button>
          <Button onPress={() => {}} className={buttonStyle}>
            <ButtonIcon
              as={CircleArrowDown}
              size="xxl"
              className="text-primary-500"
            />
            <ButtonText className={buttonTextStyle}>
              Thêm vào danh sách phát
            </ButtonText>
          </Button>
        </VStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const buttonStyle =
  "w-full h-10 pl-1 bg-transparent justify-start border-none data-[active=true]:bg-background-100";
const buttonTextStyle =
  "pl-4 text-xl font-medium text-primary-500 data-[active=true]:text-primary-500";
