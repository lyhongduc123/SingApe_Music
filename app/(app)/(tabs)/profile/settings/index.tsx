import { Href, router, Stack } from "expo-router";
import { VStack, Button, Text, HStack, Box } from "@/components/ui";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  backgroundColor,
  fontSize,
  iconSize,
  textColor,
} from "@/constants/tokens";
import { FlatList, View } from "react-native";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { ButtonIcon } from "@/components/ui/button";
import { BellRing, BookA, CircleUserRound, Palette } from "lucide-react-native";
import { ThemeModal } from "@/components/ThemeModal";
import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { CircleIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import { useTheme } from "@/components/ui/ThemeProvider";


export default function Settings() {
  const { toggleTheme } = useTheme();

  const handleThemeChange = () => {
    toggleTheme();
  }

  const settingsOptions = [
    {
      id: 0,
      title: "Tài khoản",
      describe: "Tên người dùng, Email",
      icon: <ButtonIcon as={CircleUserRound} size="xxl" className="text-primary-500" />,
      action: () => {
        router.push("/profile/settings/account" as Href);
      },
    },
    {
      id: 1,
      title: "Chủ đề",
      describe: "Theo chế độ hệ thống",
      icon: <ButtonIcon as={Palette} size="xxl" className="text-primary-500"/>,
      action: () => {handleThemeChange()},
    },
    {
      id: 2,
      title: "Ngôn ngữ",
      describe: "Tiếng Việt",
      icon: <ButtonIcon as={BookA} size="xxl" className="text-primary-500"/>,
      action: () => {},
    },
    {
      id: 3,
      title: "Thông báo",
      describe: "Theo chế độ hệ thống",
      icon: <ButtonIcon as={BellRing} size="xxl" className="text-primary-500" />,
      action: () => {},
    },
  ];
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* {header()} */}
      <CustomHeader
        title="Cài đặt"
        showBack={true}
        titleClassName="text-xl font-medium"
        headerClassName="px-1"
      />
      <Box className="flex-1 bg-background-0 px-2 py-2">
      <FlatList
          data={settingsOptions}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View className="h-4 bg-transparent" />
          )}
          renderItem={({ item }) => (
            <Button
              variant="solid"
              onPress={item.action}
              className="w-full px-2 h-14 min-h-fit justify-start bg-transparent border-none data-[active=true]:bg-background-200"
            >
              {item.icon}
              <VStack className="px-3">
                <Text className="text-base font-semibold">{item.title}</Text>
                <Text className="text-sm text-gray-500">{item.describe}</Text>
              </VStack>
            </Button>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}
