import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = createJSONStorage(() => AsyncStorage)

const content = {
  step: 0,
}

export const onboardingAtom = atomWithStorage('@tarefitas:onboarding', content, storage)