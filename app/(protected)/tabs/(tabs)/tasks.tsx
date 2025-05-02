import React, { useState } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import { useAtom } from 'jotai';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { Task, toggleTaskCompletion } from '@/services/database';
import { filteredTasksAtom, searchQueryAtom, tasksAtom } from '@/store/atoms';
import { Icon, SearchIcon } from '@/components/ui/icon';
import { router, useNavigation } from 'expo-router';

export default function TasksScreen() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filteredTasks] = useAtom(filteredTasksAtom);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const backgroundColor = Colors[colorScheme].background;
  const borderColor = colorScheme === 'dark' ? '#2d3748' : '#e2e8f0'; // gray-700 or gray-200
  
  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    // In a more complete app, this would navigate to a task detail view
    console.log('Task pressed:', task);
  };
  
  const handleAddTask = () => {
    // In a more complete app, this would navigate to a task creation view
    router.push('/(protected)/tabs/new-task');
  };

  const handleToggleTask = async (id: string) => {
    // Find the task to toggle
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;
    
    // Toggle the task completion status
    const updatedCompleted = !taskToToggle.completed;
    
    // Update in the database
    await toggleTaskCompletion(id, updatedCompleted);
    
    // Update in Jotai state
    setTasks(async (prevTasks) => {
      const resolvedTasks = await Promise.resolve(prevTasks);
      return resolvedTasks.map(task => 
        task.id === id ? { ...task, completed: updatedCompleted } : task
      );
    });
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard 
      task={item} 
      onToggle={handleToggleTask}
      onPress={handleTaskPress}
    />
  );

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScreenHeader 
        title="Todas as Tarefas" 
        onAddPress={handleAddTask}
      />
      
      <View 
        className="flex-row items-center mx-6 mb-4 rounded-lg p-4 border"
        style={{ 
          backgroundColor: colorScheme === 'dark' ? '#1a202c' : 'white', // gray-900 or white 
          borderColor
        }}
      >
         <Icon as={SearchIcon} size={'lg'} color={iconColor}  className="mr-2" />
        <TextInput
          className="flex-1 text-base" 
          style={{ color: textColor }}
          placeholder="Search tasks..."
          placeholderTextColor={iconColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          className="px-6"
          contentContainerStyle={{ paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title={searchQuery ? "Nenhum resultado encontrado" : "Nenhuma tarefa encontrada"}
          icon={<Icon as={SearchIcon} size={'lg'} color={iconColor} />}
          message={searchQuery 
            ? "Nenhum resultado encontrado para sua pesquisa."
            : "Você não tem nenhuma tarefa ainda. Crie uma nova tarefa para começar."}
          actionLabel="Adicionar Tarefa"
          onAction={handleAddTask}
        />
      )}
    </View>
  );
}