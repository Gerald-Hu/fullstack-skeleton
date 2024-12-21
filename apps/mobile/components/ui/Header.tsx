import { View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

interface HeaderProps {
  title: string;
  scrollY: Animated.SharedValue<number>;
  headerHeight?: number;
}

export const Header = ({ title, scrollY, headerHeight = 60 }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, headerHeight], [0, 1]);

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[headerAnimatedStyle]}
      className="absolute top-0 left-0 right-0 z-10"
      pointerEvents="box-none"
    >
      <BlurView
        intensity={30}
        tint="light"
        className="w-full overflow-hidden border-b border-b-gray-800"
        style={{
          paddingTop: insets.top,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <View className="h-14 justify-center px-6">
          <Text className="text-center text-xl font-semibold text-gray-800">
            {title}
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};
