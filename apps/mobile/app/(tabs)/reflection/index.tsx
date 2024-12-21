import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
// import { format } from 'date-fns';
import { useRouter } from "expo-router";

const ReflectionMainScreen = () => {
  const router = useRouter();
  const moodOptions = [
    { id: 1, emoji: "😌", label: "Calm" },
    { id: 2, emoji: "😊", label: "Joy" },
    { id: 3, emoji: "😔", label: "Sad" },
    { id: 4, emoji: "😤", label: "Stress" },
    { id: 5, emoji: "🤔", label: "Neutral" },
  ];

  const todayEntries = [
    {
      id: 1,
      time: "09:30",
      preview: "Morning reflection on goals...",
      mood: "😌",
    },
    { id: 2, time: "14:15", preview: "Post-lunch thoughts...", mood: "😊" },
  ];

  const recentHistory = [
    {
      date: "Yesterday",
      entries: [{ id: 3, preview: "End of day reflection...", mood: "😌" }],
    },
    {
      date: "Monday, Dec 16",
      entries: [{ id: 4, preview: "Weekly planning session...", mood: "🤔" }],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-4 py-6">
        {/* Date and Time */}
        <View className="mb-8">
          <Text className="text-3xl font-light text-neutral-800">
            {/* {format(new Date(), 'EEEE')} */}
          </Text>
          <Text className="text-base text-neutral-500">
            {/* {format(new Date(), 'MMMM d, yyyy')} */}
          </Text>
        </View>

        {/* Mood Selector */}
        <Text className="text-sm font-medium text-neutral-600 mb-3">
          How are you feeling?
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8 px-1 py-2"
        >
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              className="mr-4 items-center justify-center bg-white rounded-full w-16 h-16 shadow-sm"
            >
              <Text className="text-2xl">{mood.emoji}</Text>
              <Text className="text-xs text-neutral-600 mt-1">
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Reflection CTA */}
        <TouchableOpacity
          className="bg-neutral-800 rounded-xl p-6 mb-8 shadow-sm"
          onPress={() => router.push("/reflection/chat-reflection")}
        >
          <Text className="text-white text-lg font-medium mb-2">
            New Reflection
          </Text>
          <Text className="text-neutral-400 text-sm">
            Take a moment to pause and reflect...
          </Text>
        </TouchableOpacity>

        {/* Today's Entries */}
        <View>
          <Text className="text-sm font-medium text-neutral-600 mb-3">
            Today's Reflections
          </Text>
          {todayEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-neutral-500 text-sm">{entry.time}</Text>
                <Text className="text-xl">{entry.mood}</Text>
              </View>
              <Text className="text-neutral-700" numberOfLines={2}>
                {entry.preview}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent History Section */}
        <View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-medium text-neutral-600">
              Recent History
            </Text>
            <TouchableOpacity onPress={() => router.push("/reflection/histories")}>
              <Text className="text-sm text-neutral-400">View all</Text>
            </TouchableOpacity>
          </View>
          {recentHistory.map((day, index) => (
            <View key={index} className="mb-4">
              <Text className="text-sm text-neutral-500 mb-2">{day.date}</Text>
              {day.entries.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  className="bg-white rounded-lg p-4 mb-2 shadow-sm flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-neutral-700" numberOfLines={1}>
                      {entry.preview}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-2">{entry.mood}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ReflectionMainScreen;
