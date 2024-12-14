import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useStore } from "@store/index";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "@/components/Themed";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { fetchUser, user } = useStore();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function getMe() {
      try {
      await fetchUser();
      } catch (error) {
        console.log(error);
      }
    }
    getMe();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {true ? (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        ) : (
          <View className="flex-1 items-center justify-center" />
        )}
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
