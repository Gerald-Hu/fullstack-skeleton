import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GoalHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <BlurView 
        intensity={30}
        tint="light"
        className="border-b border-gray-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="h-14 flex-row items-center px-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-gray-800 mr-6">
            Goal History
          </Text>
        </View>
      </BlurView>

      <ScrollView className="flex-1 pt-6">
        {/* Monthly Summary */}
        <View className="mx-4 bg-white rounded-xl p-4 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">This Month</Text>
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-2xl font-semibold text-green-500">85%</Text>
              <Text className="text-sm text-gray-500">Completion</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-semibold text-blue-500">42</Text>
              <Text className="text-sm text-gray-500">Total Tasks</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-semibold text-purple-500">7</Text>
              <Text className="text-sm text-gray-500">Streak</Text>
            </View>
          </View>
        </View>

        {/* Past Goals */}
        <View className="mx-4 space-y-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Past Goals</Text>
          
          {[...Array(5)].map((_, index) => (
            <View key={index} className="bg-white p-4 rounded-xl space-y-2">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-gray-800">
                  {new Date(2024, 0, 1 - index).toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <View className={`px-2 py-1 rounded-full ${
                  index % 3 === 0 ? 'bg-green-100' : 
                  index % 3 === 1 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Text className={`text-xs ${
                    index % 3 === 0 ? 'text-green-600' : 
                    index % 3 === 1 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {index % 3 === 0 ? 'Completed' : 
                     index % 3 === 1 ? 'In Progress' : 'Cancelled'}
                  </Text>
                </View>
              </View>
              
              <Text className="text-gray-600">Complete project documentation</Text>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm">Duration: 2hr</Text>
                <View className="flex-row items-center">
                  <Feather name="clock" size={14} color="#666" className="mr-1" />
                  <Text className="text-gray-500 text-sm">9:00 AM</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}
