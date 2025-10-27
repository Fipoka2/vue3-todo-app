<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2">mdi-format-list-bulleted</v-icon>
        Список задач
        <v-spacer />
        <v-chip color="primary" variant="text" class="me-2">
          Всего: {{ totalTasks }}
        </v-chip>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          
          @click="showAddForm"
        >
          Добавить
        </v-btn>
      </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="tasks"
      :loading="false"
      class="elevation-2"
      item-key="id"
      no-data-text="Задач не найдено"
      loading-text="Загрузка..."
      show-expand
    >
      <template #item.title="{ item }">
        <div class="d-flex align-center">
          <v-icon 
            :color="getStatusColor(item.status)" 
            class="me-2"
            size="small"
          >
            {{ getStatusIcon(item.status) }}
          </v-icon>
          <div class="font-weight-medium">{{ item.title }}</div>
          <v-icon 
            v-if="item.description"
            class="ml-2"
            color="grey"
            size="x-small"
          >
            mdi-text
          </v-icon>
        </div>
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="flat"
        >
          {{ STATUS_LABELS[item.status as TaskStatus] }}
        </v-chip>
      </template>

      <template #item.priority="{ item }">
        <v-chip
          :color="PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS]"
          size="small"
          variant="outlined"
        >
          {{ PRIORITY_LABELS[item.priority as keyof typeof PRIORITY_LABELS] }}
        </v-chip>
      </template>

      <template #item.createdAt="{ item }">
        <div class="text-caption">
          {{ formatDate(item.createdAt) }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            color="primary"
            @click="handleEdit(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="handleDelete(item)"
          />
        </div>
      </template>

      <template #expanded-row="{ item }">
        <tr>
          <td :colspan="headers.length" class="pa-4">
            <div class="text-body-2">
              <strong>Описание:</strong>
              <span v-if="item.description">{{ item.description }}</span>
              <span v-else class="text-grey font-italic"> не указано</span>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    </v-card>

    <v-dialog v-model="showFormDialog" max-width="900" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="me-2">{{ editingTask ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editingTask ? 'Редактировать задачу' : 'Добавить новую задачу' }}
        </v-card-title>
        
        <v-card-text>
          <TodoForm
            ref="todoFormRef"
            :task="editingTask || undefined"
            :is-editing="!!editingTask"
            @success="handleFormSuccess"
            @cancel="handleFormCancel"
            @update:isFormValid="isFormValid = $event"
          />
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="handleFormCancel"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            @click="handleFormSubmit"
            :disabled="!isFormValid"
          >
            <v-icon class="me-2">mdi-check</v-icon>
            {{ editingTask ? 'Сохранить' : 'Добавить' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
          Подтверждение удаления
        </v-card-title>
        
        <v-card-text>
          Вы уверены, что хотите удалить задачу 
          <strong>"{{ taskToDelete?.title }}"</strong>?
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showDeleteDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmDelete"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../store/todoStore'
import TodoForm from './TodoForm.vue'
import type { Task, TaskStatus } from '../types'
import { STATUS_LABELS, PRIORITY_LABELS, PRIORITY_COLORS } from '../types'

interface Props {
  tasks: Task[]
  totalTasks: number
}

defineProps<Props>()

const todoStore = useTodoStore()

const showFormDialog = ref(false)
const editingTask = ref<Task | null>(null)
const showDeleteDialog = ref(false)
const taskToDelete = ref<Task | null>(null)
const todoFormRef = ref()
const isFormValid = ref(false)

const headers = [
  { title: 'Задача', key: 'title', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Приоритет', key: 'priority', sortable: true },
  { title: 'Создано', key: 'createdAt', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false, width: '120px' }
]

const getStatusColor = (status: TaskStatus): string => {
  const colors = {
    'todo': 'orange',
    'in progress': 'blue',
    'done': 'green'
  }
  return colors[status]
}

const getStatusIcon = (status: TaskStatus): string => {
  const icons = {
    'todo': 'mdi-clock-outline',
    'in progress': 'mdi-progress-clock',
    'done': 'mdi-check-circle'
  }
  return icons[status]
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const handleEdit = (task: Task) => {
  editingTask.value = task
  isFormValid.value = false
  showFormDialog.value = true
}

const handleDelete = (task: Task) => {
  taskToDelete.value = task
  showDeleteDialog.value = true
}

const showAddForm = () => {
  editingTask.value = null
  isFormValid.value = false
  showFormDialog.value = true
}

const confirmDelete = () => {
  if (taskToDelete.value) {
    todoStore.deleteTask(taskToDelete.value.id)
    showDeleteDialog.value = false
    taskToDelete.value = null
  }
}

const handleFormSuccess = () => {
  showFormDialog.value = false
  editingTask.value = null
}

const handleFormCancel = () => {
  showFormDialog.value = false
  editingTask.value = null
  isFormValid.value = false
}

const handleFormSubmit = () => {
  if (todoFormRef.value) {
    todoFormRef.value.handleSubmit()
  }
}
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>