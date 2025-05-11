import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  date: z.date(),
  time: z.date().optional(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  duration: z.number().min(1).optional(),
  visualAid: z.string().optional(),
  color: z.string().optional(),
  routineId: z.string().optional(),
  daysOfWeek: z.array(z.number()).optional(),
});

export type Task = z.infer<typeof taskSchema>;