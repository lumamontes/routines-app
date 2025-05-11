import React from 'react';
import { View } from 'react-native';
import { useAtom } from 'jotai';
import { settingsAtom } from '@/store/settings';
import { tasksAtom } from '@/store/task';
import { Box } from './ui/box';
import { Avatar, AvatarImage, AvatarFallbackText } from './ui/avatar';
import { avatarUriAtom } from '@/store/avatar';
import UserProgressBar from './UserProgressBar';
import { Icon } from './ui/icon';
import { UserCircleIcon } from 'lucide-react-native';
import { Text } from './ui/text';

const ProfileCard = () => {
  const [avatarUri] = useAtom(avatarUriAtom)
  const [settings] = useAtom(settingsAtom);
  const [tasks] = useAtom(tasksAtom);

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Box className="p-6 bg-background-0 rounded-xl shadow-sm w-full border border-primary-0">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Avatar size="lg" className="border-2" style={{ borderColor: settings.tintColor }}>
            <AvatarImage
              source={{ uri: avatarUri || 'https://via.placeholder.com/150' }}
              alt="Profile"
            />
            <AvatarFallbackText>
              <Icon as={UserCircleIcon} className="h-8 w-8" style={{ color: settings.tintColor }} />
            </AvatarFallbackText>
          </Avatar>
          <View className="ml-4">
            <Text className="text-xl font-bold" style={{ color: settings.foregroundColor }}>
              {settings.username}
            </Text>
            <Text className="text-text-1 text-sm text-primary-0">
              {completedTasks} de {tasks.length} tarefas completadas
            </Text>
          </View>
        </View>
      </View>

      <View className="space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-text-1 text-sm text-primary-0">Progresso</Text>
          <Text className="text-text-1 text-sm font-medium text-primary-0">{Math.round(progress)}%</Text>
        </View>
        <UserProgressBar tintColor={settings.tintColor} />
      </View>
    </Box>
  );
};

export default ProfileCard;
