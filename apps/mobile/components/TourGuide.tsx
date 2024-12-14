import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import { Text } from './Themed';
import { Button } from './Button';

export type TooltipPosition = {
  top: number;
  left: number;
  width?: number;
  tooltipWidth?: number;
};

export type TourStep = {
  targetRef: React.RefObject<View>;
  title: string;
  content: string;
  getPosition: (measurements: { x: number; y: number; width: number; height: number }) => TooltipPosition;
};

type TourGuideProps = {
  steps: TourStep[];
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  visible,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetMeasurements, setTargetMeasurements] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const layoutTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (layoutTimeout.current) {
        clearTimeout(layoutTimeout.current);
      }
      
      // Reset opacity to 0
      opacity.setValue(0);
      
      // Wait for layout to settle
      layoutTimeout.current = setTimeout(() => {
        measureCurrentTarget();
      }, 300);
    } else {
      // Fade out when hiding
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTargetMeasurements(null);
      });
    }

    return () => {
      if (layoutTimeout.current) {
        clearTimeout(layoutTimeout.current);
      }
    };
  }, [visible, currentStep]);

  useEffect(() => {
    // Only start fade-in animation after we have measurements
    if (targetMeasurements && visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [targetMeasurements, visible]);

  const measureCurrentTarget = () => {
    const currentTargetRef = steps[currentStep]?.targetRef;
    if (currentTargetRef?.current) {
      currentTargetRef.current.measureInWindow((x, y, width, height) => {
        console.log('Measured:', { x, y, width, height });
        setTargetMeasurements({ x, y, width, height });
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Fade out current step
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(prev => prev + 1);
        setTargetMeasurements(null);
      });
    } else {
      onComplete();
    }
  };

  if (!visible || !targetMeasurements) return null;

  const tooltipPosition = steps[currentStep].getPosition(targetMeasurements);

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50">
          {targetMeasurements && (
            <Animated.View
              className="absolute bg-white/20 border-2 border-blue-500"
              style={{
                top: targetMeasurements.y - 4,
                left: targetMeasurements.x - 4,
                width: targetMeasurements.width + 8,
                height: targetMeasurements.height + 8,
                borderRadius: 4,
                opacity,
              }}
            />
          )}
          
          <Animated.View
            className="absolute bg-white rounded-lg p-4 shadow-lg"
            style={[
              {
                width: tooltipPosition.tooltipWidth ?? 200,
                opacity,
                ...tooltipPosition,
              },
            ]}
          >
            <Text className="text-lg font-bold mb-2">{steps[currentStep].title}</Text>
            <Text className="mb-4">{steps[currentStep].content}</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                {currentStep + 1} of {steps.length}
              </Text>
              <Button onPress={handleNext}>
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
