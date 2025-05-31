// app/(auth)/register.tsx - File đăng ký
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, router } from "expo-router";
import { Stack } from "expo-router";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Center, HStack, Input, Spinner } from "@/components/ui";
import { InputField } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Divider } from "@/components/ui/divider";
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";
import { supabase } from "@/lib/supabase";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "@/components/ui/heading";
import { useColorScheme } from "nativewind";

const header = () => {
  const isDarkMode = useColorScheme().colorScheme === "dark";
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: "",
        headerTransparent: true,
        headerTintColor: isDarkMode ? "#fafafa" : "#000",
      }}
    />
  );
};

export default function Register() {
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isInvalidRePassword, setIsInvalidRePassword] = useState(false);
  const { signUp, loading, setLoading } = useAuth();

  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const repasswordRef = useRef("");

  const handleEmailChange = (text: string) => {
    if (isInvalidEmail) {
      setIsInvalidEmail(false);
    }
    emailRef.current = text;
  };

  const handlePasswordChange = (text: string) => {
    if (isInvalidPassword) {
      setIsInvalidPassword(false);
    }
    if (text.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
    } else {
      setPasswordError("");
    }
    passwordRef.current = text;
  };

  const handleRePasswordChange = (text: string) => {
    if (isInvalidRePassword) {
      setIsInvalidRePassword(false);
    }
    repasswordRef.current = text;
  };

  const handleNameChange = (text: string) => {
    nameRef.current = text;
  };

  async function signUpWithEmail() {
    try {
      if (emailRef.current === "") {
        setIsInvalidEmail(true);
        return;
      }
      if (passwordRef.current === "") {
        setPasswordError("Vui lòng nhập mật khẩu");
        setIsInvalidPassword(true);
        return;
      }
      if (passwordRef.current.length < 6) {
        setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
        setIsInvalidPassword(true);
        return;
      }
      if (
        repasswordRef.current === "" ||
        passwordRef.current !== repasswordRef.current
      ) {
        setIsInvalidRePassword(true);
        return;
      }
      await signUp({
        email: emailRef.current,
        password: passwordRef.current,
        display_name: nameRef.current,
      });
      setLoading(false);
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      var errorMessage = error.message;
      if (errorMessage.includes("registered")) {
        errorMessage = "Email đã được đăng ký";
      }
      Alert.alert("Đăng ký không thành công", errorMessage, [
        {
          text: "Đóng",
          onPress: () => setLoading(false),
        },
      ]);
    }
  }

  if (loading) {
    return (
      <View className="w-full h-full items-center bg-background-0 justify-center">
        {header()}
        <LoadingOverlay />
      </View>
    );
  }

  const signUpWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://your-redirect-url.com",
      },
    });
    if (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      console.log("handleGoogle");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      // setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing up with Google:", error);
      // setError(error.message || "Đã xảy ra lỗi khi đăng ký với Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View className="flex-1 items-center h-full bg-background-0">
          {header()}
          {/* <KeyboardAvoidingComponent> */}

          <VStack className="flex-1 items-center w-full max-w-md bg-transparent p-4">
            <Center className="h-32">
              <Heading className="text-primary-500 font-bold text-4xl mt-4">
                Đăng ký
              </Heading>
            </Center>
            <VStack space="md" className="bg-none w-full">
              <FormControl isRequired={true} isInvalid={isInvalidEmail}>
                <FormControlLabel>
                  <FormControlLabelText>Tên của bạn</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type="text"
                    placeholder="Enter your name"
                    onChangeText={handleNameChange}
                  ></InputField>
                </Input>
              </FormControl>
              <FormControl isRequired={true} isInvalid={isInvalidEmail}>
                <FormControlLabel>
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type="text"
                    placeholder="Enter your email"
                    onChangeText={handleEmailChange}
                  ></InputField>
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    Vui lòng nhập email
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isRequired={true} isInvalid={isInvalidPassword}>
                <FormControlLabel>
                  <FormControlLabelText>Mật khẩu</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type="password"
                    placeholder="Enter your password"
                    onChangeText={handlePasswordChange}
                  ></InputField>
                </Input>
                <FormControlError>
                  <FormControlErrorText>{passwordError}</FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isRequired={true} isInvalid={isInvalidRePassword}>
                <FormControlLabel>
                  <FormControlLabelText>Nhập lại mật khẩu</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type="password"
                    placeholder="Enter your password"
                    onChangeText={handleRePasswordChange}
                  ></InputField>
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    Mật khẩu không khớp
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <Button
                onPress={signUpWithEmail}
                variant="solid"
                className="mt-4"
              >
                <ButtonText>Đăng ký</ButtonText>
              </Button>
            </VStack>
            <HStack className="w-full justify-between items-center mt-2">
              <Divider className="w-1/3" />
              <Text className="text-primary-100">Hoặc</Text>
              <Divider className="w-1/3" />
            </HStack>
            <Button
              onPress={handleGoogle}
              variant="outline"
              className="mt-2 w-full data-[active=true]:bg-background-300"
            >
              <ButtonText>Đăng ký với Google</ButtonText>
              <AntDesign
                name="googleplus"
                size={24}
                className="color-primary-100"
              />
            </Button>
            <VStack className="w-full justify-center items-center mt-4">
              <Text className="text-primary-100">Bạn đã có tài khoản?</Text>
              <Link href="/(auth)/login" className="text-primary-100 font-bold">
                Đăng nhập
              </Link>
            </VStack>
          </VStack>
          {/* </KeyboardAvoidingComponent> */}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 0,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
