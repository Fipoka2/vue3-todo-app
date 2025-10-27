<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2">mdi-filter</v-icon>
      Фильтры и поиск
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localFilters.search"
            label="Поиск по названию и описанию"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            @input="handleFiltersChange"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="localFilters.status"
            label="Статус"
            :items="statusOptions"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-check-circle"
            clearable
            @update:model-value="handleFiltersChange"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="localFilters.priority"
            label="Приоритет"
            :items="priorityOptions"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-flag"
            clearable
            @update:model-value="handleFiltersChange"
          />
        </v-col>
      </v-row>

      <v-row v-if="hasActiveFilters" class="mt-2">
        <v-col cols="12">
          <div class="d-flex align-center flex-wrap gap-2">
            <span class="text-caption text-grey">Активные фильтры:</span>
            
            <v-chip
              v-if="localFilters.status"
              closable
              color="primary"
              @click:close="clearStatusFilter"
            >
              Статус: {{ getStatusLabel(localFilters.status) }}
            </v-chip>
            
            <v-chip
              v-if="localFilters.priority"
              closable
              color="secondary"
              @click:close="clearPriorityFilter"
            >
              Приоритет: {{ getPriorityLabel(localFilters.priority) }}
            </v-chip>
            
            <v-chip
              v-if="localFilters.search"
              closable
              color="info"
              @click:close="clearSearchFilter"
            >
              Поиск: "{{ localFilters.search }}"
            </v-chip>
            
            <v-btn
              size="small"
              variant="text"
              color="error"
              @click="clearAllFilters"
            >
              <v-icon class="me-1" size="small">mdi-close</v-icon>
              Очистить все
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { TaskFilters, TaskStatus, TaskPriority } from '../types'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from '../types'

interface Props {
  filters: TaskFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: TaskFilters]
}>()

const localFilters = reactive<TaskFilters>({
  search: '',
  status: undefined,
  priority: undefined
})

const statusOptions = TASK_STATUSES.map(status => ({
  title: STATUS_LABELS[status],
  value: status
}))

const priorityOptions = TASK_PRIORITIES.map(priority => ({
  title: PRIORITY_LABELS[priority],
  value: priority
}))

const hasActiveFilters = computed(() => {
  return !!(localFilters.search || localFilters.status || localFilters.priority)
})

const handleFiltersChange = () => {
  emit('update:filters', { ...localFilters })
}

const clearStatusFilter = () => {
  localFilters.status = undefined
  handleFiltersChange()
}

const clearPriorityFilter = () => {
  localFilters.priority = undefined
  handleFiltersChange()
}

const clearSearchFilter = () => {
  localFilters.search = ''
  handleFiltersChange()
}

const clearAllFilters = () => {
  localFilters.search = ''
  localFilters.status = undefined
  localFilters.priority = undefined
  handleFiltersChange()
}

const getStatusLabel = (status: TaskStatus): string => {
  return STATUS_LABELS[status]
}

const getPriorityLabel = (priority: TaskPriority): string => {
  return PRIORITY_LABELS[priority]
}

watch(() => props.filters, (newFilters) => {
  localFilters.search = newFilters.search || ''
  localFilters.status = newFilters.status
  localFilters.priority = newFilters.priority
}, { immediate: true, deep: true })
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>