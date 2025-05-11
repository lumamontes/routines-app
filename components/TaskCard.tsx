import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import { CheckCircleIcon, CircleIcon, Icon } from './ui/icon';
import { Task } from '@/store/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
}

const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return 'bg-error-50';
    case 'medium':
      return 'bg-warning-50';
    case 'low':
      return 'bg-success-50';
    default:
      return 'bg-primary-50';
  }
};

const getPriorityTextColor = (priority?: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return 'text-error-700';
    case 'medium':
      return 'text-warning-700';
    case 'low':
      return 'text-success-700';
    default:
      return 'text-primary-700';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onPress }) => {
  const formatTime = (time?: string) => {
    if (!time) return '';
    
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <TouchableOpacity
      className={clsx(
        "bg-background-0 rounded-xl p-4 my-2 shadow-sm border border-outline-200",
        task.completed && "bg-background-50"
      )}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="mr-3">
          <TouchableOpacity
            className="p-1"
            onPress={() => onToggle(task.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {task.completed ? (
              <Icon as={CheckCircleIcon} size={'md'} className="text-success-700" />
            ) : (
              <Icon as={CircleIcon} size={'md'} className="text-primary-700" />
            )}
          </TouchableOpacity>
        </View>
        
        <View className="flex-1 justify-center">
          <Text 
            className={clsx(
              "text-base font-semibold mb-1",
              task.completed ? "text-typography-400 line-through" : "text-typography-900"
            )}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.description ? (
            <Text 
              className={clsx(
                "text-sm mb-2",
                task.completed ? "text-typography-300 line-through" : "text-typography-700"
              )}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
          
          <View className="flex-row items-center flex-wrap gap-2">
            {task.time ? (
              <View className="bg-background-50 px-2 py-1 rounded-full">
                <Text className="text-xs text-typography-700">
                  {formatTime(task.time)}
                </Text>
              </View>
            ) : null}
            
            {task.duration ? (
              <View className="bg-background-50 px-2 py-1 rounded-full">
                <Text className="text-xs text-typography-700">
                  {task.duration} min
                </Text>
              </View>
            ) : null}
            
            {task.priority ? (
              <View 
                className={clsx(
                  "px-2 py-1 rounded-full",
                  getPriorityColor(task.priority as 'low' | 'medium' | 'high')
                )}
              >
                <Text className={clsx("text-xs font-medium", getPriorityTextColor(task.priority as 'low' | 'medium' | 'high'))}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        
        {task.visualAid ? (
          <View className="ml-3">
            <Image 
              source={{ uri: task.visualAid }} 
              className="w-14 h-14 rounded-lg"
              resizeMode="cover"
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};