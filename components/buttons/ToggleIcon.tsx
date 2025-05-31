import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from './../ui';
import { CircleArrowDown, CircleCheck } from 'lucide-react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const ToggleIcon = () => {
  const [active, setActive] = useState(false);
  const opacityDown = useSharedValue(1);
  const opacityCheck = useSharedValue(0);

  const handlePress = () => {
    setActive(!active);
    opacityDown.value = withTiming(active ? 1 : 0, { duration: 300 });
    opacityCheck.value = withTiming(active ? 0 : 1, { duration: 300 });
  };

  const styleDown = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: opacityDown.value,
  }));

  const styleCheck = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: opacityCheck.value,
  }));

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={styleDown}>
        <Icon as={CircleArrowDown} size="xl" className="text-primary-500" />
      </Animated.View>
      <Animated.View style={styleCheck}>
        <Icon as={CircleCheck} size="xl" className="text-green-500" />
      </Animated.View>
    </TouchableOpacity>
  );
};
