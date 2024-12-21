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
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";

interface Task {
  content: string;
  duration: string;
}

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, duration: string) => void;
  initialTask?: Task;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.4;
const KEYBOARD_HEIGHT = SCREEN_HEIGHT * 0.8;
const DISMISS_THRESHOLD = 125;

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
}) => {
  const [taskTitle, setTaskTitle] = useState(initialTask?.content || "");
  const [duration, setDuration] = useState(
    initialTask?.duration?.replace(/\D/g, "") || ""
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
    if (!taskTitle || !duration) return;
    onSave(taskTitle, `${duration} mins`);
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

              <View className="space-y-4">
                <View>
                  <View className="flex-row items-center mb-2">
                    <Feather name="edit-3" size={18} color="#6B7280" />
                    <Text className="text-gray-500 ml-2">
                      What's on your mind?
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl"
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="e.g. Morning meditation"
                  />
                </View>

                <View>
                  <View className="flex-row items-center my-2">
                    <Feather name="clock" size={18} color="#6B7280" />
                    <Text className="text-gray-500 ml-2">
                      How long will it take in minutes?
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl"
                    value={duration}
                    onChangeText={handleDurationChange}
                    placeholder="e.g. 30min"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className="flex-row mt-8">
                <TouchableOpacity
                  className={`flex-1 p-4 ${taskTitle && duration ? "bg-green-600" : "bg-green-200"} rounded-xl`}
                  onPress={handleSave}
                  disabled={!taskTitle || !duration}
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
