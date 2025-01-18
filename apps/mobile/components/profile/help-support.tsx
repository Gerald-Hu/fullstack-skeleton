import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpSupportScreen() {
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
            Help & Support
          </Text>
        </View>
      </BlurView>

      <ScrollView className="flex-1 pt-6">
        {/* FAQ Section */}
        <View className="mx-4 space-y-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Frequently Asked Questions</Text>
          
          {[
            {
              question: "How do I create a new task?",
              answer: "Tap the '+' button on the dashboard screen to create a new task. Fill in the task details and tap 'Create'."
            },
            {
              question: "How do I edit or delete a plan/task?",
              answer: "Swipe right on any task to edit, and swipe left to delete."
            },
            {
              question: "What is the streak system?",
              answer: "Streaks are counted when you complete at least one task per day. Maintain your streak by staying consistent!"
            },
            {
              question: "How do notifications work?",
              answer: "You'll receive daily reminders at your set reflection time. You can adjust this in your profile settings."
            }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="bg-white p-4 rounded-xl space-y-2"
            >
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-gray-800 flex-1 mr-2">{item.question}</Text>
                <Feather name="chevron-down" size={20} color="#666" />
              </View>
              <Text className="text-gray-600">{item.answer}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <View className="mx-4 mt-8 space-y-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Contact Support</Text>
          
          <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
              <Feather name="mail" size={20} color="#3B82F6" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Email Support</Text>
              <Text className="text-gray-500 text-sm">Get help via email</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
              <Feather name="message-circle" size={20} color="#22C55E" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Live Chat</Text>
              <Text className="text-gray-500 text-sm">Chat with our support team</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mx-4 mt-8 mb-4">
          <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
            <Text className="text-gray-800">Terms of Service</Text>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}
