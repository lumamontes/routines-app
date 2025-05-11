import { atom } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"




const storage = createJSONStorage<string>(() => AsyncStorage)

export const avatarUriAtom = atomWithStorage<string>("avatarUri", '', storage)
