import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions, Animated, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Text } from './Themed';
import { Button } from './Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'App',
    description: 'Stay Minimalist. Stay Efficient. Optional AI powered core.',
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
  visible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

export function OnboardingScreen({ visible, onComplete, onDismiss }: OnboardingScreenProps) {
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
      onDismiss();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View 
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity
          onPress={onDismiss}
          className="absolute right-6 top-6 z-10"
          style={{ top: insets.top + 20 }}
        >
          <Feather name="x" size={24} color="#666" />
        </TouchableOpacity>

        <View className="flex-1">
          <FlatList
            data={slides}
            renderItem={({ item }) => (
              <View className="items-center justify-center" style={{ width }}>
                <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center mb-8">
                  <Feather name={item.icon as any} size={48} color="#666" />
                </View>
                <Text className="text-3xl font-semibold text-gray-800 mb-4 text-center px-6">
                  {item.title}
                </Text>
                <Text className="text-lg text-gray-600 text-center px-10">
                  {item.description}
                </Text>
              </View>
            )}
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

          <View className="h-[160px] justify-end" style={{ paddingBottom: insets.bottom + 20 }}>
            {/* Pagination Dots */}
            <View className="flex-row justify-center space-x-2 mb-8 gap-x-2">
              {slides.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 16, 8],
                  extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={i}
                    className="h-2 rounded-full bg-gray-800"
                    style={{ width: dotWidth, opacity }}
                  />
                );
              })}
            </View>

            {/* Button */}
            <View className="px-6">
              <Pressable
                onPress={scrollTo}
                className="h-14 rounded-full bg-gray-900 m-auto items-center justify-center w-48"
              >
                <Text className="text-white font-semibold text-lg" style={{ color: 'white' }}>
                  {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
