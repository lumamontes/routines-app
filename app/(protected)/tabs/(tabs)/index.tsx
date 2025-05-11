import ProfileCard from "@/components/ProfileCard";
import { TaskCard } from "@/components/TaskCard";
import { Text } from "@/components/ui/text";
import { tasksAtom, toggleTaskCompletion } from "@/store/task";
import { useAtom, useSetAtom } from "jotai";
import { FlatList, SafeAreaView, View } from "react-native";

export default function Home() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const useToggleTaskCompletion = useSetAtom(toggleTaskCompletion);

  const handleToggleTask = async (id: string) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;

    const updatedCompleted = !taskToToggle.completed;

    await useToggleTaskCompletion(id);

    setTasks(async (prevTasks) => {
      const resolvedTasks = await Promise.resolve(prevTasks);
      return resolvedTasks.map(task =>
        task.id === id ? { ...task, completed: updatedCompleted } : task
      );
    });
  };

  return (
      <SafeAreaView className="flex-1 bg-background-0">
        <View className="flex-1 px-4 py-6 justify-center gap-y-6 md:space-y-12 bg-background-0">
        <ProfileCard />
        <FlatList
          data={tasks}
          ListHeaderComponent={( ) => (
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold">
                Tarefas de hoje
              </Text>
            </View>
          )}
          renderItem={({ item }) => <TaskCard task={item} onPress={() => {}} onToggle={handleToggleTask} />}
        />
      </View>
    </SafeAreaView>
  );
}
