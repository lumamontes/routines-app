import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine, Task } from '@/services/database';

// Create storage for persisting atoms
const storage = createJSONStorage<Routine[]>(() => AsyncStorage);
const taskStorage = createJSONStorage<Task[]>(() => AsyncStorage);

const userSettingsStorage = createJSONStorage<{
  theme: string;
  notificationsEnabled: boolean;
  name: string;
  tintColor: string;
  accentColor: string;
  accentColorDark: string;
  accentColorLight: string;
}>(() => AsyncStorage);

const booleanStorage = createJSONStorage<boolean>(() => AsyncStorage);

export const userSettingsAtom = atomWithStorage('userSettings', {
  theme: 'light',
  notificationsEnabled: true,
  name: '',
  tintColor: '#6200ee',
  accentColor: '#03dac4',
  accentColorDark: '#03dac4',
  accentColorLight: '#03dac4',
}, userSettingsStorage);

export const isDarkModeAtom = atomWithStorage('isDarkMode', false, booleanStorage);
// export const isDarkModeAtom = atomWithStorage('isDarkMode', false, storage);

// Tasks atoms
export const tasksAtom = atomWithStorage<Task[]>('tasks', [], taskStorage);

export const filteredTasksAtom = atom(async (get) => {
  const tasks = await get(tasksAtom);
  const searchQuery = get(searchQueryAtom);
  
  if (!searchQuery) return tasks;
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
});

export const tasksByDateAtom = atom((get) => async (date: string) => {
  const tasks = await get(tasksAtom);
  return tasks.filter(task => task.date === date);
});

// Routines atoms
export const routinesAtom = atomWithStorage<Routine[]>('routines', [], storage);

export const activeRoutinesAtom = atom(async (get) => {
  const routines = await get(routinesAtom);
  return routines.filter(routine => routine.isActive);
});

// Search atom
export const searchQueryAtom = atom('');