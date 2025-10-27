import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStatus } from '../types'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref<Task[]>([])
  const filters = ref<TaskFilters>({})

  const loadFromStorage = () => {
    const stored = localStorage.getItem('todo-tasks')
    if (stored) {
      try {
        const parsedTasks = JSON.parse(stored)
        tasks.value = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }))
      } catch (error) {
        console.error('Ошибка при загрузке задач из localStorage:', error)
        tasks.value = []
      }
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks.value))
    } catch (error) {
      console.error('Ошибка при сохранении задач в localStorage:', error)
    }
  }

  const generateId = (): string => Date.now().toString() + Math.random().toString().substring(2)

  const addTask = (taskData: CreateTaskData) => {
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    tasks.value.push(newTask)
    saveToStorage()
    return newTask
  }

  const updateTask = (id: string, updateData: UpdateTaskData) => {
    const taskIndex = tasks.value.findIndex(task => task.id === id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = {
        ...tasks.value[taskIndex],
        ...updateData,
        updatedAt: new Date()
      }
      saveToStorage()
      return tasks.value[taskIndex]
    }
    return null
  }

  const deleteTask = (id: string) => {
    const taskIndex = tasks.value.findIndex(task => task.id === id)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
      saveToStorage()
      return true
    }
    return false
  }

  const setFilters = (newFilters: TaskFilters) => {
    filters.value = { ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const filteredTasks = computed(() => {
    let result = tasks.value

    if (filters.value.status) {
      result = result.filter(task => task.status === filters.value.status)
    }


    if (filters.value.priority) {
      result = result.filter(task => task.priority === filters.value.priority)
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      )
    }

    return result
  })

  const tasksByStatus = computed(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in progress': [],
      'done': []
    }
    
    filteredTasks.value.forEach(task => {
      grouped[task.status].push(task)
    })
    
    return grouped
  })

  const totalTasks = computed(() => tasks.value.length)
  
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.status === 'done').length
  )

  const inProgressTasks = computed(() => 
    tasks.value.filter(task => task.status === 'in progress').length
  )

  const todoTasks = computed(() => 
    tasks.value.filter(task => task.status === 'todo').length
  )

  loadFromStorage()

  return {
    tasks,
    filters,
    
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    clearFilters,
    loadFromStorage,
    
    filteredTasks,
    tasksByStatus,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks
  }
})