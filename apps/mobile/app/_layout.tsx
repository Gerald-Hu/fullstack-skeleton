import * as DevClient from "expo-dev-client";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@store/index";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { Animated } from "react-native";
import { ActivityIndicator } from "react-native";
import { View } from "@components/Themed";
import { OnboardingScreen } from "@/components/OnboardingScreen";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Auth } from "@/containers/Auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { fetchUser, user, isAuthenticated } = useStore(state => state.auth);
  const { 
    hasCompletedOnboarding, 
    isOnboardingVisible,
    checkOnboardingStatus, 
    completeOnboarding,
    hideOnboarding
  } = useStore(state => state.onboarding);

  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
        await checkOnboardingStatus();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getMe();
  }, []);

  useEffect(() => {
    // Reset animations to initial values
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.95);

    // Start new animations with spring for more natural movement
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isAuthenticated]);

  if (!loaded) {
    return null;
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#A8A29E" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Animated.View 
          style={[
            { 
              flex: 1,
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
            // Add initial styles to prevent flash
            !loaded && { opacity: 0 }
          ]}
        >
          {isAuthenticated ? (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          ) : (
            <Auth /> 
          )}
        </Animated.View>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <OnboardingScreen
          visible={isOnboardingVisible}
          onComplete={completeOnboarding}
          onDismiss={hideOnboarding}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
