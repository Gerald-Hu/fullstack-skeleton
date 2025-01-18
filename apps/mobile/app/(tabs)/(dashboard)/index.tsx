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
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useStore } from "@store/index";
import { TaskModal } from "@components/TaskModal";
import { GoalModal } from "@components/GoalModal";
import { GoalCarousel } from "@components/GoalCarousel";
import { Task } from "@/trpc-services/task";
import { TaskItem } from "@components/TaskItem";
import { Header } from "@components/ui/Header";
import * as Haptics from "expo-haptics";

const HEADER_HEIGHT = 60;
const OPEN_GOAL_MODAL_THRESHOLD = 100;

export default function HomeScreen() {
  const { createTask, fetchTasks, tasks, deleteTask, updateTask } = useStore(
    (state) => state.task
  );

  const { user } = useStore((state) => state.auth);

  const { fetchGoals, createGoal, deleteGoal, goals, updateGoal, suggestTask } =
    useStore((state) => state.goal);

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);

  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const addRandomGoal = async () => {
    await createGoal("Some Goal", 20);
    await fetchGoals();
  };

  const removeGoal = async (goalId: string) => {
    await deleteGoal(goalId);
    await fetchGoals();
  };

  const openTaskModal = (task?: Task) => {
    // Do not vibrate if editing task, as haptic feedback was already given
    if (task == null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEditingTask(task || null);
    setTaskModalVisible(true);
  };

  const openGoalModal = (goal?: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingGoal(goal || null);
    setGoalModalVisible(true);
  };

  const closeTaskModal = () => {
    setTaskModalVisible(false);
    setEditingTask(null);
  };

  const closeGoalModal = () => {
    setGoalModalVisible(false);
    setEditingGoal(null);
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

  const handleSaveGoal = async (content: string, durationDays: number) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, { content, durationDays });
      } else {
        await createGoal(content, durationDays);
      }
      await fetchGoals();
      closeGoalModal();
    } catch (error) {
      console.error("Error saving goal:", error);
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

  const handleToggleTaskState = async (taskId: string) => {
    try {
      if (tasks.find((task) => task.id === taskId)?.status === "completed") {
        await updateTask(taskId, { status: "pending" });
        await fetchTasks();
      } else {
        await updateTask(taskId, { status: "completed" });
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const suggestTaskAndFetchTasks = async (goalId: string) => {
    try {
      await suggestTask(goalId);
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task with ai:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return (
    <View className="flex-1 bg-[#f1f2f3]">
      {taskModalVisible && (
        <TaskModal
          visible={taskModalVisible}
          onClose={closeTaskModal}
          onSave={handleSaveTask}
          initialTask={editingTask || undefined}
        />
      )}

      {goalModalVisible && (
        <GoalModal
          visible={goalModalVisible}
          onClose={closeGoalModal}
          onSave={handleSaveGoal}
          initialGoal={editingGoal}
        />
      )}

      {/* <Header title="Plans" scrollY={scrollY} headerHeight={HEADER_HEIGHT} /> */}

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Greeting and action button */}
        <View className="px-6 mb-4 flex flex-row justify-between items-center" style={{ paddingTop: insets.top + 4 }}>
          <View>
            <Text className="text-black font-semibold">Good morning!</Text>
            {/* <Text className="text-2xl font-semibold text-gray-800">
            {user?.name?.split(" ")[0]}
          </Text> */}
            <Text className="font-semibold pt-1 text-sm text-[#8c8686]">
              January 15
            </Text>
          </View>
          <View>
            <Pressable>
              <View className="w-[52px] h-[29px] bg-white rounded-full border border-[#ebd7d7]">
              </View>
            </Pressable>
          </View>
        </View>

        {/* Main Goal Cards */}
        <GoalCarousel
          goals={goals}
          onOpenGoalModal={openGoalModal}
          onRemoveGoal={removeGoal}
          onUpdateGoal={(goalId) => {
            const goal = goals.find((g) => g.id === goalId);
            if (goal) {
              openGoalModal(goal);
            }
          }}
          onSuggestTasks={suggestTaskAndFetchTasks}
          OPEN_GOAL_MODAL_THRESHOLD={OPEN_GOAL_MODAL_THRESHOLD}
        />

        {/* Tasks Section */}
        <View className="mt-2 px-6">
          <Text className="font-semibold text-gray-800 mb-4">
            Today's Plans
          </Text>

          {/* Ongoing Task List */}
          <View>
            {tasks
              .filter((task) => task.status !== "completed")
              .map((task) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  title={task.content}
                  duration={task.duration}
                  status={task.status}
                  onDelete={handleDeleteTask}
                  onToggleState={handleToggleTaskState}
                  onEdit={() => openTaskModal(task)}
                />
              ))}

            {tasks.length === 0 && (
              <Text className="text-gray-500">You have no tasks today</Text>
            )}
          </View>

          {/* Add Task Button */}
          {/* TODO: Remove this cta and move it to the bottom tabber */}
          {/* <TouchableOpacity
            className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl h-16 items-center justify-center"
            onPress={() => openTaskModal()}
          >
            <Text className="text-gray-400 text-xl font-bold">+</Text>
          </TouchableOpacity> */}
        </View>

        {tasks.filter((task) => task.status === "completed").length > 0 && (
          <View className="mt-4 mx-6 border-t border-t-[#e3e3e3] pt-6 rounded-xl">
            {/* Completed Task List */}
            <View>
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.content}
                    duration={task.duration}
                    status={task.status}
                    onDelete={handleDeleteTask}
                    onToggleState={handleToggleTaskState}
                    onEdit={() => openTaskModal(task)}
                  />
                ))}

              {tasks.length === 0 && (
                <Text className="text-gray-500">You have no tasks today</Text>
              )}
            </View>
          </View>
        )}

        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}
