import React, { useEffect, useRef } from "react";
import Gradient from "@/assets/Icons/Gradient";
import { View, ScrollView, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { useAtom } from "jotai";
import { userSettingsAtom } from "@/store/atoms";
import { Ionicons } from '@expo/vector-icons';
import clsx from "clsx";
import * as Haptics from 'expo-haptics';

export default function Home() {
  const [userSettings] = useAtom(userSettingsAtom);
  const isDarkMode = userSettings.theme === 'dark';
  const tintColor = userSettings.tintColor;
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  
  // Calculate pulse animation for the icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Screen width for responsive animations
  const screenWidth = Dimensions.get('window').width;
  
  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      // Fade in the main card
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale and position the card
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Show buttons after card is in place
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Continuous pulse animation for the checkmark icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Spin animation for the checkmark
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Interpolate the spin value to rotate from 0 to 360 degrees
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Create a floating effect for particles
  const Particle = ({ size, delay, posX, duration, color }) => {
    const particleAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      // Start the animation after the specified delay
      setTimeout(() => {
        Animated.loop(
          Animated.timing(particleAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          })
        ).start();
      }, delay);
    }, []);
    
    // Interpolate values for the animation
    const translateYValue = particleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -100], // Move upward
    });
    
    const opacity = particleAnim.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0, 0.8, 0], // Fade in and out
    });
    
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: color || tintColor,
          borderRadius: size / 2,
          bottom: -10,
          left: posX,
          opacity: opacity,
          transform: [{ translateY: translateYValue }],
        }}
      />
    );
  };
  
  // Function to handle button press with haptic feedback
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Function to generate particles randomly
  const renderParticles = () => {
    const particles = [];
    const count = Math.floor(screenWidth / 40); // Adjusts particle count based on screen width
    
    for (let i = 0; i < count; i++) {
      particles.push(
        <Particle
          key={i}
          size={Math.random() * 6 + 2}
          delay={Math.random() * 5000}
          posX={Math.random() * screenWidth}
          duration={4000 + Math.random() * 3000}
          color={i % 3 === 0 ? tintColor : (i % 3 === 1 ? '#ffffff' : '#f0f0f0')}
        />
      );
    }
    
    return particles;
  };
  
  return (
    <View className="flex-1 bg-black relative">
      {/* Gradient Background */}
      <View className="absolute top-0 left-0 right-0 bottom-0">
        <Gradient />
      </View>
      
      {/* Floating particles effect */}
      {renderParticles()}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Welcome Section with animations */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateY }
            ],
          }}
          className="flex-1 items-center justify-center my-16 mx-5 lg:my-24 lg:mx-32 relative z-10"
        >
          <View className="bg-black/50 dark:bg-gray-900/70 py-8 px-6 rounded-2xl shadow-lg items-center backdrop-blur-md">
            {/* Animated checkmark icon */}
            <Animated.View style={{
              transform: [
                { scale: pulseAnim },
                { rotate: spin }
              ],
              marginBottom: 24
            }}>
              <Ionicons 
                name="checkmark-circle" 
                size={84} 
                color={tintColor}
              />
            </Animated.View>
            
            <Text className="text-white font-bold text-3xl mb-6 text-center">
              Bem vindo(a)!
            </Text>
            
            <Text className="text-white font-medium text-lg text-center">
              Para melhorar sua experiência, permitimos que você personalize o aplicativo de acordo com suas preferências.
            </Text>
          </View>
        </Animated.View>

        {/* Animated Buttons Section */}
        <Animated.View 
          style={{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          }}
          className="flex-row justify-center space-x-4 mb-12 relative z-10"
        >
          <Link href="/onboarding" asChild>
            <TouchableOpacity
              style={{ 
                backgroundColor: tintColor,
                shadowColor: tintColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              }}
              className="py-4 px-10 rounded-full"
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-lg text-center">
                Personalizar
              </Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/tabs/" asChild>
            <TouchableOpacity
              className="py-4 px-10 rounded-full bg-gray-700/70 shadow-lg backdrop-blur-sm"
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-lg text-center">
                Pular
              </Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </ScrollView>
    </View>
  );
}