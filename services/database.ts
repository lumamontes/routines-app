// src/services/database.ts
import * as SQLite from 'expo-sqlite';
import { formatISO, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define types
export type Priority = 'low' | 'medium' | 'high';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string; // ISO format (YYYY-MM-DD)
  time?: string; // HH:MM format
  routineId?: string;
  visualAid?: string; // URL or path to an image
  priority?: Priority;
  duration?: number; // Duration in minutes
  timeOfDay?: TimeOfDay; // Morning, afternoon, evening, or night
  createdAt: string;
  updatedAt: string;
  color?: string; // Color associated with the task
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  timeOfDay?: TimeOfDay;
  isActive: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineDay {
  routineId: string;
  day: number; // 0 = Sunday, 1 = Monday, etc.
}

// Database connection
export const dbPromise = SQLite.openDatabaseAsync('app.db');

// Initialize database schema
export const initDatabase = async (): Promise<void> => {
  try {
    const db = await dbPromise;
    
    // Create tasks table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        date TEXT NOT NULL,
        time TEXT,
        routineId TEXT,
        visualAid TEXT,
        priority TEXT,
        duration INTEGER,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (routineId) REFERENCES routines (id) ON DELETE SET NULL
      );
    `);
    
    // Create routines table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS routines (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        timeOfDay TEXT,
        isActive INTEGER DEFAULT 1,
        color TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create routine_days table for many-to-many relationship
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS routine_days (
        routineId TEXT,
        day INTEGER,
        PRIMARY KEY (routineId, day),
        FOREIGN KEY (routineId) REFERENCES routines (id) ON DELETE CASCADE
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Helper function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Task CRUD operations

// Create a new task
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  try {
    const db = await dbPromise;
    const id = generateId();
    const now = formatISO(new Date());
    
    await db.runAsync(
      `INSERT INTO tasks (
        id, title, description, completed, date, time, 
        routineId, visualAid, priority, duration, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        task.title,
        task.description || null,
        task.completed ? 1 : 0,
        task.date,
        task.time || null,
        task.routineId || null,
        task.visualAid || null,
        task.priority || null,
        task.duration || null,
        now,
        now
      ]
    );
    
    return {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
      completed: task.completed || false
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const db = await dbPromise;
    const tasks = await db.getAllAsync<any>('SELECT * FROM tasks ORDER BY date, time');
    
    return tasks.map(task => ({
      ...task,
      completed: !!task.completed // Convert INTEGER to boolean
    }));
  } catch (error) {
    console.error('Error getting all tasks:', error);
    throw error;
  }
};

