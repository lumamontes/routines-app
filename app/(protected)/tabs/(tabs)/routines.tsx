import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useAtom } from 'jotai';
import { routinesAtom, tasksAtom } from '@/store/atoms';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { RoutineCard } from '@/components/RoutineCard';
import { EmptyState } from '@/components/EmptyState';
import { Routine } from '@/services/database';
import { router } from 'expo-router';

export default function RoutinesScreen() {
  const [routines] = useAtom(routinesAtom);
  const [tasks] = useAtom(tasksAtom);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = Colors[colorScheme].background;
  const iconColor = Colors[colorScheme].icon;
  
  const handleRoutinePress = (routine: Routine) => {
    setSelectedRoutine(routine);
    // In a more complete app, this would navigate to a routine detail view
    console.log('Routine pressed:', routine);
  };
  
  const handleAddRoutine = () => {
    // In a more complete app, this would navigate to a routine creation view
    router.push('/(protected)/tabs/new-routine');
  };

  const renderItem = ({ item }: { item: Routine }) => (
    <RoutineCard 
      routine={item}
      onPress={handleRoutinePress}
    />
  );

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScreenHeader 
        title="Routines" 
        onAddPress={handleAddRoutine}
      />
      
      {routines.length > 0 ? (
        <FlatList
          data={routines}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          className="px-6 pt-4"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="Nenhuma Rotina"
          // message="You don't have any routines yet. Routines help you organize related tasks together."
          message="Sem rotinas cadastradas. Cadastre uma rotina para organizar suas tarefas relacionadas."
          actionLabel="Adicionar Rotina"
          onAction={handleAddRoutine}
          icon={<Clock size={48} color={iconColor} />}
        />
      )}
    </View>
  );
}