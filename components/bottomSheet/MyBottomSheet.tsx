import { backgroundColor } from "@/constants/tokens";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo } from "react";
import { useColorScheme } from "nativewind";
import { Track } from "react-native-track-player";
import { HStack, Image, VStack, Text, Box, Button } from "../ui";
import { unknownTrackImageSource } from "@/constants/image";
import { Divider } from "../ui/divider";
import { ButtonIcon, ButtonText } from "../ui/button";
import { CircleArrowDown, CirclePlus, Heart } from "lucide-react-native";
import { MyTrack } from "@/types/zing.types";

interface TrackBottomSheetProps {
  bottomSheetRef?: React.Ref<BottomSheetModal>;
  children?: React.ReactNode;
}

export const MyBottomSheet = ({
  bottomSheetRef,
  children,
  ...props
}: TrackBottomSheetProps) => {
  const { colorScheme } = useColorScheme();

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
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      backgroundStyle={{
        backgroundColor:
          colorScheme === "dark" ? backgroundColor.minDark : backgroundColor.light,
      }}
    >
      <BottomSheetView className="p-4">
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
