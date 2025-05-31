import { Image } from "@/components/ui/image";
import React from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function AuthenticateOption() {
  const handleLogin = () => {
    router.push("/login");
    console.log("Sign In button pressed");
  };
  const handleRegister = () => {
    router.push("/register");
    console.log("Sign Up button pressed");
  };
  return (
    <SafeAreaView className="flex-1 bg-background-0 p-4">
    <VStack className="flex-1 justify-center items-center">
      <Image
        size="lg"
        source={
          require("../../assets/images/music.png")
        }
        alt="logo"
      />
      <Text className="text-primary-500 text-3xl font-bold mb-4">SingApe</Text>
      <Text className="text-primary-100 text-2lg mb-4">
        Nghe nhạc hoàn toàn miễn phí
      </Text>
      <Text className="text-primary-100 text-2lg mb-4">
        Tạo playlist và chia sẻ với bạn bè
      </Text>
    </VStack>
    <VStack space="md" className="bg-none w-full p-4 bottom-10">
        <Button
          onPress={handleRegister}
          variant="solid"
          action="positive"
          className="mb-2"
        >
          <ButtonText>Đăng ký</ButtonText>
        </Button>
        <Button
          onPress={handleLogin}
          className="mb-2 data-[active=true]:bg-background-300"
          variant="outline"
          action="primary"
        >
          <ButtonText>Đăng nhập</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}

