import { Href, router, Stack } from "expo-router";
import {
  Box,
  HStack,
  Text,
  VStack,
  Image,
  Button,
  Center,
} from "@/components/ui";
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  CrownIcon,
  LogOut,
  Palette,
  Settings,
} from "lucide-react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { backgroundColor, fontSize, iconSize } from "@/constants/tokens";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { BellIcon, CircleIcon, Icon } from "@/components/ui/icon";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import { useSharedValue } from "react-native-reanimated";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { useEffect, useState } from "react";
import { AccordionItem } from "@/components/accordion/AccordionItem";
import { LightBox } from "@/components/preview/LightBox";
import { useTheme } from "@/components/ui/ThemeProvider";
import { DarkBox } from "@/components/preview/DarkBox";
import { SystemBox } from "@/components/preview/System";
import { AccordionButton } from "@/components/accordion/AccordionButton";

export default function Profile() {
  const { signOut, user } = useAuth();

  const theme = useTheme();

  const [values, setValues] = useState(theme.theme);
  const [open, setOpen] = useState(false);

  const themeSelectorOpen = useSharedValue(false);
  const onThemePress = () => {
    themeSelectorOpen.value = !themeSelectorOpen.value;
  };

  useEffect(() => {
    theme.changeTheme(values);
  }, [values]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/(auth)" as Href);
  };

  const onAccountPress = () => {
    router.push("/profile/settings/account" as Href);
  };

  const handleSetting = () => {
    router.push("/profile/settings" as Href);
  };

  const handleNotification = () => {
    router.navigate("/profile/notifications" as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <VStack>
        <CustomHeader
          title="Cá nhân"
          showBack={false}
          titleClassName="text-4xl font-bold"
          headerClassName="px-4"
        />
        <HStack className="p-4">
          <Avatar size="xl" className="border">
            <AvatarFallbackText>Lucas</AvatarFallbackText>
            <AvatarImage
              source={{
                uri:
                  user?.user_metadata.avatar_url ??
                  "https://ui-avatars.com/api/?length=1&bold=true&background=f76806&name=" +
                    user?.user_metadata.display_name,
              }}
            />
          </Avatar>
          <VStack className="pl-4 gap-1">
            <Text className="text-2xl text-primary-500 font-bold pt-2">
              {user?.user_metadata.display_name}
            </Text>
            {/* <HStack className="w-fit justify-center items-center gap-2 bg-info-50 text-info-800 px-2 py-1 rounded-2xl shadow-md border border-info-200">
              <Icon
                as={CrownIcon}
                className="text-tertiary-500 fill-tertiary-500"
              />
              <Text className="text-xl">Premium</Text>
            </HStack> */}
          </VStack>
        </HStack>
      </VStack>
      {/* <Button
        onPress={onAccountPress}
        variant="solid"
        action="secondary"
        className="w-full bg-transparent justify-start mb-2 data-[active=true]:bg-background-200"
      >
        <HStack className="w-full justify-between">
          <HStack space="sm" className="items-center">
            <ButtonIcon className="text-primary-500" as={CircleUserRound} />
            <ButtonText>Tài khoản</ButtonText>
          </HStack>
          <ButtonIcon as={ChevronRight} className="text-primary-500" />
        </HStack>
      </Button> */}
      <VStack className="px-2">
        <AccordionButton
          onPress={onAccountPress}
          buttonText="Tài khoản"
          leftIcon={CircleUserRound}
        />
        {/* <Button
        onPress={onThemePress}
        variant="solid"
        action="secondary"
        className="w-full bg-transparent justify-start mb-2 data-[active=true]:bg-background-200"
      >
        <ButtonIcon className="text-primary-500" as={Palette} />
        <ButtonText>Chế độ</ButtonText>
      </Button> */}
        <AccordionButton
          onPress={onThemePress}
          buttonText="Chế độ"
          leftIcon={Palette}
          chevronChangable
        />
        <AccordionItem isExpanded={themeSelectorOpen} viewKey="m1">
          <RadioGroup value={values} onChange={setValues}>
            <HStack space="2xl" className="px-4 h-full justify-evenly">
              <Radio value="light">
                <VStack space="md" className="items-center">
                  <LightBox />
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel className="text-base">Sáng</RadioLabel>
                </VStack>
              </Radio>
              <Radio value="dark">
                <VStack space="md" className="items-center">
                  <DarkBox />
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel className="text-base">Tối</RadioLabel>
                </VStack>
              </Radio>
              <Radio value="system">
                <VStack space="md" className="items-center">
                  <SystemBox />
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel className="text-base">Hệ thống</RadioLabel>
                </VStack>
              </Radio>
            </HStack>
          </RadioGroup>
        </AccordionItem>
        <AccordionButton
          onPress={handleNotification}
          buttonText="Thông báo"
          leftIcon={Bell}
        />
      </VStack>
      <Center>
        <Button
          onPress={handleSignOut}
          variant="solid"
          action="primary"
          size="lg"
          className="mb-2 w-36 data-[active=true]:bg-background-200 rounded-full"
        >
          <ButtonText>Đăng xuất</ButtonText>
        </Button>
      </Center>
    </SafeAreaView>
  );
}
