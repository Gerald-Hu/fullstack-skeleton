import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import * as Haptics from "expo-haptics";

export default function ChatReflection() {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useSharedValue(0);
  const isKeyboardOpen = useSharedValue(0);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', (e) => {
      keyboardHeight.value = withSpring(e.endCoordinates.height, {
        damping: 20,
        stiffness: 200,
        mass: 0.6
      });
      isKeyboardOpen.value = withSpring(1, {
        damping: 20,
        stiffness: 200,
        mass: 0.6
      });
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
       
      });
      isKeyboardOpen.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
       
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const animatedInputStyle = useAnimatedStyle(() => {
    const bottomPadding = interpolate(
      isKeyboardOpen.value,
      [0, 1],
      [96, 0] // 96 = 24rem (bottom-24)
    );

    return {
      transform: [{ translateY: -keyboardHeight.value }],
      bottom: bottomPadding,
    };
  });

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-neutral-50 relative"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Header */}
        <View className="p-6 pt-12">
          <Text className="text-xl font-semibold text-gray-800">Daily Reflection</Text>
          <Text className="text-gray-500">December 15, 2024</Text>
        </View>

        {/* Chat Area */}
        <View className="p-4 space-y-4">
          {/* AI Message */}
          <View className="bg-white rounded-2xl p-4 ml-0 mr-12">
            <Text className="text-gray-800">
              How was your practice session today? I noticed you scheduled 75 minutes of piano practice.
            </Text>
          </View>

          {/* User Message */}
          <View className="bg-green-50 rounded-2xl p-4 ml-12 mr-0">
            <Text className="text-gray-800">
              I completed the scales but struggled with the new piece.
            </Text>
          </View>

          {/* AI Follow-up */}
          <View className="bg-white rounded-2xl p-4 ml-0 mr-12">
            <Text className="text-gray-800">
              I understand. Let's break down the new piece into smaller sections. What part was most challenging?
            </Text>
          </View>
        </View>

        {/* Mood Tracker */}
        <View className="mx-4 bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-500 mb-4">How do you feel about today's progress?</Text>
          <View className="flex-row justify-around">
            <MoodButton icon="sun" color="#FFD700" />
            <MoodButton icon="smile" color="#4CAF50" />
            <MoodButton icon="meh" color="#2196F3" />
            <MoodButton icon="frown" color="#9E9E9E" />
          </View>
        </View>
      </ScrollView>

      {/* Input Area - Fixed at bottom with smooth animation */}
      <Animated.View 
        className="absolute left-0 w-full bg-gray-50"
        style={animatedInputStyle}
      >
        <View className="p-4">

          <View className="flex-row items-end bg-gray-200 rounded-2xl px-4 py-2 border border-gray-300">
            <TextInput 
              placeholder="Share your thoughts..."
              className="flex-1 max-h-32 py-2"
              multiline
              textAlignVertical="top"
              style={{ lineHeight: 20 }}
              onPressIn={(ev) => {
                if (process.env.EXPO_OS === "ios") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                ev.preventDefault();
              }}
            />
            <TouchableOpacity className="h-8 w-8 bg-green-500 rounded-full items-center justify-center ml-2 mb-1">
              <Feather name="arrow-up" size={16} color="white" />
            </TouchableOpacity>

            <View className='absolute -bottom-1 left-0 h-96 w-screen  bg-gray-50 translate-y-full'/>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

// Mood Button Component
const MoodButton = ({ icon, color }: {icon: keyof typeof Feather.glyphMap; color: string}) => (
  <TouchableOpacity 
    className="h-12 w-12 rounded-full items-center justify-center"
    style={{ backgroundColor: color }}
  >
    <Feather name={icon} size={24} color="white" />
  </TouchableOpacity>
);
