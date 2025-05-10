import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Settings = {
  theme: 'light' | 'dark'
  username: string
  profilePicture: string
  tintColor: string
  foregroundColor: string
  isOnboarding: boolean
}

const storage = createJSONStorage<Settings>(() => AsyncStorage)

const content = {
  theme: 'light' as 'light' | 'dark',
  username: '',
  tintColor: '#000000',
  foregroundColor: '#ffffff',
  isOnboarding: true,
  profilePicture: '',
}

export const settingsAtom = atomWithStorage<Settings>(
  '@tarefitas:settings',
  content,
  storage
)