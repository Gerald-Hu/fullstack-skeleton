import { View, Modal, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useStore } from "@/stores";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ProfileScreen() {
  const { user, logout } = useStore(state => state.auth);
  const { showOnboarding } = useStore(state => state.onboarding);
  const router = useRouter();

  // Settings state
  const [reflectionTime, setReflectionTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  const [selectedHour, setSelectedHour] = useState(reflectionTime.getHours() % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(reflectionTime.getMinutes());
  const [selectedPeriod, setSelectedPeriod] = useState(reflectionTime.getHours() >= 12 ? 'PM' : 'AM');

  const handleTimeChange = () => {
    const newHour = selectedPeriod === 'PM' ? 
      (selectedHour === 12 ? 12 : selectedHour + 12) : 
      (selectedHour === 12 ? 0 : selectedHour);
    
    const newDate = new Date();
    newDate.setHours(newHour);
    newDate.setMinutes(selectedMinute);
    setReflectionTime(newDate);
    setShowTimePicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

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
        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center"
          onPress={() => setShowTimePicker(true)}
        >
          <View className="flex-row items-center">
            <Feather name="clock" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Reflection Time</Text>
          </View>
          <Text className="text-gray-500">{formatTime(reflectionTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center"
          onPress={toggleTheme}
        >
          <View className="flex-row items-center">
            <Feather name="moon" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Theme</Text>
          </View>
          <Text className="text-gray-500">{theme === 'light' ? 'Light' : 'Dark'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center"
          onPress={toggleNotifications}
        >
          <View className="flex-row items-center">
            <Feather name="bell" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Notifications</Text>
          </View>
          <View 
            className={`w-12 h-6 ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'} rounded-full items-${notificationsEnabled ? 'end' : 'start'} p-1`}
          >
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center" 
          onPress={() => router.push("/profile/goal-history")}
        >
          <View className="flex-row items-center">
            <Feather name="activity" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Goal History</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center"
          onPress={() => router.push("/profile/help-support")}
        >
          <View className="flex-row items-center">
            <Feather name="help-circle" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Help & Support</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center"
          onPress={() => showOnboarding()}
        >
          <View className="flex-row items-center">
            <Feather name="refresh-ccw" size={20} color="#666" />
            <Text className="text-gray-800 ml-3">Watch Tutorial</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-4 rounded-xl flex-row justify-between items-center" 
          onPress={logout}
        >
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

      {/* Time Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimePicker}
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text className="text-gray-500 text-lg">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Set Time</Text>
              <TouchableOpacity onPress={handleTimeChange}>
                <Text className="text-blue-500 text-lg">Done</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center items-center p-4">
              {/* Hours */}
              <ScrollView 
                className="h-40 w-16"
                showsVerticalScrollIndicator={false}
              >
                {hours.map(hour => (
                  <TouchableOpacity
                    key={hour}
                    onPress={() => setSelectedHour(hour)}
                    className={`h-12 items-center justify-center ${selectedHour === hour ? 'bg-gray-100 rounded-lg' : ''}`}
                  >
                    <Text className={`text-lg ${selectedHour === hour ? 'text-blue-500 font-semibold' : 'text-gray-600'}`}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text className="text-2xl mx-2">:</Text>

              {/* Minutes */}
              <ScrollView 
                className="h-40 w-16"
                showsVerticalScrollIndicator={false}
              >
                {minutes.map(minute => (
                  <TouchableOpacity
                    key={minute}
                    onPress={() => setSelectedMinute(minute)}
                    className={`h-12 items-center justify-center ${selectedMinute === minute ? 'bg-gray-100 rounded-lg' : ''}`}
                  >
                    <Text className={`text-lg ${selectedMinute === minute ? 'text-blue-500 font-semibold' : 'text-gray-600'}`}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* AM/PM */}
              <View className="ml-4">
                {periods.map(period => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    className={`h-12 w-16 items-center justify-center ${selectedPeriod === period ? 'bg-gray-100 rounded-lg' : ''}`}
                  >
                    <Text className={`text-lg ${selectedPeriod === period ? 'text-blue-500 font-semibold' : 'text-gray-600'}`}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
