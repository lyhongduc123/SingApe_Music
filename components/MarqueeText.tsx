import { Marquee } from "@animatereactnative/marquee";

export const MarqueeText = ({
  text,
  style,
  duration = 10000,
  loop = true,
}: {
  text: string;
  style?: object;
  duration?: number;
  loop?: boolean;
}) => {
  return (
    <Marquee
      style={[{ fontSize: 16, color: "#000" }, style]}
      duration={duration}
      loop={loop}
      marqueeOnStart={false}
      marqueeDelay={1000}
      marqueeStyle={{ fontSize: 16 }}
    >
      {text}
    </Marquee>
  );
};
//