// Get tasks for a specific date
export const getTasksByDate = async (date: string): Promise<Task[]> => {
  try {
    const db = await dbPromise;
    const tasks = await db.getAllAsync<any>(
      `SELECT * FROM tasks WHERE date = ? ORDER BY time`,
      [date]
    );
    
    // Get routine tasks for today's day of week
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const routineTasks = await db.getAllAsync<any>(
      `SELECT r.*, rd.day 
       FROM routines r
       JOIN routine_days rd ON r.id = rd.routineId
       WHERE rd.day = ? AND r.isActive = 1`,
      [dayOfWeek]
    );
    
    // Convert routine tasks to regular tasks if they don't already exist
    const routineBasedTasks: Task[] = [];
    
    for (const routine of routineTasks) {
      // Check if this routine already has a task for today
      const existingTask = tasks.find(t => t.routineId === routine.id);
      if (!existingTask) {
        routineBasedTasks.push({
          id: generateId(),
          title: routine.title,
          description: routine.description,
          completed: false,
          date: date,
          routineId: routine.id,
          timeOfDay: routine.timeOfDay,
          color: routine.color,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
    
    return [
      ...tasks.map(task => ({
        ...task,
        completed: !!task.completed // Convert INTEGER to boolean
      })),
      ...routineBasedTasks
    ].sort((a, b) => {
      // Sort by time if available, otherwise by title
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      } else if (a.time) {
        return -1;
      } else if (b.time) {
        return 1;
      }
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error getting tasks by date:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (task: Task): Promise<void> => {
  try {
    const db = await dbPromise;
    const now = formatISO(new Date());
    
    await db.runAsync(
      `UPDATE tasks SET 
        title = ?, 
        description = ?, 
        completed = ?, 
        date = ?, 
        time = ?, 
        routineId = ?, 
        visualAid = ?, 
        priority = ?, 
        duration = ?,
        updatedAt = ?
       WHERE id = ?`,
      [
        task.title,
        task.description || null,
        task.completed ? 1 : 0,
        task.date,
        task.time || null,
        task.routineId || null,
        task.visualAid || null,
        task.priority || null,
        task.duration || null,
        now,
        task.id
      ]
    );
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (id: string, completed: boolean): Promise<void> => {
  try {
    const db = await dbPromise;
    const now = formatISO(new Date());
    
    await db.runAsync(
      `UPDATE tasks SET completed = ?, updatedAt = ? WHERE id = ?`,
      [completed ? 1 : 0, now, id]
    );
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const db = await dbPromise;
    await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id]);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Routine CRUD operations

// Create a new routine
export const createRoutine = async (
  routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>, 
  days: number[]
): Promise<Routine> => {
  try {
    const db = await dbPromise;
    const id = generateId();
    const now = formatISO(new Date());
    
    // Begin transaction using execAsync
    await db.execAsync('BEGIN TRANSACTION');
    
    try {
      // Insert routine
      await db.runAsync(
        `INSERT INTO routines (
          id, title, description, timeOfDay, isActive, color, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          routine.title,
          routine.description || null,
          routine.timeOfDay || null,
          routine.isActive ? 1 : 0,
          routine.color || null,
          now,
          now
        ]
      );

      // Insert routine days
      for (const day of days) {
        await db.runAsync(
          `INSERT INTO routine_days (routineId, day) VALUES (?, ?)`,
          [id, day]
        );
      }
      
      // Commit transaction
      await db.execAsync('COMMIT');
    } catch (error) {
      // Rollback transaction on error
      await db.execAsync('ROLLBACK');
      throw error;
    }
    
    return {
      ...routine,
      id,
      createdAt: now,
      updatedAt: now,
      isActive: routine.isActive || true
    };
  } catch (error) {
    console.error('Error creating routine:', error);
    throw error;
  }
};

// Get all routines with their days
export const getAllRoutines = async (): Promise<{routine: Routine, days: number[]}[]> => {
  try {
    const db = await dbPromise;
    const routines = await db.getAllAsync<any>('SELECT * FROM routines ORDER BY title');
    
    const result: {routine: Routine, days: number[]}[] = [];
    
    for (const routineData of routines) {
      const days = await db.getAllAsync<{day: number}>(
        'SELECT day FROM routine_days WHERE routineId = ? ORDER BY day',
        [routineData.id]
      );
      
      result.push({
        routine: {
          ...routineData,
          isActive: !!routineData.isActive // Convert INTEGER to boolean
        },
        days: days.map(d => d.day)
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error getting all routines:', error);
    throw error;
  }
};

// Get a single routine with its days
export const getRoutineById = async (id: string): Promise<{routine: Routine, days: number[]} | null> => {
  try {
    const db = await dbPromise;
    const routines = await db.getAllAsync<any>(
      'SELECT * FROM routines WHERE id = ?',
      [id]
    );
    
    if (routines.length === 0) {
      return null;
    }
    
    const days = await db.getAllAsync<{day: number}>(
      'SELECT day FROM routine_days WHERE routineId = ? ORDER BY day',
      [id]
    );
    
    return {
      routine: {
        ...routines[0],
        isActive: !!routines[0].isActive // Convert INTEGER to boolean
      },
      days: days.map(d => d.day)
    };
  } catch (error) {
    console.error('Error getting routine by id:', error);
    throw error;
  }
};

// Update a routine
export const updateRoutine = async (
  routine: Routine, 
  days: number[]
): Promise<void> => {
  try {
    const db = await dbPromise;
    const now = formatISO(new Date());
    
    // Begin transaction using execAsync
    await db.execAsync('BEGIN TRANSACTION');
    
    try {
      // Update routine
      await db.runAsync(
        `UPDATE routines SET 
          title = ?, 
          description = ?, 
          timeOfDay = ?, 
          isActive = ?, 
          color = ?,
          updatedAt = ?
         WHERE id = ?`,
        [
          routine.title,
          routine.description || null,
          routine.timeOfDay || null,
          routine.isActive ? 1 : 0,
          routine.color || null,
          now,
          routine.id
        ]
      );
      
      // Delete existing routine days
      await db.runAsync(
        'DELETE FROM routine_days WHERE routineId = ?',
        [routine.id]
      );
      
      // Insert new routine days
      for (const day of days) {
        await db.runAsync(
          `INSERT INTO routine_days (routineId, day) VALUES (?, ?)`,
          [routine.id, day]
        );
      }
      
      // Commit transaction
      await db.execAsync('COMMIT');
    } catch (error) {
      // Rollback transaction on error
      await db.execAsync('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

// Delete a routine
export const deleteRoutine = async (id: string): Promise<void> => {
  try {
    const db = await dbPromise;
    
    // The routine_days entries will be automatically deleted due to ON DELETE CASCADE
    await db.runAsync(`DELETE FROM routines WHERE id = ?`, [id]);
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};

// Helper functions
export const formatDateToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatTimeString = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const getDayOfWeekName = (date: Date): string => {
  return format(date, 'EEEE', { locale: ptBR });
};

export const getDayNumber = (date: Date): number => {
  return date.getDay();
};

// Initialize database on import
initDatabase().catch(console.error);

export default {
  initDatabase,
  // Task operations
  createTask,
  getAllTasks,
  getTasksByDate,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  // Routine operations
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
  // Helper functions
  formatDateToISO,
  formatTimeString,
  getDayOfWeekName,
  getDayNumber,
  generateId
};