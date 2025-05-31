import { Href, router, Stack } from "expo-router";
import { Box, HStack, Text, VStack, Image, Button } from "@/components/ui";
import { CrownIcon, LogOut, Settings } from "lucide-react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { fontSize, iconSize } from "@/constants/tokens";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { BellIcon, Icon } from "@/components/ui/icon";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";

const header = () => {
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  const handleNotification = () => {
    router.push("/profile/notifications" as Href);
  };

  return (
    <Stack.Screen
      options={{
        headerTitle: "Cá nhân",
        headerTransparent: true,
        headerTitleStyle: {
          fontSize: fontSize.xl,
        },
        headerRight: () => (
          <HStack className="flex-row items-center space-x-2 pr-4">
            <Button
              onPress={handleNotification}
              variant="solid"
              className="p-2 bg-transparent border-none rounded-full data-[active=true]:bg-background-200"
            >
              <Icon className="text-primary-500" as={BellIcon} />
            </Button>
          </HStack>
        ),
        headerTintColor: isDarkMode ? "#fff" : "#000",
      }}
    />
  );
};

export default function Profile() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/(auth)" as Href);
  };

  const handleSetting = () => {
    router.push("/profile/settings" as Href);
  };

  const handleNotification = () => {
    router.push("/profile/notifications" as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <VStack className="flex-1">
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
            <Text className="text-2xl font-bold pt-2">
              {user?.user_metadata.display_name}
            </Text>
            <HStack className="w-fit justify-center items-center gap-2 bg-info-50 text-info-800 px-2 py-1 rounded-2xl shadow-md border border-info-200">
              <Icon
                as={CrownIcon}
                className="text-tertiary-500 fill-tertiary-500"
              />
              <Text className="text-xl">Premium</Text>
            </HStack>
          </VStack>
        </HStack>
        <VStack className="flex-1 px-2 pt-2 space-y-2">
          <Button
            onPress={handleSetting}
            variant="solid"
            action="secondary"
            className="w-full bg-transparent justify-start mb-2 data-[active=true]:bg-background-200"
          >
            <ButtonIcon className="text-primary-500" as={Settings} />
            <ButtonText>Cài đặt</ButtonText>
          </Button>
          <Button
            onPress={handleSignOut}
            variant="solid"
            action="secondary"
            className="w-full bg-transparent justify-start mb-2 data-[active=true]:bg-background-200"
          >
            <ButtonIcon className="text-primary-500" as={LogOut} />
            <ButtonText>Đăng xuất</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
