import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useStore } from '@store/index';
import { TaskModal } from '@components/TaskModal';
import { Task } from '@/trpc-services/task';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const HEADER_HEIGHT = 60;

// Dashboard Screen
export default function HomeScreen() {

  const {user, createTask, fetchTasks, tasks, deleteTask, updateTask} = useStore();

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, 1],
    );

    return {
      opacity,
    };
  });

  const openTaskModal = (task?: Task) => {
    setEditingTask(task || null);
    setTaskModalVisible(true);
  }

  const closeTaskModal = () => {
    setTaskModalVisible(false);
    setEditingTask(null);
  }

  const handleSaveTask = async (content: string, duration: string) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, { content, duration });
      } else {
        await createTask(content, "pending");
      }
      await fetchTasks();
      closeTaskModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: "completed" });
      await fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Task Modal */}
      {taskModalVisible && (
        <TaskModal 
          visible={taskModalVisible} 
          onClose={closeTaskModal} 
          onSave={handleSaveTask}
          initialTask={editingTask || undefined}
        />
      )}
      
      {/* Animated Header */}
      <Animated.View 
        style={[headerAnimatedStyle]} 
        className="absolute top-0 left-0 right-0 z-10"
        pointerEvents="box-none"
      >
        <BlurView 
          intensity={30}
          tint="light"
          className="w-full overflow-hidden border-b border-b-gray-800"
          style={{ paddingTop: insets.top, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          <View className="h-14 justify-center px-6">
            <Text className="text-center text-xl font-semibold text-gray-800">Dashboard</Text>
          </View>
        </BlurView>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {/* Header */}
        <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
          <Text className="text-gray-500">Good morning,</Text>
          <Text className="text-2xl font-semibold text-gray-800">{user?.name?.split(" ")[0]}</Text>
        </View>

        {/* Main Goal Card */}
        <View className="mx-4 bg-white rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center">
            {/* Progress Circle - Using border for circle */}
            <View className="h-20 w-20 rounded-full border-4 border-gray-100 items-center justify-center">
              <View className="h-20 w-20 rounded-full border-4 border-green-500 absolute" style={{ borderTopColor: 'transparent', transform: [{ rotate: '-45deg' }] }} />
              <Text className="text-lg font-semibold">35%</Text>
            </View>
            
            <View className="ml-6">
              <Text className="text-gray-500">Current Goal</Text>
              <Text className="text-xl font-semibold text-gray-800">Learn Piano</Text>
              <Text className="text-gray-500">Day 18 of 90</Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View className="mt-8 px-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</Text>
          
          {/* Task List */}
          <View className="gap-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.content}
                duration={task.duration}
                status={task.status}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
                onEdit={() => openTaskModal(task)}
              />
            ))}
          </View>

          {/* Add Task Button */}
          <TouchableOpacity className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl h-16 items-center justify-center" onPress={() => openTaskModal()}>
            <Text className="text-gray-500">+ Add Task</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
};

interface TaskItemProps {
  title: string;
  duration: string;
  id: string;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

const SWIPE_THRESHOLD = -75;

const TaskItem = ({ title, duration, id, onDelete, onComplete, onEdit, status }: TaskItemProps) => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      const newTranslateX = event.translationX + context.value.x;
      translateX.value = Math.min(0, Math.max(newTranslateX, -150));
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-150, { damping: 50 });
      } else {
        translateX.value = withSpring(0, { damping: 50 });
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="relative">
      {/* Background Actions */}
      <View className="absolute right-0 top-0 bottom-0 flex-row items-center justify-end bg-white rounded-2xl overflow-hidden">
        <TouchableOpacity className="h-full w-[75px] bg-blue-500 items-center justify-center">
          <Feather name="edit-2" size={20} color="white" />
          <Text className="text-white text-xs mt-1">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity className="h-full w-[75px] bg-red-500 items-center justify-center">
          <Feather name="trash-2" size={20} color="white" />
          <Text className="text-white text-xs mt-1">Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={rStyle} className="bg-white rounded-2xl p-4 flex-row items-center">
          <TouchableOpacity className="h-6 w-6 rounded-full border-2 border-green-500 mr-4" onPress={() => onComplete && onComplete(id)}/>
          <TouchableOpacity className="h-6 w-6 rounded-full border-2 border-red-800 mr-4" onPress={() => onDelete && onDelete(id)}/>
          <TouchableOpacity className="h-6 w-6 rounded-full border-2 border-blue-500 mr-4" onPress={() => onEdit && onEdit(id)}/>
          <View className='flex-1'>
            <Text className="text-gray-800 font-medium break-all">{title} {status === "completed" && "(Completed)"}</Text>
            <Text className="text-gray-500">{duration}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};