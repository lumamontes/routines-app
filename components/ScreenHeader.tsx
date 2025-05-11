import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

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
          <Button 
            variant="outline"
            className="rounded-full"
            onPress={onAddPress}
          >
            <Text
              className="text-primary-0"
            >
              Adicionar
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
};