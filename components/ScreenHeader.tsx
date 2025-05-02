import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ScreenHeaderProps {
  title: string;
  onAddPress?: () => void;
  date?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  onAddPress,
  date 
}) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const tintColor = Colors[colorScheme].tint;
  const backgroundColor = Colors[colorScheme].background;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View 
      className="px-6"
      style={{ 
        backgroundColor,
        paddingTop: insets.top + 16, // spacing.md equivalent
        paddingBottom: 16 // spacing.md equivalent
      }}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text 
            className="text-3xl font-bold mb-1"
            style={{ color: textColor }}
          >
            {title}
          </Text>
          
          {date && (
            <Text 
              className="text-base"
              style={{ color: iconColor }}
            >
              {formatDate(date)}
            </Text>
          )}
        </View>
        
        {onAddPress && (
          <TouchableOpacity 
            className="w-12 h-12 rounded-full justify-center items-center shadow"
            style={{ backgroundColor: tintColor }}
            onPress={onAddPress}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full justify-center items-center bg-white dark:bg-gray-800 shadow">
              <Text 
                className="text-lg font-semibold"
                style={{ color: tintColor }}
              >
                +
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};