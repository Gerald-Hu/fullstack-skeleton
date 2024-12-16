import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 60;

// Dashboard Screen
export default function HomeScreen() {
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

  return (
    <View className="flex-1 bg-gray-50">
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
          <Text className="text-2xl font-semibold text-gray-800">Sarah</Text>
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
              <Text className="text-gray-500">Day 15 of 90</Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View className="mt-8 px-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</Text>
          
          {/* Task Items */}
          <View className="space-y-4">
            <TaskItem title="Practice scales" duration="30 minutes" />
            <TaskItem title="Learn new piece" duration="45 minutes" />
          </View>

          {/* Add Task Button */}
          <TouchableOpacity className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl h-16 items-center justify-center">
            <Text className="text-gray-500">+ Add Task</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
};

// Task Item Component
const TaskItem = ({ title, duration }) => (
  <View className="bg-white rounded-2xl p-4 flex-row items-center">
    <TouchableOpacity className="h-6 w-6 rounded-full border-2 border-green-500 mr-4" />
    <View>
      <Text className="text-gray-800 font-medium">{title}</Text>
      <Text className="text-gray-500">{duration}</Text>
    </View>
  </View>
);