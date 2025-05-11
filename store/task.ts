import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { Platform } from 'react-native'
import { Task } from '@/types/task'

export type TaskWithId = Task & { id: string }

export type TaskAtom = {
  tasks: TaskWithId[]
}

const taskStorage = createJSONStorage<TaskWithId[]>(() =>
  Platform.OS === 'web' ? window.localStorage : require('@react-native-async-storage/async-storage').default
)

const content: TaskWithId[] = []

export const tasksAtom = atomWithStorage<TaskWithId[]>('@tarefitas:tasks', content, taskStorage)

export const getTodaysTasksAtom = atom(
  async (get) => {
    const tasks = await get(tasksAtom)
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter((task: Task) => task.date.toISOString().split('T')[0] === today)
  }
)

export const toggleTaskCompletion = atom(
  null,
  async (get, set, id: string) => {
    const tasks = await get(tasksAtom)
    const resolvedTasks = [...tasks]
    const taskToToggle = resolvedTasks.find((task) => task.id === id)
    if (!taskToToggle) return

    const updatedCompleted = !taskToToggle.completed

    resolvedTasks.map((task) =>
      task.id === id ? { ...task, completed: updatedCompleted } : task
    )
    set(tasksAtom, resolvedTasks)
  }
)