import { Box, Button, VStack, Text, Input, Modal, Icon } from "@/components/ui";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { InputField } from "@/components/ui/input";
import { ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { useAuth } from "@/context/auth";
import { supabase } from "@/lib/supabase";
import { router, Stack } from "expo-router";
import { Info, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const { user, setUser } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleEditProfile = () => {
    if (!name || !email) {
      console.error("Name and email cannot be empty");
      return;
    }
    supabase.auth.updateUser({
      data: { display_name: name, email: email },
    }).then(({ data, error }) => {
      if (error) {
        console.error("Error updating user:", error);
      } else {
        console.log("User updated successfully:", data);
      }
    });
    // Update the user in the database
    supabase.from("users")
      .update({ display_name: name, email: email })
      .eq("id", user?.id || "")
      .then(({ error }) => {
        if (error) {
          console.error("Error updating user in database:", error);
        } else {
          console.log("User updated successfully in database:", user?.id);
        }
      });
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        console.error("Failed to retrieve user");
      }
    });
    
    router.back();
  };

  useEffect(() => {
    if (user) {
      setName(user.user_metadata.display_name || "");
      setEmail(user.user_metadata.email || "");
    }
  }
  , [user]);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ headerShown: false }} />
      <Box className="w-full px-4">
        <Button
          onPress={() => router.back()}
          variant="solid"
          action="primary"
          size="lg"
          className="w-12 h-12 bg-transparent border-none rounded-full data-[active=true]:bg-background-200"
        >
          <ButtonIcon as={X} size="xxl" className="text-primary-500" />
        </Button>
      </Box>
      <VStack space="xl" className="w-full mt-4 mb-2">
        <Box className="w-full px-4">
          <Heading className="text-2xl font-medium mt-2 mb-4">
            Chỉnh sửa thông tin tài khoản
          </Heading>
          <FormControl isInvalid={false} className="mt-4">
            <FormControlLabel>
              <FormControlLabelText>
                Tên người dùng
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
            <InputField
              className="w-full h-12 bg-background-50 border border-background-200 rounded-lg px-4"
              placeholder="Nhập tên người dùng mới"
              defaultValue={name}
              onChangeText={(text) => setName(text)}
            />
            </Input>
          </FormControl>
          <FormControl isInvalid={false} className="mt-4">
            <FormControlLabel>
              <FormControlLabelText>
                Email
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
            <InputField
              className="w-full h-12 bg-background-50 border border-background-200 rounded-lg px-4"
              placeholder="Nhập email của bạn"
              defaultValue={email}
              onChangeText={(text) => setEmail(text)}
            />
            </Input>
          </FormControl>
        </Box>
        <Box className="w-full px-4 items-center">
          <Button
            className="w-fit justify-self-center"
            size="lg"
            variant="solid"
            action="positive"
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <ButtonText className="text-base font-medium">Lưu chỉnh sửa</ButtonText>
          </Button>
        </Box>
      </VStack>
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-info items-center justify-center">
              <Icon as={Info} className="stroke-info-600" size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Heading size="md" className="text-typography-950 mb-2 text-center">
              Chỉnh sửa thông tin tài khoản
            </Heading>
            <Text size="sm" className="text-typography-500 text-center">
              Bạn có chắc chắn muốn lưu các thay đổi này không?
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                setModalVisible(false);
              }}
              className="flex-grow w-1/2"
            >
              <ButtonText>Hủy</ButtonText>
            </Button>
            <Button
              onPress={() => {
                handleEditProfile();
                setModalVisible(false);
              }}
              size="sm"
              className="flex-grow w-1/2"
            >
              <ButtonText>Xác nhận</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
