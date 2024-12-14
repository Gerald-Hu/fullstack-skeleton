import { View, Modal, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useStore } from "@/stores";
// import { Text } from "@/components/Themed";
import { Button } from "@/components/Button";
import { LoginSheet } from "@/components/LoginSheet";
import { SignupSheet } from "@/components/SignupSheet";
import { ForgotPasswordSheet } from "@/components/ForgotPasswordSheet";
import { useState } from "react";

type Sheet = "login" | "signup" | "forgotPassword" | null;

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useStore();
  const [activeSheet, setActiveSheet] = useState<Sheet>(null);

  if (!isAuthenticated) {
    return (
      <View className="flex items-center justify-center size-full p-4">
        <Text className="text-2xl font-bold mb-2">Not Logged In</Text>
        <Button onPress={() => setActiveSheet("login")} className="mb-5">
          Login
        </Button>

        <Modal
          visible={activeSheet !== null}
          onRequestClose={() => setActiveSheet(null)}
          animationType="slide"
          presentationStyle="pageSheet"
          statusBarTranslucent
        >
          {activeSheet === "login" && (
            <LoginSheet
              onClose={() => setActiveSheet(null)}
              onSignupPress={() => setActiveSheet("signup")}
              onForgotPasswordPress={() => setActiveSheet("forgotPassword")}
            />
          )}
          {activeSheet === "signup" && (
            <SignupSheet
              onClose={() => setActiveSheet(null)}
              onLoginPress={() => setActiveSheet("login")}
            />
          )}
          {activeSheet === "forgotPassword" && (
            <ForgotPasswordSheet
              onClose={() => setActiveSheet(null)}
              onLoginPress={() => setActiveSheet("login")}
            />
          )}
        </Modal>
      </View>
    );
  }

  return (
    // <View className="flex items-center justify-center size-full p-4">
    //   <View>
    //     <Text className="text-2xl font-bold mb-2">Profile</Text>
    //     <Text className="text-base mb-8">Welcome back!</Text>
    //   </View>

    //   <View className="w-full gap-2 mb-8 bg-gray-200 p-4">
    //     <Text>Name: {user?.name}</Text>
    //     <Text>Email: {user?.email}</Text>
    //   </View>

    //   <View>
    //     <Button onPress={logout} variant="secondary" className="mb-5">
    //       Logout
    //     </Button>
    //   </View>
    // </View>
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

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="log-out" size={20} color="#FF4444" />
            <Pressable onPress={logout}>
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
