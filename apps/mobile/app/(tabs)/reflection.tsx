import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ReflectionScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
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

      {/* Input Area */}
      <View className="p-4 border-t border-gray-100 bg-white">
        <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2">
          <TextInput 
            placeholder="Share your thoughts..."
            className="flex-1 h-10"
          />
          <TouchableOpacity className="h-10 w-10 bg-green-500 rounded-full items-center justify-center ml-2">
            <Feather name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Mood Button Component
const MoodButton = ({ icon, color }) => (
  <TouchableOpacity 
    className="h-12 w-12 rounded-full items-center justify-center"
    style={{ backgroundColor: color }}
  >
    <Feather name={icon} size={24} color="white" />
  </TouchableOpacity>
);