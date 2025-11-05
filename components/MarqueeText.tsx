import { Marquee } from "@animatereactnative/marquee";
import { useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Box } from "./ui";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

export const MarqueeText = ({
  text,
  linearGradientColor,
  className,
  textClassName = "text-white font-semibold text-base",
}: {
  text: string;
  linearGradientColor?: string;
  className?: string;
  textClassName?: string;
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [speed, setSpeed] = useState(0.2);

  useEffect(() => {
    setMeasured(!measured);
  }, [textWidth]);

  const marqueePosition = useSharedValue(0);

  const renderTitle = () => {
    if (measured && textWidth > containerWidth - 20) {
      console.log("Text is wider than container, rendering marquee");
      return (
        <Marquee
          spacing={50}
          speed={speed}
          style={{ width: "100%" }}
          position={marqueePosition}
        >
          <Text numberOfLines={1} className={textClassName}>
            {text}
          </Text>
        </Marquee>
      );
    } else {
      return (
        <Text numberOfLines={1} className={textClassName}>
          {text}
        </Text>
      );
    }
  };
  return (
    <Box
      className={"flex-1 overflow-hidden w-full" + className}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
        setMeasured(true);
      }}
    >
      <LinearGradient
        colors={[linearGradientColor || "", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          zIndex: 10,
        }}
      />
      <View className="mx-2 w-full">
        {renderTitle()}
      </View>
      <LinearGradient
        colors={["transparent", linearGradientColor || ""]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 10,
          zIndex: 10,
        }}
      />
      <Text
        style={{ position: "absolute", opacity: 50, left: -9999 }}
        className={textClassName}
        onLayout={(e) => {
          setTextWidth(e.nativeEvent.layout.width);
        }}
      >
        {text}
      </Text>
    </Box>
  );
};
//
