import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground() {
  return (
    <View className="absolute inset-0 overflow-hidden rounded-t-3xl">
      <BlurView 
        intensity={30} 
        tint="light"
        className="absolute inset-0"
      >
        <View className="absolute inset-0 bg-slate-200/50 dark:bg-black/50" />
      </BlurView>
    </View>
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
