import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions, Animated } from 'react-native';
import { Text } from './Themed';
import { Button } from './Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Our App',
    description: 'Your all-in-one solution for managing tasks and staying organized.',
    icon: 'home',
  },
  {
    id: '2',
    title: 'Stay Organized',
    description: 'Create, manage, and track your tasks with ease. Never miss a deadline again.',
    icon: 'check-square',
  },
  {
    id: '3',
    title: 'Collaborate',
    description: 'Work together with your team in real-time. Share and assign tasks effortlessly.',
    icon: 'users',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const Paginator = () => {
    return (
      <View className="flex-row gap-2 justify-center">
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              className="h-2 rounded-full bg-blue-500"
              style={[{ width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => {
    return (
      <View className="flex-1 items-center justify-center px-8" style={{ width }}>
        <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-8">
          <Feather name={item.icon as any} size={40} color="#3b82f6" />
        </View>
        <Text className="text-3xl font-bold mb-4 text-center">{item.title}</Text>
        <Text className="text-lg text-center text-gray-600">{item.description}</Text>
      </View>
    );
  };

  return (
    <View 
      className="flex-1 bg-white" 
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        className="flex-1"
      />
      
      <View className="px-8 pb-8">
        <Paginator />
        <Button onPress={scrollTo} className="mt-8">
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}
