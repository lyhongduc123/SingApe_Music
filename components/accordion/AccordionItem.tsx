import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: string;
  style?: object;
  duration?: number;
}

export const AccordionItem = ({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 300,
}: AccordionItemProps) => {
  const measuredHeight = useSharedValue(0);
  const [measured, setMeasured] = useState(false);

  const animatedHeight = useDerivedValue(() => {
    return withTiming(isExpanded.value ? measuredHeight.value : 0, {
      duration,
    });
  });

  useEffect(() => {
    setMeasured(false);
    measuredHeight.value = 0;
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    overflow: 'hidden',
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    if (!measured) {
      measuredHeight.value = event.nativeEvent.layout.height;
      setMeasured(true);
    }
  };

  return (
    <>
      {/* Invisible view to measure content height once */}
      {!measured && (
        <View
          style={styles.invisible}
          onLayout={onLayout}
        >
          {children}
        </View>
      )}

      {/* Animated view that toggles height */}
      <Animated.View
        key={`accordionItem_${viewKey}`}
        style={[animatedStyle, style]}
      >
        {/* Content is always rendered here */}
        {children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  invisible: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    left: 0,
    right: 0,
  },
});
