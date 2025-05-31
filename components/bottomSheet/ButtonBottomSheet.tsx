import { Heart, LucideIcon } from "lucide-react-native";
import { Button } from "../ui";
import { ButtonIcon, ButtonText } from "../ui/button";
import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";

interface ButtonBottomSheetProps {
  onPress: () => void;
  buttonIcon?: LucideIcon;
  buttonText?: string;
  fillIcon?: boolean;
  stateChangable?: boolean;
}

export default function ButtonBottomSheet(
  {
    onPress,
    buttonIcon = Heart,
    buttonText = "Yêu thích",
    fillIcon = false,
    stateChangable = false,
  }:
  ButtonBottomSheetProps,
) {
  const [isFill, setIsFill] = useState(fillIcon);

  const debouncedOnPress = useDebouncedCallback(onPress, 2000);

  const handleOnPress = () => {
    if (stateChangable) {
      setIsFill(!isFill);
      debouncedOnPress();
    } else {
      onPress();
    }
  }
  return (
    <Button
      onPress={handleOnPress}
      className={buttonStyle}
    >
      <ButtonIcon as={buttonIcon} size="xxl" className={isFill ? buttonIconFillStyle : `text-primary-500`} />
      <ButtonText className={buttonTextStyle}>{buttonText}</ButtonText>
    </Button>
  )
}

const buttonStyle =
  "w-full h-10 pl-1 bg-transparent justify-start border-none data-[active=true]:bg-background-100";
const buttonIconFillStyle =
  "text-primary-500 fill-primary-500";
const buttonTextStyle =
  "pl-4 text-xl font-medium text-primary-500 data-[active=true]:text-primary-500";
