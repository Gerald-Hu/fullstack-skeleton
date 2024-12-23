import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Keyboard,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

interface Goal {
  content: string;
  durationDays: number;
}

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, durationDays: number) => void;
  initialGoal?: Goal;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.4;
const KEYBOARD_HEIGHT = SCREEN_HEIGHT * 0.8;
const DISMISS_THRESHOLD = 125;

export const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  onClose,
  onSave,
  initialGoal,
}) => {
  const [goalTitle, setGoalTitle] = useState(initialGoal?.content || "");
  const [duration, setDuration] = useState(
    initialGoal?.durationDays?.toString() || ""
  );

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const modalHeight = useSharedValue(DEFAULT_HEIGHT);
  const startY = useSharedValue(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      modalHeight.value = withSpring(KEYBOARD_HEIGHT, {
        stiffness: 200,
        damping: 20,
      });
    });

    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      modalHeight.value = withSpring(DEFAULT_HEIGHT, {
        stiffness: 200,
        damping: 20,
      });
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    translateY.value = 0;
  }, [visible]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      // Only allow dragging downward
      const newTranslateY = startY.value + event.translationY;
      if (newTranslateY < 0) return; // Prevent upward movement
      translateY.value = newTranslateY;
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        translateY.value = withSpring(SCREEN_HEIGHT);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rModalStyle = useAnimatedStyle(() => {
    return {
      height: modalHeight.value,
    };
  });

  const handleDurationChange = (text: string) => {
    // Only allow numbers
    const numbers = text.replace(/\D/g, "");
    setDuration(numbers);
  };

  const handleSave = () => {
    if (!goalTitle || !duration) return;
    onSave(goalTitle, parseInt(duration, 10));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[rStyle, rModalStyle]}
            className="bg-white border-t"
          >
            <View className="p-6" style={{ height: "100%" }}>
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
              <TouchableOpacity
                className="p-2 rounded-full absolute top-2 right-4"
                onPress={onClose}
              >
                <MaterialIcons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>

              <View className="space-y-4">
                <View>
                  <View className="flex-row items-center mb-2">
                    <Feather name="target" size={18} color="#6B7280" />
                    <Text className="text-gray-500 ml-2">
                      What's your goal?
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl"
                    value={goalTitle}
                    onChangeText={setGoalTitle}
                    placeholder="e.g. Learn a new language"
                  />
                </View>

                <View>
                  <View className="flex-row items-center my-2">
                    <Feather name="calendar" size={18} color="#6B7280" />
                    <Text className="text-gray-500 ml-2">
                      How many days to achieve this goal?
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl"
                    value={duration}
                    onChangeText={handleDurationChange}
                    placeholder="e.g. 30 days"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className="flex-row mt-8">
                <TouchableOpacity
                  className={`flex-1 p-4 ${goalTitle && duration ? "bg-blue-600" : "bg-blue-200"} rounded-xl`}
                  onPress={handleSave}
                  disabled={!goalTitle || !duration}
                >
                  <Text className="border-2 rounded-full w-6 h-6 self-center border-white" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};
