import { ChevronRight, CircleUserRound, LucideIcon } from "lucide-react-native";
import { Button, HStack } from "../ui";
import { ButtonIcon, ButtonText } from "../ui/button";
import Animated, {
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

interface AccordionButtonProps {
  onPress?: () => void;
  buttonText?: string;
  chevronChangable?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const AccordionButton = ({
  onPress,
  buttonText,
  chevronChangable = false,
  leftIcon,
}: AccordionButtonProps) => {
  const [focused, setFocused] = useState(false);
  const rotation = useSharedValue(0);

  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
    if (chevronChangable) {
      setFocused((prev) => !prev);
    }
  };

  useEffect(() => {
    rotation.value = withTiming(focused ? 90 : 0, {
      duration: 400,
    });
  }, [focused]);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Button
      onPress={handleOnPress}
      variant="solid"
      action="secondary"
      className="w-full h-12 bg-transparent justify-start mb-2 data-[active=true]:bg-background-200"
    >
      <HStack className="w-full justify-between items-center">
        <HStack space="sm" className="items-center">
          <ButtonIcon
            className="text-primary-500"
            size="xxl"
            as={leftIcon || CircleUserRound}
          />
          <ButtonText className="text-lg font-normal">{buttonText}</ButtonText>
        </HStack>
        <Animated.View style={[rotateStyle]}>
          <ButtonIcon
            as={ChevronRight}
            size="xxl"
            className="text-primary-500"
          />
        </Animated.View>
      </HStack>
    </Button>
  );
};
