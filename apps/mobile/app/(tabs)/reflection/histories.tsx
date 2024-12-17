import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { format } from "date-fns";

const HistoryScreen = () => {
  const historyEntries = [
    {
      id: 1,
      date: "2024-12-17",
      entries: [
        {
          id: 1,
          time: "09:30",
          preview:
            "Morning reflection on setting intentions for the day. Feeling optimistic about new projects.",
          mood: "😌",
          hasAiSummary: true,
        },
        {
          id: 2,
          time: "14:15",
          preview:
            "Post-lunch thoughts about team meeting and project deadlines.",
          mood: "😊",
          hasAiSummary: true,
        },
      ],
    },
    {
      id: 2,
      date: "2024-12-16",
      entries: [
        {
          id: 3,
          time: "11:00",
          preview:
            "Reflecting on yesterday's achievements and planning next steps.",
          mood: "🤔",
          hasAiSummary: true,
        },
      ],
    },
  ];

  const renderDateHeader = (date: string) => (
    <View className="mb-3 mt-6">
      <Text className="text-lg font-medium text-neutral-800">
        {format(new Date(date), "MMMM d, yyyy")}
      </Text>
      <Text className="text-sm text-neutral-500">
        {format(new Date(date), "EEEE")}
      </Text>
    </View>
  );

  const renderEntry = (entry: {
    id: number;
    time: string;
    preview: string;
    mood: string;
    hasAiSummary: boolean;
  }) => (
    <TouchableOpacity
      key={entry.id}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm"
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Text className="text-neutral-500 text-sm">{entry.time}</Text>
          {entry.hasAiSummary && (
            <View className="ml-2 px-2 py-1 bg-neutral-100 rounded-full">
              <Text className="text-xs text-neutral-600">AI Summary</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center">
          <Text className="text-xl mr-2">{entry.mood}</Text>
        </View>
      </View>
      <Text className="text-neutral-700" numberOfLines={2}>
        {entry.preview}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-light text-neutral-800">
              Reflection History
            </Text>
            <Text className="text-base text-neutral-500">
              Past moments and insights
            </Text>
          </View>

          {/* Search Bar (visual only for MVP) */}
          <TouchableOpacity className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <Text className="text-neutral-500">Search reflections...</Text>
          </TouchableOpacity>

          {/* History List */}
          {historyEntries.map((day) => (
            <View key={day.id}>
              {renderDateHeader(day.date)}
              {day.entries.map((entry) => renderEntry(entry))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
