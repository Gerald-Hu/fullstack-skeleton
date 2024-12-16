import { View, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const HEADER_HEIGHT = 60;

export default function DashboardScreen() {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [HEADER_HEIGHT/2, 0, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View className="flex-1 bg-white">
      {/* Animated Header */}
      <Animated.View 
        style={[headerAnimatedStyle]} 
        className="absolute top-0 left-0 right-0 z-10"
        pointerEvents="box-none"
      >
        <BlurView 
          intensity={30}
          tint="light"
          className="w-full"
          style={{ paddingTop: insets.top }}
        >
          <View className="h-14 justify-center px-4 bg-white/50">
            <Text className="text-xl font-semibold">Dashboard</Text>
          </View>
        </BlurView>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: insets.top }}
        className="flex-1"
      >
        {/* Add your dashboard content here */}
        <View className="p-4">
          <Text className="text-3xl font-bold mb-4">Welcome Back!</Text>
          {/* Example content - replace with your actual dashboard items */}
          {[...Array(20)].map((_, i) => (
            <View key={i} className="bg-gray-100 p-4 rounded-lg mb-4">
              <Text>Dashboard Item {i + 1}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
