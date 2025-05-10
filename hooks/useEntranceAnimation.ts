// Example: hooks/useEntranceAnimation.ts
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useEntranceAnimation = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeAnim, scaleAnim, translateY]); // Add dependencies

  return { fadeAnim, scaleAnim, translateY };
};