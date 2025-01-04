import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  withSpring,
  useAnimatedStyle,
  withSequence,
  withDelay,
  useSharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface ActionMenuProps {
  onDelete: () => void;
  onUpdate: () => void;
  onSuggest: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ActionMenu = ({
  onDelete,
  onUpdate,
  onSuggest,
}: ActionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const scale1 = useSharedValue(0);
  const scale2 = useSharedValue(0);
  const scale3 = useSharedValue(0);

  const showMenu = () => {
    setVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale1.value = withSequence(withSpring(1.2), withSpring(1));
    scale2.value = withDelay(50, withSequence(withSpring(1.2), withSpring(1)));
    scale3.value = withDelay(100, withSequence(withSpring(1.2), withSpring(1)));
  };

  const hideMenu = () => {
    scale1.value = withSpring(0);
    scale2.value = withSpring(0);
    scale3.value = withSpring(0);
    setTimeout(() => setVisible(false), 200);
  };

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));

  return (
    <View>
      <Pressable
        className="p-2 rounded-full"
        onPress={() => (visible ? hideMenu() : showMenu())}
      >
        {!visible && (
          <MaterialIcons name="more-vert" size={20} color="#6B7280" />
        )}
        {visible && <MaterialIcons name="close" size={20} color="#6B7280" />}
      </Pressable>

      {visible && (
        <>
          <View className="absolute -left-16 -top-4 z-50">
          <AnimatedPressable
              style={animatedStyle1}
              className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center shadow-sm"
              onPress={() => {
                onUpdate();
                hideMenu();
              }}
            >
              <MaterialIcons name="edit" size={18} color="white" />
            </AnimatedPressable>
          </View>

          <View className="absolute -left-12 top-9 z-50">
            
            <AnimatedPressable
              style={animatedStyle2}
              className="w-10 h-10 rounded-full bg-purple-500 items-center justify-center shadow-sm"
              onPress={() => {
                onSuggest();
                hideMenu();
              }}
            >
              <MaterialIcons name="psychology" size={18} color="white" />
            </AnimatedPressable>
          </View>

          <View className="absolute left-0 top-16 z-50">
            <AnimatedPressable
              style={animatedStyle3}
              className="size-10 rounded-full bg-red-500 items-center justify-center shadow-sm"
              onPress={() => {
                onDelete();
                hideMenu();
              }}
            >
              <MaterialIcons name="delete" size={18} color="white" />
            </AnimatedPressable>
          </View>
        </>
      )}
    </View>
  );
};
