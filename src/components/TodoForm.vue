<template>
  <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="formData.title"
              label="Название задачи *"
              :rules="titleRules"
              required
              variant="outlined"
              prepend-inner-icon="mdi-format-title"
            />
          </v-col>
          
          <v-col cols="12" md="4">
            <v-select
              v-model="formData.priority"
              label="Приоритет"
              :items="priorityOptions"
              variant="outlined"
              prepend-inner-icon="mdi-flag"
            />
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12" md="8">
            <v-textarea
              v-model="formData.description"
              label="Описание (необязательно)"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              rows="3"
            />
          </v-col>
          
          <v-col cols="12" md="4">
            <v-select
              v-model="formData.status"
              label="Статус"
              :items="statusOptions"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle"
            />
          </v-col>
        </v-row>
        
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useTodoStore } from '../store/todoStore'
import type { Task, CreateTaskData, UpdateTaskData } from '../types'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from '../types'

interface Props {
  task?: Task
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
})

const emit = defineEmits<{
  cancel: []
  success: []
  'update:isFormValid': [value: boolean]
}>()

const todoStore = useTodoStore()

const formRef = ref()
const isFormValid = ref(false)
const isSubmitting = ref(false)

const formData = reactive<CreateTaskData>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium'
})

const checkUniqueTitle = (title: string): boolean => {
  const tasks = todoStore.tasks
  const titleLower = title.trim().toLowerCase()
  
  if (props.isEditing && props.task) {
    return !tasks.some(task => 
      task.id !== props.task!.id && 
      task.title.trim().toLowerCase() === titleLower
    )
  } else {
    return !tasks.some(task => task.title.trim().toLowerCase() === titleLower)
  }
}

const titleRules = [
  (v: string) => !!v || 'Название обязательно для заполнения',
  (v: string) => (v && v.length >= 2) || 'Название должно содержать минимум 2 символа',
  (v: string) => (v && v.length <= 100) || 'Название не должно превышать 100 символов',
  (v: string) => checkUniqueTitle(v) || 'Задача с таким названием уже существует'
]

const statusOptions = TASK_STATUSES.map(status => ({
  title: STATUS_LABELS[status],
  value: status
}))

const priorityOptions = TASK_PRIORITIES.map(priority => ({
  title: PRIORITY_LABELS[priority],
  value: priority
}))

watch(() => props.task, (newTask) => {
  if (newTask && props.isEditing) {
    formData.title = newTask.title
    formData.description = newTask.description || ''
    formData.status = newTask.status
    formData.priority = newTask.priority
  }
}, { immediate: true })

watch(isFormValid, (newValue) => {
  emit('update:isFormValid', newValue)
}, { immediate: true })

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.status = 'todo'
  formData.priority = 'medium'
  formRef.value?.resetValidation()
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    if (props.isEditing && props.task) {
      const updateData: UpdateTaskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority
      }
      todoStore.updateTask(props.task.id, updateData)
    } else {
      todoStore.addTask(formData)
    }
    
    resetForm()
    emit('success')
  } catch (error) {
    console.error('Ошибка при сохранении задачи:', error)
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({
  handleSubmit
})
</script>

<style scoped>
</style>