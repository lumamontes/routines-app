import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useAtom } from 'jotai';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Routine } from '@/store/routine';
import { tasksAtom } from '@/store/task';

interface RoutineCardProps {
  routine: Routine;
  onPress: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onPress }) => {
  const [tasks] = useAtom(tasksAtom);
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const tintColor = Colors[colorScheme].tint;
  
  // Filter tasks for this specific routine
  const routineTasks = tasks.filter(task => task.routineId === routine.id);
  
  const getTimeOfDayText = (timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime') => {
    switch (timeOfDay) {
      case 'morning':
        return 'Morning';
      case 'afternoon':
        return 'Afternoon';
      case 'evening':
        return 'Evening';
      default:
        return 'Anytime';
    }
  };
  
  const getDaysText = (days?: number[]) => {
    if (!days || days.length === 0) return 'No specific days';
    if (days.length === 7) return 'Every day';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => dayNames[d]).join(', ');
  };

  const completedTasksCount = routineTasks.filter(task => task.completed).length;
  const totalTasksCount = routineTasks.length;
  const progress = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) : 0;

  return (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 shadow border border-gray-200 dark:border-gray-700"
      style={{ 
        borderLeftColor: routine.color || tintColor, 
        borderLeftWidth: 4 
      }}
      onPress={() => onPress(routine)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1">
          <Text 
            className="text-lg font-semibold"
            style={{ color: textColor }}
            numberOfLines={1}
          >
            {routine.title}
          </Text>
          <View className="flex-row items-center mt-1">
            <Clock size={14} color={iconColor} />
            <Text 
              className="text-xs ml-1"
              style={{ color: iconColor }}
            >
              {getTimeOfDayText(routine?.timeOfDay)}
            </Text>
          </View>
        </View>
        
        <Text 
          className="text-sm font-semibold"
          style={{ color: iconColor }}
        >
          {completedTasksCount}/{totalTasksCount} tasks
        </Text>
      </View>
      
      {routine.description ? (
        <Text 
          className="text-sm mb-4"
          style={{ color: iconColor }}
          numberOfLines={2}
        >
          {routine.description}
        </Text>
      ) : null}
      
      <View className="mb-2">
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <View 
            className="h-full bg-green-500"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>
      
      <Text 
        className="text-xs mt-1"
        style={{ color: iconColor }}
      >
        {getDaysText(routine?.daysOfWeek)}
      </Text>
    </TouchableOpacity>
  );
};