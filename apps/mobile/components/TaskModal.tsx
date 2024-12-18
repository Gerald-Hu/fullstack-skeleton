import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface Task {
  content: string;
  duration: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, duration: string) => void;
  initialTask?: Task;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.8;
const DISMISS_THRESHOLD = MODAL_HEIGHT * 0.2;

export const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, onSave, initialTask }) => {
  const [taskTitle, setTaskTitle] = useState(initialTask?.content || '');
  const [duration, setDuration] = useState(initialTask?.duration || '1hr');
  const [notes, setNotes] = useState('');
  
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        translateY.value = withSpring(MODAL_HEIGHT);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSave = () => {
    if (!taskTitle || !duration) return;
    onSave(taskTitle, duration);
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
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View 
            style={[animatedStyle]} 
            className="bg-white border-t"
            
          >
            <View className="p-6" style={{ height: MODAL_HEIGHT }}>
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
              
              <Text className="text-2xl font-semibold text-gray-800 mb-6">
                {initialTask ? 'Edit Task' : 'New Task'}
              </Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-500 mb-2">Task Title *</Text>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl"
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="Enter task title"
                  />
                </View>

                <View>
                  <Text className="text-gray-500 mb-2">Duration *</Text>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl"
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="e.g. 1hr, 30min"
                  />
                </View>

                {/* <View>
                  <Text className="text-gray-500 mb-2">Notes</Text>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-xl h-32"
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add any additional notes"
                    multiline
                  />
                </View> */}
              </View>

              <View className="flex-row gap-x-4 mt-8">
                <TouchableOpacity 
                  className="flex-1 p-4 bg-gray-200 rounded-xl" 
                  onPress={onClose}
                >
                  <Text className="text-center text-gray-800">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="flex-1 p-4 bg-green-200 rounded-xl"
                  onPress={handleSave}
                  disabled={!taskTitle || !duration}
                >
                  <Text className="text-center text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};