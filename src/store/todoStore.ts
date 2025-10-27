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
    return tasks.value.filter(task => {

      if (filters.value.status && task.status !== filters.value.status) {
        return false
      }
      
      if (filters.value.priority && task.priority !== filters.value.priority) {
        return false
      }
      
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(searchTerm)
        const matchesDescription = task.description && task.description.toLowerCase().includes(searchTerm)
        if (!matchesTitle && !matchesDescription) {
          return false
        }
      }
      
      return true
    })
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