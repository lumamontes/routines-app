import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        paddingTop: insets.top + 16,
        paddingBottom: 16
      }}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold mb-1 text-primary-500">
            {title}
          </Text>
          
          {date && (
            <Text className="text-base text-primary-100">
              {formatDate(date)}
            </Text>
          )}
        </View>
        
        {onAddPress && (
          <TouchableOpacity 
            className="w-12 h-12 rounded-full justify-center items-center shadow "
            onPress={onAddPress}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full justify-center items-center bg-primary-0 shadow">
              <Text 
                className="text-lg font-semibold"
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