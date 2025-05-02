import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Task } from '@/services/database';
import { CheckCircleIcon, CircleIcon, Icon } from './ui/icon';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const tintColor = Colors[colorScheme].tint;
  
  const formatTime = (time?: string) => {
    if (!time) return '';
    
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // red-500
      case 'medium':
        return '#f59e0b'; // amber-500
      case 'low':
        return '#10b981'; // emerald-500
      default:
        return tintColor;
    }
  };

  return (
    <TouchableOpacity
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-lg p-4 my-2 shadow border border-gray-200 dark:border-gray-700",
        task.completed && "opacity-70 bg-gray-100 dark:bg-gray-900"
      )}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="mr-2">
          <TouchableOpacity
            className="p-1"
            onPress={() => onToggle(task.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {task.completed ? (
              // <CheckCircle size={24} color="#10b981" />
              <Icon as={CheckCircleIcon} size={'md'} color={tintColor} className="text-green-500" />
            ) : (
              <Icon as={CircleIcon} size={'md'} color={iconColor} className="text-gray-400" />
            )}
          </TouchableOpacity>
        </View>
        
        <View className="flex-1 justify-center">
          <Text 
            className={clsx(
              "text-base font-semibold mb-1",
              task.completed && "line-through"
            )}
            style={{ color: task.completed ? iconColor : textColor }}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.description ? (
            <Text 
              className={clsx(
                "text-sm mb-1",
                task.completed && "line-through"
              )}
              style={{ color: iconColor }}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
          
          <View className="flex-row items-center mt-1">
            {task.time ? (
              <Text className="text-xs mr-4" style={{ color: iconColor }}>
                {formatTime(task.time)}
              </Text>
            ) : null}
            
            {task.duration ? (
              <Text className="text-xs mr-4" style={{ color: iconColor }}>
                {task.duration} min
              </Text>
            ) : null}
            
            {task.priority ? (
              <View 
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                <Text className="text-xs text-white">
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        
        {task.visualAid ? (
          <View className="ml-2">
            <Image 
              source={{ uri: task.visualAid }} 
              className="w-12 h-12 rounded"
              resizeMode="cover"
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};