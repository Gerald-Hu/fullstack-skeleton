import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useStore } from "@store/index";
import { TaskModal } from "@components/TaskModal";
import { Task } from "@/trpc-services/task";
import { TaskItem } from "@components/TaskItem";
import { Header } from "@components/ui/Header";
import * as Haptics from "expo-haptics";

const HEADER_HEIGHT = 60;

export default function HomeScreen() {
  const { user, createTask, fetchTasks, tasks, deleteTask, updateTask } =
    useStore();

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [activeCard, setActiveCard] = useState(0);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const CARD_WIDTH = SCREEN_WIDTH - 32; // 32 = padding-x-4 (16 * 2)

  const goals = [
    {
      id: 1,
      title: "Learn Piano and Improvise Music for Fun and Relaxation",
      progress: 35,
      currentDay: 18,
      totalDays: 90,
    },
    {
      id: 2,
      title: "Master React Native Development",
      progress: 65,
      currentDay: 45,
      totalDays: 60,
    },
    {
      id: 3,
      title: "Read 12 Books This Year",
      progress: 25,
      currentDay: 3,
      totalDays: 12,
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / CARD_WIDTH);
    setActiveCard(index);
  };

  const openTaskModal = (task?: Task) => {
    // Do not vibrate if editing task, as haptic feedback was already given
    if (task == null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEditingTask(task || null);
    setTaskModalVisible(true);
  };

  const closeTaskModal = () => {
    setTaskModalVisible(false);
    setEditingTask(null);
  };

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
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: "completed" });
      await fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <View className="flex-1 bg-gray-50">
      {taskModalVisible && (
        <TaskModal
          visible={taskModalVisible}
          onClose={closeTaskModal}
          onSave={handleSaveTask}
          initialTask={editingTask || undefined}
        />
      )}

      <Header title="Plans" scrollY={scrollY} headerHeight={HEADER_HEIGHT} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Greeting */}
        <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
          <Text className="text-gray-500">Good morning,</Text>
          <Text className="text-2xl font-semibold text-gray-800">
            {user?.name?.split(" ")[0]}
          </Text>
        </View>

        {/* Main Goal Cards */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {goals.map((goal) => (
              <View
                key={goal.id}
                style={{ width: CARD_WIDTH }}
                className="px-2 py-2"
              >
                <View className="w-full bg-white rounded-3xl p-6 shadow-sm">
                  <View className="flex-row items-center">
                    {/* Progress Circle */}
                    <View className="h-20 w-20 rounded-full border-4 border-gray-100 items-center justify-center">
                      <View
                        className="h-20 w-20 rounded-full border-4 border-green-500 absolute"
                        style={{
                          borderTopColor: "transparent",
                          transform: [{ rotate: "-45deg" }],
                        }}
                      />
                      <Text className="text-lg font-semibold">
                        {goal.progress}%
                      </Text>
                    </View>

                    <View className="ml-6 flex-1">
                      <Text className="text-xl font-semibold text-gray-800 break-all line-clamp-2 mb-2">
                        {goal.title}
                      </Text>
                      <Text className="text-gray-500">
                        Day {goal.currentDay} of {goal.totalDays}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Page Indicator */}
          {goals.length > 1 && (
            <View className="flex-row justify-center mt-4">
              {goals.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    index === activeCard ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Today's Tasks */}
        <View className="mt-8 px-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Today's Plans
          </Text>

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
          <TouchableOpacity
            className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl h-16 items-center justify-center"
            onPress={() => openTaskModal()}
          >
            <Text className="text-gray-400 text-xl font-bold">+</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}
