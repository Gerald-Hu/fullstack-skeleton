import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Pressable,
} from "react-native";
import { Goal } from "@/trpc-services/goal";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ActionMenu } from "./ActionMenu";

interface GoalCarouselProps {
  goals: Goal[];
  onOpenGoalModal: (goal?: Goal) => void;
  onRemoveGoal: (goalId: string) => void;
  onUpdateGoal: (goalId: string) => void;
  onSuggestTasks: (goalId: string) => void;
  OPEN_GOAL_MODAL_THRESHOLD: number;
}

export const GoalCarousel: React.FC<GoalCarouselProps> = ({
  goals,
  onOpenGoalModal,
  onRemoveGoal,
  onUpdateGoal,
  onSuggestTasks,
  OPEN_GOAL_MODAL_THRESHOLD,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const CARD_WIDTH = SCREEN_WIDTH - 32;
  
  const scrollProgress = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / CARD_WIDTH);
    setActiveCard(index);

    // Calculate scroll progress for the last card
    const maxScroll = CARD_WIDTH * (goals.length - 1);
    const overscrollAmount = Math.max(0, contentOffset - maxScroll - 20);
    scrollProgress.value = Math.min(1, overscrollAmount / OPEN_GOAL_MODAL_THRESHOLD);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollProgress.value,
        [0, 1],
        ['rgb(229, 231, 235)', 'rgb(34, 197, 94)']  // from gray-200 to green-500
      ),
      borderColor: interpolateColor(
        scrollProgress.value,
        [0, 1],
        ['rgb(34, 197, 94)', 'rgb(229, 231, 235)']
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        scrollProgress.value,
        [0, 1],
        ['rgb(156, 163, 175)', 'rgb(255, 255, 255)']  // from gray-400 to white
      ),
    };
  });

  if (goals.length === 0) {
    return (
      <View className="px-6">
        <Text className="text-gray-500" onPress={() => onOpenGoalModal()}>
          You have no goals yet.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        className="overflow-visible"
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        onScrollEndDrag={(event) => {
          setScrolling(false);
          if (
            event.nativeEvent.contentOffset.x >
            CARD_WIDTH * (goals.length - 1) + OPEN_GOAL_MODAL_THRESHOLD
          ) {
            onOpenGoalModal();
          }
        }}
        onScrollBeginDrag={() => setScrolling(true)}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {goals.map((goal) => (
          <View
            key={goal.id}
            style={{ width: CARD_WIDTH }}
            className="px-2 py-2"
          >
            <View className="w-full bg-[#352929] rounded-3xl p-6">
              <View className="absolute right-2 top-2">
                <ActionMenu
                  onDelete={() => onRemoveGoal(goal.id)}
                  onUpdate={() => onUpdateGoal(goal.id)}
                  onSuggest={() => onSuggestTasks(goal.id)}
                />
              </View>
              <View className="flex-row items-center">
                {/* Progress Circle */}
                <View className="h-20 w-20 rounded-full border-2 border-gray-100 items-center justify-center">
                  <View
                    className="h-20 w-20 rounded-full border-2 border-orange-500 absolute"
                    style={{
                      borderTopColor: "transparent",
                      transform: [{ rotate: "-45deg" }],
                    }}
                  />
                  <Text className="text-lg text-white font-semibold">{75}%</Text>
                </View>

                <View className="ml-6 flex-1">
                  <Text
                    className="text-xl font-semibold text-white break-all line-clamp-2 mb-2"
                  >
                    {goal.content}
                  </Text>
                  <Text className="text-[#d9d9d9] text-sm">
                    Day {15} of {goal.durationDays}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {scrolling && (
          <Animated.View 
            className="items-center justify-center ml-16 my-2 p-6 border-2 rounded-3xl"
            style={animatedButtonStyle}
          >
            <Animated.Text 
              className="text-xl font-bold"
              style={animatedTextStyle}
            >
              +
            </Animated.Text>
          </Animated.View>
        )}
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
  );
};
