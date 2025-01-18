import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { View, Pressable } from "react-native";
import { Text } from "@/components/Themed";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

export function HapticTab({
  accessibilityState,
  onPress,
  children,
  ...props
}: BottomTabBarButtonProps) {
  const isSelected = accessibilityState?.selected;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isSelected ? 1.1 : 1, {
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  }, [isSelected]);

  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPress={onPress}
      className={` ${isSelected ? "opacity-100" : "opacity-60"}`}
    >
      <AnimatedView style={animatedStyle} className="items-center">
        <View className={`-translate-y-2 ${isSelected ? "border-b" : ""}`}>{children}</View>
      </AnimatedView>
    </Pressable>
  );
}
