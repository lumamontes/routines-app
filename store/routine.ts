import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { tasksAtom, Task } from './task'

// Schemas
export const routineSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  isActive: z.boolean(),
  days: z.array(z.number()).optional(),
})

// Types
export type Routine = z.infer<typeof routineSchema>

// Storage setup
const routineStorage = createJSONStorage<Routine[]>(() => AsyncStorage)

// Initial content
const initialRoutines: Routine[] = [
  {
    id: '1',
    title: 'Morning Routine',
    description: 'Start the day right',
    timeOfDay: 'morning',
    isActive: true,
    days: [1, 2, 3, 4, 5],
  },
]

// Base atoms
export const routinesAtom = atomWithStorage<Routine[]>('@tarefitas:routines', initialRoutines, routineStorage)

// Routine derivatives
export const getRoutineByIdAtom = atom(
  null,
  async (get, set, routineId: string) => {
    const routines = await get(routinesAtom)
    return routines.find((routine: Routine) => routine.id === routineId)
  }
)

export const addRoutineAtom = atom(
  null,
  async (get, set, routineData: Omit<Routine, 'id'>) => {
    const routines = await get(routinesAtom)
    const newRoutine: Routine = {
      ...routineData,
      id: uuidv4(),
    }
    set(routinesAtom, [...routines, newRoutine])
    return newRoutine.id
  }
)

export const updateRoutineAtom = atom(
  null,
  async (get, set, { id, ...routineData }: Routine) => {
    const routines = await get(routinesAtom)
    const updatedRoutines = routines.map((routine: Routine) => 
      routine.id === id ? { ...routine, ...routineData } : routine
    )
    set(routinesAtom, updatedRoutines)
  }
)

export const deleteRoutineAtom = atom(
  null,
  async (get, set, routineId: string) => {
    // Delete the routine
    const routines = await get(routinesAtom)
    const updatedRoutines = routines.filter((routine: Routine) => routine.id !== routineId)
    set(routinesAtom, updatedRoutines)
    
    // Update any tasks associated with this routine
    const tasks = await get(tasksAtom)
    const updatedTasks = tasks.map((task: Task) => 
      task.routineId === routineId ? { ...task, routineId: null } : task
    )
    set(tasksAtom, updatedTasks)
  }
)