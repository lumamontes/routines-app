import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { Platform } from 'react-native'

// Define Task and TaskAtom types
export type Task = {
  id: string
  title: string
  description: string
  completed: boolean
  date: string
  time: string
  priority: string
  duration: number
  timeOfDay: string
  visualAid: string
  color: string
  routineId: string | null
  daysOfWeek: number[]
}

export type TaskAtom = {
  tasks: Task[]
}

// Platform-specific storage setup
const taskStorage = createJSONStorage<Task[]>(() =>
  Platform.OS === 'web' ? window.localStorage : require('@react-native-async-storage/async-storage').default
)

const content = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description for Task 1',
    completed: false,
    date: '2023-10-01',
    time: '10:00',
    priority: 'high',
    duration: 30,
    timeOfDay: 'morning',
    visualAid: '',
    color: '#FF0000',
    routineId: null,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
]

// Using the atomWithStorage hook to persist tasks using the correct storage
export const tasksAtom = atomWithStorage<Task[]>('@tarefitas:tasks', content, taskStorage)

// Get today's tasks atom
export const getTodaysTasksAtom = atom(
  async (get) => {
    const tasks = await get(tasksAtom)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    return tasks.filter((task: Task) => task.date === today)
  }
)

// Toggle task completion atom
export const toggleTaskCompletion = atom(
  null,
  async (get, set, id: string) => {
    const tasks = await get(tasksAtom)
    const resolvedTasks = [...tasks] // Ensure we don't modify the state directly
    const taskToToggle = resolvedTasks.find((task) => task.id === id)
    if (!taskToToggle) return

    const updatedCompleted = !taskToToggle.completed

    // Update the task's completion status
    resolvedTasks.map((task) =>
      task.id === id ? { ...task, completed: updatedCompleted } : task
    )
    set(tasksAtom, resolvedTasks) // Update the state atom
  }
)