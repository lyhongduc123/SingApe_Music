import { useNavigation } from 'expo-router';
import { Pressable, View, Text, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, LucideIcon } from 'lucide-react-native';
import clsx from 'clsx';
import { Icon } from './ui/icon';
import { Button, HStack } from './ui';
import { ButtonIcon } from './ui/button';
import { Heading } from './ui/heading';

type Props = {
  title?: string;
  showBack?: boolean;
  backIcon?: LucideIcon;
  onBackPress?: () => void;
  centerTitle?: boolean;
  right?: React.ReactNode;
  titleClassName?: string;
  headerClassName?: string;
  style?: ViewStyle;
};

export default function CustomHeader({
  title,
  showBack = false,
  backIcon = ArrowLeft,
  centerTitle = false,
  right,
  titleClassName = 'text-lg font-semibold text-black dark:text-white',
  headerClassName = 'bg-background-0 dark:bg-background-0',
  style,
}: Props) {
  const navigation = useNavigation();

  return (
    <View
      className={clsx("flex-row items-center gap-4", headerClassName)}
      style={[
        {
          height: 56,
        },
        style,
      ]}
    >
        {showBack ? (
            <View className="w-fit">
          <Button
            onPress={() => {navigation.goBack()}}
            className="bg-transparent border-none rounded-full data-[active=true]:bg-background-200 w-12 h-12"
          >
            <ButtonIcon as={backIcon} size="xxl" className="text-primary-500" />
          </Button>
          </View>
        ): null}

      {/* Title */}
      <View className={clsx('flex-1', centerTitle && 'items-center absolute left-0 w-full')}>
        {!!title && <Heading className={clsx(titleClassName)}>{title}</Heading>}
      </View>

      {/* Right */}
      <HStack className="items-end justify-center bg-transparent">{right}</HStack>
    </View>
  );
}
