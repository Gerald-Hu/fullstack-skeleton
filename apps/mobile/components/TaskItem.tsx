import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
  withTiming,
  withDelay,
  withSequence,
  Layout,
  FadeOut,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Task } from "@/trpc-services/task";
import * as Haptics from "expo-haptics";

interface TaskItemProps {
  title: string;
  duration: string;
  id: string;
  onDelete?: (id: string) => void;
  onToggleState?: (id: string) => void;
  onEdit?: (id: string) => void;
  status: Task["status"];
}

const SWIPE_THRESHOLD_MIN = -50;
const SWIPE_THRESHOLD_MAX = 50;
const ANIMATION_DURATION = 150;

export const TaskItem = ({
  title,
  duration,
  id,
  onDelete,
  onToggleState,
  onEdit,
  status,
}: TaskItemProps) => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const [hapticActivated, setHapticActivated] = useState(true);
  const itemHeight = useSharedValue<string | number>("auto");
  const opacity = useSharedValue(1);

  const handleDelete = async (taskId: string) => {
    // Start exit animation
    opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    itemHeight.value = withTiming(0, { duration: ANIMATION_DURATION });

    // Wait for animation to complete before actual deletion
    setTimeout(() => {
      if (onDelete) {
        onDelete(taskId);
      }
    }, ANIMATION_DURATION);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      const newTranslateX = event.translationX + context.value.x;
      translateX.value = Math.min(SWIPE_THRESHOLD_MAX, Math.max(newTranslateX, SWIPE_THRESHOLD_MIN));
      if (translateX.value === SWIPE_THRESHOLD_MIN && hapticActivated) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(setHapticActivated)(false);
      }else if (translateX.value === SWIPE_THRESHOLD_MAX && hapticActivated) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(setHapticActivated)(false);
      }
      else if (translateX.value > SWIPE_THRESHOLD_MIN && translateX.value < SWIPE_THRESHOLD_MAX) {
        runOnJS(setHapticActivated)(true);
      }
    })
    .onEnd(() => {
      if (translateX.value === SWIPE_THRESHOLD_MIN) {
        if (onDelete) {
          runOnJS(handleDelete)(id);
        }
      }else if(translateX.value === SWIPE_THRESHOLD_MAX) {
        if (onEdit) {
          runOnJS(onEdit)(id);
        }
        translateX.value = withDelay(ANIMATION_DURATION, withSpring(0, { damping: 50 }));
      }else {
        translateX.value = withSpring(0, { damping: 50 });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const rDeleteStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [SWIPE_THRESHOLD_MIN, -22, 0], [1.05, 0, 0]);
    return {
      transform: [{ scale }],
    };
  });

  const rEditStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [0, 22, SWIPE_THRESHOLD_MAX], [0, 0, 1.05]);
    return {
      transform: [{ scale }],
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value === 0 ? 0 : "auto",
      opacity: opacity.value,
      marginBottom: withTiming(itemHeight.value === 0 ? 0 : 8, {
        duration: ANIMATION_DURATION,
      }),
    };
  });

  return (
    <Animated.View style={rContainerStyle} layout={Layout.springify()}>
      <View className="relative">

        <View className="absolute right-0 top-0 bottom-0 flex-row items-center justify-end rounded-2xl overflow-hidden">
          <TouchableOpacity
            className="size-6 rounded-full border-2 border-red-800 mr-2 relative overflow-hidden"
            onPress={() => handleDelete(id)}
          >
            <Animated.View
              style={[
                rDeleteStyle,
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 100,
                  backgroundColor: "#991B1B",
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View className="absolute left-0 top-0 bottom-0 flex-row items-center justify-end rounded-2xl overflow-hidden">
          <TouchableOpacity
            className="size-6 rounded-full border-2 border-blue-600 ml-2 relative overflow-hidden"
            onPress={() => handleDelete(id)}
          >
            <Animated.View
              style={[
                rEditStyle,
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 100,
                  backgroundColor: "#2563eb",
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={rStyle}
            className={`${status === "completed" ? "bg-[#6d6d6d]" : "bg-[#fefefe]"} rounded-2xl p-4 flex-row items-center`}
          >
            <TouchableOpacity
              className={`h-8 w-8 rounded-full mr-4 items-center justify-center ${status === "completed" ? "bg-[#352929]" : "bg-[#d9d9d9]"}`}
              onPress={() => onToggleState && onToggleState(id)}
            >
              {status === "completed" && (
                <Feather name="check" size={20} color="white" />
              )}
            </TouchableOpacity>
            <View className="flex-1">
              <Text className={`font-medium break-all mb-1 ${status === "completed" ? "line-through text-[#b0b0b0]" : "text-gray-800"}`}>
                {title}
              </Text>
              <Text className="text-[#979797] text-sm">{duration}</Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
};
