import CustomHeader from "@/components/CustomHeader";
import { Box, Button, Modal, Text, VStack } from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ModalContent, ModalHeader } from "@/components/ui/modal";
import { useAuth } from "@/context/auth";
import { router, Stack } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettings() {
  const { user } = useAuth();
  const [username, setUsername] = useState<string>(user?.user_metadata.display_name ?? "");
  const [email, setEmail] = useState<string>(user?.user_metadata.email ?? "");

  

  return (
    <SafeAreaView className="flex-1 items-center bg-background-0">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader
        title="Tài khoản"
        showBack={true}
        titleClassName="text-xl font-medium"
        headerClassName="px-1"
      />
      <VStack space="xl" className="w-full mt-4 mb-2">
        <Box className="w-full px-4">
          <Heading className="text-2xl font-medium mt-2 mb-4">
            Thông tin chi tiết về tài khoản
          </Heading>
          <Text className="text-xl text-primary-500 font-medium">
            Tên người dùng
          </Text>
          <Text className="text-base text-primary-500 mt-2">{user?.user_metadata.display_name}</Text>
          <Text className="text-xl text-primary-500 font-medium mt-2">
            Email
          </Text>
          <Text className="text-base text-primary-400 mt-2">{user?.user_metadata.email}</Text>
        </Box>
        <Box className="w-full px-4 items-center">
          <Button
            className="w-32 justify-self-center"
            size="lg"
            variant="solid"
            action="primary"
            onPress={() => {
              router.push("/editProfile");
            }}
          >
            <ButtonText className="text-base font-medium">Chỉnh sửa</ButtonText>
          </Button>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
