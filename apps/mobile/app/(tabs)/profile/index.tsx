import { View, Modal, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useStore } from "@/stores";

export default function ProfileScreen() {
  const { user, logout } = useStore();

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-10">
      {/* Header Section */}
      <View className="items-center pt-12 pb-8">
        <View className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center mb-4">
          <Feather name="user" size={40} color="#666" />
        </View>
        <Text className="text-xl font-semibold text-gray-800">
          {user?.name}
        </Text>
        <Text className="text-lg text-gray-800/50">
          {user?.email}
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="mx-4 bg-white rounded-xl p-4 shadow-sm flex-row justify-between mb-6">
        <View className="items-center flex-1">
          <Text className="text-gray-500 text-sm">Current Streak</Text>
          <Text className="text-xl font-semibold text-gray-800 mt-1">
            7 days
          </Text>
        </View>
        <View className="items-center flex-1 border-x border-gray-100">
          <Text className="text-gray-500 text-sm">Completion Rate</Text>
          <Text className="text-xl font-semibold text-gray-800 mt-1">85%</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-gray-500 text-sm">Reflections</Text>
          <Text className="text-xl font-semibold text-gray-800 mt-1">28</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View className="mx-4 space-y-4">
        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="clock" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Reflection Time</Text>
          </View>
          <Text className="text-gray-500">9:00 PM</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="moon" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Theme</Text>
          </View>
          <Text className="text-gray-500">Light</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="bell" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Notifications</Text>
          </View>
          <View className="w-12 h-6 bg-green-500 rounded-full items-end p-1">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="activity" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Goal History</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="help-circle" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Help & Support</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center" onPress={logout}>
          <View className="flex-row items-center">
            <Feather name="log-out" size={20} color="#FF4444" />
            <Pressable>
              <Text className="text-red-500 ml-3">Log Out</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </View>

      {/* Version Info */}
      <View className="items-center mt-8 mb-8">
        <Text className="text-gray-400 text-sm mb-6">Version 1.0.0</Text>
        {/* Zen decorative line */}
        <View className="w-full px-4 items-center">
          <View className="w-full h-[1px] bg-gray-200" />
          <View className="w-2 h-2 rounded-full bg-gray-400 mt-[-4px]" />
        </View>
      </View>
    </ScrollView>
  );
}
