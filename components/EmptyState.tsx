import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { AddIcon, Icon } from './ui/icon';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const tintColor = Colors[colorScheme].tint;

  return (
    <View className="flex-1 justify-center items-center p-6">
      {icon ? (
        <View className="mb-4">{icon}</View>
      ) : null}
      
      <Text className="text-xl font-semibold text-center mb-2" style={{ color: textColor }}>
        {title}
      </Text>
      
      <Text className="text-base text-center mb-6" style={{ color: iconColor }}>
        {message}
      </Text>
      
      {actionLabel && onAction ? (
        <TouchableOpacity 
          className="flex-row items-center py-2 px-4 rounded-full text-secondary"
          style={{ backgroundColor: tintColor }}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Icon as={AddIcon} size={'lg'} className="mr-1 text-secondary-300" />
          <Text className="text-base font-semibold text-secondary-300">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};