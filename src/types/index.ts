export type TaskStatus = 'todo' | 'in progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskData {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  search?: string
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in progress', 'done']

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'К выполнению',
  'in progress': 'В работе',
  'done': 'Выполнено'
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  'low': 'Низкий',
  'medium': 'Средний',
  'high': 'Высокий'
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  'low': 'green',
  'medium': 'orange',
  'high': 'red'
}