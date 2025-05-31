import { View, Animated, Easing, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

export default function PlayingBars({
  width = 4,
  height = 16,
  color = 'rgb(34,197,94)', // Tailwind green-500
  barCount = 3,
  wapperWidth = 20,
  wapperHeight = 20,
  className="absolute",
  running = true,
}: {
  width?: number;
  height?: number;
  wapperWidth?: number;
  wapperHeight?: number;
  color?: string;
  barCount?: number;
  running?: boolean;
  className?: string;
}) {
  const bars = Array.from({ length: barCount }, () => useRef(new Animated.Value(0)).current);

  const animate = (bar: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bar, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(bar, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  };

  const animateReset = (bar: Animated.Value) => {
    Animated.timing(bar, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  useEffect(() => {
    if (!running) bars.forEach((bar) => animateReset(bar));
    else bars.forEach((bar, i) => animate(bar, i * 150));
  }, [running]);

  return (
    <View style={[styles.container, {width: wapperWidth, height: wapperHeight}]} className={className}>
      {/* Animated bars */}
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={{
            width,
            marginHorizontal: 1,
            backgroundColor: color,
            borderRadius: width / 2,
            height: bar.interpolate({
              inputRange: [0, 1],
              outputRange: [4, height],
            }),
            alignSelf: 'flex-end',
          }}
        />
      ))}
      {/* Baseline */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
});
