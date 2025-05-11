import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { tasksAtom } from "@/store/task";
import { Text, View } from "react-native";
import { Progress, ProgressFilledTrack } from "./ui/progress";
import { Center } from "./ui/center";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';

interface UserProgressBarProps {
  tintColor?: string;
}

const AnimatedProgressFilledTrack = Animated.createAnimatedComponent(ProgressFilledTrack);

export default function UserProgressBar({ tintColor }: UserProgressBarProps) {
  const [tasks] = useAtom(tasksAtom);
  const progressValue = useSharedValue(0);

  const totalItemsToday = tasks.length;
  const completedItemsToday = tasks.filter(task => task.completed).length;
  const progress = totalItemsToday > 0 ? (completedItemsToday / totalItemsToday) * 100 : 0;
  const maxProgress = totalItemsToday > 0 ? 100 : 0;

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });
  
  return (
    <View className="w-full">
      <Progress 
        value={maxProgress} 
        max={maxProgress} 
        size="md" 
        orientation="horizontal"
        style={tintColor ? { backgroundColor: tintColor + '20' } : undefined}
      >
        <AnimatedProgressFilledTrack 
          style={[
            tintColor ? { backgroundColor: tintColor } : undefined,
            animatedStyle
          ]}
        />
      </Progress>
      <Text className="text-center mt-1 text-text-1 text-sm">
        {completedItemsToday} / {totalItemsToday}
      </Text>
    </View>
  );
}