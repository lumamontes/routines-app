import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useAtom, useSetAtom } from 'jotai';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { Icon, SearchIcon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { tasksAtom, TaskWithId, toggleTaskCompletion } from '@/store/task';
import { Input, InputField } from '@/components/ui/input';

export default function TasksScreen() {
  const useToggleTaskCompletion = useSetAtom(toggleTaskCompletion);
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [selectedTask, setSelectedTask] = useState<TaskWithId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<TaskWithId[]>([]);

  const handleTaskPress = (task: TaskWithId) => {
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
    await useToggleTaskCompletion(id);

    // Update in Jotai state
    setTasks(async (prevTasks) => {
      const resolvedTasks = await Promise.resolve(prevTasks);
      return resolvedTasks.map(task =>
        task.id === id ? { ...task, completed: updatedCompleted } : task
      );
    });
  };

  const renderItem = ({ item }: { item: TaskWithId }) => (
    <TaskCard
      task={item}
      onToggle={handleToggleTask}
      onPress={handleTaskPress}
    />
  );

  // Filter tasks based on search query
  React.useEffect(() => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  return (
    <View className="flex-1 bg-background-0 transition-colors duration-300">
      <ScreenHeader
        title="Todas as Tarefas"
        onAddPress={handleAddTask}
      />
      <Input className="flex-row items-center mx-6 mb-4 rounded-lg p-1 border bg-background-0">
        <Icon as={SearchIcon} size={'lg'} className="mr-2 text-primary-0 " />
        <InputField
          placeholder="Procurar..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Input>
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
          icon={<Icon as={SearchIcon} size={'lg'} />}
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